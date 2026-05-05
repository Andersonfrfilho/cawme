# API de Verificação de Campos - Cadastro

## Visão Geral

Endpoints para validação em tempo real de campos durante o cadastro, protegidos contra ataques de stress e chamadas excessivas.

---

## 🎯 Requisitos de Segurança

### Rate Limiting

- **Janela de tempo:** 1 minuto
- **Máximo de requisições:** 5 por campo
- **Máximo total:** 10 requisições por sessão de cadastro
- **Bloqueio temporário:** 5 minutos após exceder limite

### Debounce no Frontend

- **Delay mínimo:** 500ms após usuário parar de digitar
- **Comprimento mínimo:**
  - Email: 5 caracteres
  - Telefone: 10 caracteres
  - CPF: 11 caracteres

### Proteções

- ✅ Não validar campo vazio
- ✅ Não validar enquanto usuário digita
- ✅ Cancelar requisição anterior se nova digitação começar
- ✅ Mostrar indicador de "Verificando..." durante validação

---

## 📋 Endpoints

### 1. Verificar Email

```http
POST /onboarding/verify/email
Content-Type: application/json
```

**Request:**

```json
{
  "email": "usuario@email.com"
}
```

**Response 200 - Email disponível:**

```json
{
  "available": true,
  "valid": true
}
```

**Response 409 - Email já cadastrado:**

```json
{
  "statusCode": 409,
  "error": "EMAIL_ALREADY_EXISTS",
  "message": "E-mail já está em uso",
  "field": "email"
}
```

**Response 422 - Email inválido:**

```json
{
  "statusCode": 422,
  "error": "INVALID_EMAIL",
  "message": "Formato de e-mail inválido",
  "field": "email"
}
```

**Response 429 - Rate limit excedido:**

```json
{
  "statusCode": 429,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Muitas tentativas. Tente novamente em 5 minutos.",
  "retryAfter": 300
}
```

---

### 2. Verificar Telefone

```http
POST /onboarding/verify/phone
Content-Type: application/json
```

**Request:**

```json
{
  "phone": "11999999999"
}
```

**Response 200 - Telefone disponível:**

```json
{
  "available": true,
  "valid": true
}
```

**Response 409 - Telefone já cadastrado:**

```json
{
  "statusCode": 409,
  "error": "PHONE_ALREADY_EXISTS",
  "message": "Telefone já está cadastrado",
  "field": "phone"
}
```

**Response 422 - Telefone inválido:**

```json
{
  "statusCode": 422,
  "error": "INVALID_PHONE",
  "message": "Formato de telefone inválido",
  "field": "phone"
}
```

**Response 429 - Rate limit excedido:**

```json
{
  "statusCode": 429,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Muitas tentativas. Tente novamente em 5 minutos.",
  "retryAfter": 300
}
```

---

### 3. Verificar CPF

```http
POST /onboarding/verify/cpf
Content-Type: application/json
```

**Request:**

```json
{
  "cpf": "12345678909"
}
```

**Response 200 - CPF disponível:**

```json
{
  "available": true,
  "valid": true
}
```

**Response 409 - CPF já cadastrado:**

```json
{
  "statusCode": 409,
  "error": "CPF_ALREADY_EXISTS",
  "message": "CPF já está cadastrado",
  "field": "cpf"
}
```

**Response 422 - CPF inválido:**

```json
{
  "statusCode": 422,
  "error": "INVALID_CPF",
  "message": "CPF inválido",
  "field": "cpf"
}
```

**Response 429 - Rate limit excedido:**

```json
{
  "statusCode": 429,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Muitas tentativas. Tente novamente em 5 minutos.",
  "retryAfter": 300
}
```

---

## 🛡️ Implementação de Rate Limiting

### Exemplo: Node.js + Express

```typescript
import rateLimit from "express-rate-limit";

// Rate limit específico para verificação de campos
const fieldVerificationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // 5 requisições por campo por minuto
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Usa IP + campo sendo verificado como chave
    const field = req.params.field || "unknown";
    return `${req.ip}:${field}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      statusCode: 429,
      error: "RATE_LIMIT_EXCEEDED",
      message: "Muitas tentativas. Tente novamente em 5 minutos.",
      retryAfter: 300,
    });
  },
});

// Rate limit global por sessão
const sessionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 requisições totais por sessão
  keyGenerator: (req) => {
    // Usa session ID ou IP
    return req.session?.id || req.ip;
  },
});

// Rotas
app.post(
  "/onboarding/verify/email",
  sessionLimiter,
  fieldVerificationLimiter,
  verifyEmailHandler,
);

app.post(
  "/onboarding/verify/phone",
  sessionLimiter,
  fieldVerificationLimiter,
  verifyPhoneHandler,
);

app.post(
  "/onboarding/verify/cpf",
  sessionLimiter,
  fieldVerificationLimiter,
  verifyCpfHandler,
);
```

---

## 📱 Implementação no Frontend

### Hook com Debounce e Cancelamento

```typescript
import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/shared/services/api-client";

interface VerificationResult {
  isValid: boolean;
  isAvailable: boolean;
  error?: string;
}

