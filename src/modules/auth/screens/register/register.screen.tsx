import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { logger } from "@/shared/utils/logger";
import { RegisterForm } from "../../components";
import type { RegisterFormValues } from "./types";
import { registerSchema } from "./types";
import { styles } from "./styles";
import { useFieldVerification } from '@/modules/auth/hooks/useFieldVerification';

export default function RegisterScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ 
    fieldError?: string; 
    errorMessage?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    cpf?: string;
  }>();
  
  const {
    checkingFields,
    verificationResults,
    verifyWithDebounce,
  } = useFieldVerification();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="chevron-back" size={moderateScale(22, 0.3)} color={theme.colors.text.primary} />
        </TouchableOpacity>
      ),
      headerTitle: "",
      headerShadowVisible: false,
    });
  }, [navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      cpf: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const [serverError, setServerError] = useState<{ field: string; message: string } | null>(null);
  const [restoredParams, setRestoredParams] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Restaura dados do formulário se vier do terms (apenas uma vez)
  useEffect(() => {
    // Cria uma chave única dos params para detectar mudanças
    const paramsKey = `${params.fieldError || ''}-${params.errorMessage || ''}-${params.email || ''}`;
    
    // Só restaura se os params mudaram
    if (paramsKey === restoredParams) return;
    
    if (params.firstName) setValue('firstName', params.firstName);
    if (params.lastName) setValue('lastName', params.lastName);
    if (params.email) setValue('email', params.email);
    if (params.phone) setValue('phone', params.phone);
    if (params.cpf) setValue('cpf', params.cpf);
    
    // Mostra erro no campo específico (apenas se vier erro dos params)
    if (params.fieldError && params.errorMessage) {
      const field = params.fieldError as keyof RegisterFormValues;
      const message = auth[params.errorMessage as keyof typeof auth] || params.errorMessage;
      
      setServerError({ field: params.fieldError || 'email', message });
      
      setTimeout(() => {
        setError(field, {
          type: 'server',
          message,
        });
      }, 100);
    }
    // Não limpa serverError aqui - só atualiza se tiver novo erro
    
    setRestoredParams(paramsKey);
  }, [params, restoredParams]);

  const handleForgotPassword = () => {
    router.push({
      pathname: "/forgot-password" as any,
      params: { email: params.email || '' },
    });
  };

  const showForgotPasswordButton =
    serverError?.field === 'email' ||
    verificationResults.email?.isAvailable === false;

  const onSubmit = async (values: RegisterFormValues) => {
    // 🚀 INÍCIO DO FLUXO: Submissão do formulário
    logger.screenEvent('RegisterScreen', 'submit.start', {
      email: values.email,
      hasFirstName: !!values.firstName,
      hasPhone: !!values.phone,
      hasCpf: !!values.cpf,
    });

    // Força verificação de TODOS os campos críticos antes de navegar
    const criticalFields = [
      { field: 'email', value: values.email, minLength: 5 },
      { field: 'phone', value: values.phone, minLength: 10 },
      { field: 'cpf', value: values.cpf, minLength: 11 },
    ];
    
    // Armazena resultados localmente (não depende do estado do React)
    const verificationOutcomes: Record<string, { isAvailable: boolean; error?: string }> = {};
    
    // Verifica cada campo crítico (mesmo que já tenha sido verificado antes)
    for (const { field, value, minLength } of criticalFields) {
      const rawValue = value.replace(/\D/g, '');
      if (rawValue.length >= minLength) {
        logger.screenEvent('RegisterScreen', 'submit.verifying', { field, valueLength: rawValue.length });
        setIsVerifying(true);
        
        // Chama verificação e captura o resultado diretamente
        const result = await verifyWithDebounce(field, value, 0);
        
        // Aguarda a verificação completar
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Usa resultado local ou do estado (fallback)
        verificationOutcomes[field] = result || verificationResults[field] || { isAvailable: true };
        
        logger.screenEvent('RegisterScreen', 'submit.verified', { 
          field, 
          isAvailable: verificationOutcomes[field].isAvailable,
          error: verificationOutcomes[field].error 
        });
      }
    }
    
    setIsVerifying(false);
    
    // Verifica se há campos inválidos ou indisponíveis
    const hasUnavailableField = 
      verificationOutcomes.email?.isAvailable === false ||
      verificationOutcomes.phone?.isAvailable === false ||
      verificationOutcomes.cpf?.isAvailable === false;
    
    if (hasUnavailableField) {
      // 🔄 FLUXO ALTERNATIVO: Campo indisponível
      logger.warn('RegisterScreen', 'submit.blocked', 'Bloqueando navegação - campo indisponível', {
        emailAvailable: verificationOutcomes.email?.isAvailable,
        phoneAvailable: verificationOutcomes.phone?.isAvailable,
        cpfAvailable: verificationOutcomes.cpf?.isAvailable,
      });
      return;
    }
    
    // ✅ FIM DO FLUXO: Navegação para verificação por código
    logger.screenNavigate('RegisterScreen', 'VerificationScreen', {
      email: values.email,
      phone: values.phone,
    });

    router.push({
      pathname: "/verification" as any,
      params: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        cpf: values.cpf,
        password: values.password,
      },
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={[styles.header, { paddingTop: verticalScale(16) + insets.top }]}>
          <View style={styles.logoMark}>
            <Ionicons
              name="person-add-outline"
              size={moderateScale(22, 0.3)}
              color={theme.colors.primary.DEFAULT}
            />
          </View>
          <Text style={styles.appName}>Cawme</Text>
          <Text style={styles.tagline}>{auth.registerSubtitle}</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <RegisterForm
              control={control}
              errors={errors}
              isSubmitting={isSubmitting || isVerifying}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
              serverError={serverError}
              onForgotPassword={handleForgotPassword}
              checkingFields={checkingFields}
              verificationResults={verificationResults}
              onFieldChange={verifyWithDebounce}
              showForgotPasswordButton={showForgotPasswordButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
