import { useState, useRef, useCallback } from 'react';
import { apiClient } from '@/shared/services/api-client';
import { logger } from '@/shared/utils/logger';

export interface VerificationResult {
  isValid: boolean;
  isAvailable: boolean;
  error?: string;
}

export function useFieldVerification() {
  const [checkingFields, setCheckingFields] = useState<Record<string, boolean>>({});
  const [verificationResults, setVerificationResults] = useState<Record<string, VerificationResult>>({});
  
  // Debounce timers
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  // Abort controllers para cancelar requisições
  const abortControllers = useRef<Record<string, AbortController>>({});

  const verifyField = useCallback(async (field: string, value: string) => {
    // Mapeia nomes do frontend para nomes da API
    const apiFieldMap: Record<string, string> = {
      email: 'email',
      phone: 'phone',
      document: 'document',
    };
    
    const apiField = apiFieldMap[field] || field;
    const requestId = `${field}-${Date.now()}`;

    // Cancela verificação anterior do mesmo campo
    if (abortControllers.current[field]) {
      logger.screenEvent('FieldVerification', 'canceling', { 
        requestId, 
        field, 
        apiField 
      });
      abortControllers.current[field].abort();
    }

    // Cria novo abort controller
    const controller = new AbortController();
    abortControllers.current[field] = controller;

    // 🚀 INÍCIO DO FLUXO: Verificação de campo
    logger.screenEvent('FieldVerification', 'verify.start', { 
      requestId, 
      field, 
      apiField, 
      valueLength: value.length 
    });
    
    setCheckingFields(prev => ({ ...prev, [field]: true }));

    try {
      const response = await apiClient.post(
        `/bff/onboarding/verify/${apiField}`,
        { [apiField]: value },
        { signal: controller.signal }
      );

      // ✅ FIM DO FLUXO: Sucesso
      logger.screenEvent('FieldVerification', 'verify.success', { 
        requestId, 
        field, 
        apiField, 
        isValid: response.data.valid, 
        isAvailable: response.data.available 
      });

      setVerificationResults(prev => ({
        ...prev,
        [field]: {
          isValid: response.data.valid,
          isAvailable: response.data.available,
        }
      }));

      return { isValid: true, isAvailable: true };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // 🔄 FLUXO ALTERNATIVO: Cancelado
        logger.screenEvent('FieldVerification', 'verify.aborted', { 
          requestId, 
          field, 
          apiField 
        });
        return null;
      }

      if (error.response?.status === 409) {
        // 🔄 FLUXO ALTERNATIVO: Campo já cadastrado
        logger.warn('FieldVerification', 'verify.conflict', 'Campo já cadastrado', { 
          requestId, 
          field, 
          apiField,
          message: error.response.data.message 
        });
        
        setVerificationResults(prev => ({
          ...prev,
          [field]: {
            isValid: true,
            isAvailable: false,
            error: error.response.data.message,
          }
        }));
        return { isValid: true, isAvailable: false, error: error.response.data.message };
      }

      if (error.response?.status === 429) {
        // 🔄 FLUXO ALTERNATIVO: Rate limit
        logger.warn('FieldVerification', 'verify.ratelimit', 'Rate limit excedido', { 
          requestId, 
          field, 
          apiField 
        });
        return null;
      }

      if (error.response?.status === 400 || error.response?.status === 422) {
        // 🔄 FLUXO ALTERNATIVO: Campo inválido
        logger.warn('FieldVerification', 'verify.invalid', 'Formato inválido', { 
          requestId, 
          field, 
          apiField,
          message: error.response.data.message 
        });
        
        setVerificationResults(prev => ({
          ...prev,
          [field]: {
            isValid: false,
            isAvailable: false,
            error: error.response.data.message,
          }
        }));
        return { isValid: false, isAvailable: false, error: error.response.data.message };
      }

      // ❌ FIM DO FLUXO: Erro genérico
      logger.error('FieldVerification', 'verify.error', 'Erro na verificação', error, { 
        requestId, 
        field, 
        apiField
      });
      
      return { isValid: false, isAvailable: false };
    } finally {
      setCheckingFields(prev => ({ ...prev, [field]: false }));
    }
  }, []);

  const verifyWithDebounce = useCallback((field: string, value: string, delay: number = 500): Promise<VerificationResult | null> => {
    // Limpa timer anterior
    if (debounceTimers.current[field]) {
      clearTimeout(debounceTimers.current[field]);
    }

    // Validações básicas antes de verificar
    const rawValue = value.replace(/\D/g, '');
    const minLength: Record<string, number> = {
      email: 5,
      phone: 10,
      document: 6,
    };

    if (!value || rawValue.length < (minLength[field] || 1)) {
      logger.screenEvent('FieldVerification', 'verify.skipped', { field, reason: 'value too short', rawLength: rawValue.length });
      return Promise.resolve(null); // Não verifica se campo muito curto
    }

    // Agenda verificação com debounce
    if (delay > 0) {
      logger.screenEvent('FieldVerification', 'verify.scheduled', { field, delay });
      return new Promise((resolve) => {
        debounceTimers.current[field] = setTimeout(() => {
          verifyField(field, value).then(resolve);
        }, delay);
      });
    } else {
      // Verificação imediata (delay = 0)
      logger.screenEvent('FieldVerification', 'verify.immediate', { field, rawLength: rawValue.length });
      return verifyField(field, value);
    }
  }, [verifyField]);

  const clearVerification = useCallback((field: string) => {
    if (debounceTimers.current[field]) {
      clearTimeout(debounceTimers.current[field]);
    }
    if (abortControllers.current[field]) {
      abortControllers.current[field].abort();
    }
    setVerificationResults(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setCheckingFields(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return {
    checkingFields,
    verificationResults,
    verifyWithDebounce,
    clearVerification,
  };
}