export function useFieldVerification() {
  const [checkingFields, setCheckingFields] = useState<Record<string, boolean>>(
    {},
  );
  const [verificationResults, setVerificationResults] = useState<
    Record<string, VerificationResult>
  >({});

  // Debounce timers
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  // Abort controllers para cancelar requisições
  const abortControllers = useRef<Record<string, AbortController>>({});

  const verifyField = useCallback(async (field: string, value: string) => {
    // Cancela verificação anterior do mesmo campo
    if (abortControllers.current[field]) {
      abortControllers.current[field].abort();
    }

    // Cria novo abort controller
    const controller = new AbortController();
    abortControllers.current[field] = controller;

    setCheckingFields((prev) => ({ ...prev, [field]: true }));

    try {
      const response = await apiClient.post(
        `/onboarding/verify/${field}`,
        { [field]: value },
        { signal: controller.signal },
      );

      setVerificationResults((prev) => ({
        ...prev,
        [field]: {
          isValid: response.data.valid,
          isAvailable: response.data.available,
        },
      }));

      return { isValid: true, isAvailable: true };
    } catch (error: any) {
      if (error.name === "AbortError") {
        // Requisição cancelada, ignora
        return null;
      }

      if (error.response?.status === 409) {
        // Campo já cadastrado
        setVerificationResults((prev) => ({
          ...prev,
          [field]: {
            isValid: true,
            isAvailable: false,
            error: error.response.data.message,
          },
        }));
        return {
          isValid: true,
          isAvailable: false,
          error: error.response.data.message,
        };
      }

      if (error.response?.status === 429) {
        // Rate limit
        console.warn("Rate limit excedido para campo:", field);
        return null;
      }

      return { isValid: false, isAvailable: false };
    } finally {
      setCheckingFields((prev) => ({ ...prev, [field]: false }));
    }
  }, []);

  const verifyWithDebounce = useCallback(
    (field: string, value: string, delay: number = 500) => {
      // Limpa timer anterior
      if (debounceTimers.current[field]) {
        clearTimeout(debounceTimers.current[field]);
      }

      // Validações básicas antes de verificar
      if (!value || value.length < getMinLength(field)) {
        return; // Não verifica se campo muito curto
      }

      // Agenda verificação com debounce
      debounceTimers.current[field] = setTimeout(() => {
        verifyField(field, value);
      }, delay);
    },
    [verifyField],
  );

  const getMinLength = (field: string) => {
    switch (field) {
      case "email":
        return 5;
      case "phone":
        return 10;
      case "cpf":
        return 11;
      default:
        return 1;
    }
  };

  const clearVerification = useCallback((field: string) => {
    if (debounceTimers.current[field]) {
      clearTimeout(debounceTimers.current[field]);
    }
    if (abortControllers.current[field]) {
      abortControllers.current[field].abort();
    }
    setVerificationResults((prev) => {
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
```

### Uso no RegisterScreen

```typescript
export default function RegisterScreen() {
  const {
    checkingFields,
    verificationResults,
    verifyWithDebounce,
    clearVerification
  } = useFieldVerification();

  const handleEmailChange = (value: string) => {
    // Verifica email com debounce de 500ms
    verifyWithDebounce('email', value, 500);
  };

  const handlePhoneChange = (value: string) => {
    // Verifica telefone com debounce de 500ms
    verifyWithDebounce('phone', value, 500);
  };

  const handleCpfChange = (value: string) => {
    // Verifica CPF com debounce de 500ms
    verifyWithDebounce('cpf', value, 500);
  };

  return (
    <RegisterForm
      control={control}
      errors={errors}
      checkingFields={checkingFields}
      serverError={verificationResults}
      onEmailChange={handleEmailChange}
      onPhoneChange={handlePhoneChange}
      onCpfChange={handleCpfChange}
    />
  );
}
```

---

## 📊 Monitoramento

### Métricas para Acompanhar

| Métrica           | Alerta    | Descrição             |
| ----------------- | --------- | --------------------- |
| Requests/min      | > 1000    | Possível ataque       |
| Rate limit hits   | > 100/min | Usuários frustrados   |
| Avg response time | > 500ms   | Performance ruim      |
| Error rate        | > 5%      | Problemas no endpoint |

### Logs Sugeridos

```typescript
// Log de verificação
console.log("[VERIFY] Email check", {
  email: "user@email.com",
  result: "available",
  duration: 123,
  ip: "192.168.1.1",
});

// Log de rate limit
console.warn("[RATE LIMIT] Exceeded for field", {
  field: "email",
  ip: "192.168.1.1",
  attempts: 6,
  windowMs: 60000,
});
```

---

## ✅ Checklist de Implementação

### Backend

- [ ] Criar endpoint `/onboarding/verify/email`
- [ ] Criar endpoint `/onboarding/verify/phone`
- [ ] Criar endpoint `/onboarding/verify/cpf`
- [ ] Implementar rate limiting por campo
- [ ] Implementar rate limiting por sessão
- [ ] Retornar erros padronizados
- [ ] Adicionar logs de monitoramento
- [ ] Configurar alertas de métricas

### Frontend

- [ ] Implementar debounce (500ms)
- [ ] Implementar cancelamento de requisições
- [ ] Mostrar indicador "Verificando..."
- [ ] Validar comprimento mínimo antes de chamar API
- [ ] Tratar erro 429 (rate limit)
- [ ] Mostrar erro inline no campo
- [ ] Limpar verificação ao limpar campo

---

## 🔗 Referências

- [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
- [AbortController MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [Debounce Implementation](https://www.npmjs.com/package/lodash.debounce)

---

**Status:** 📝 Documento de especificação
**Prioridade:** Alta
**Complexidade:** Média
