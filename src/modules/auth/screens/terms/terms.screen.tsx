import React, { useState, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { logger } from "@/shared/utils/logger";
import { useRegister } from "@/modules/auth/hooks/useRegister";
import { useRegisterStore } from "@/modules/auth/store/register.store";
import { getErrorMessage } from "@/modules/auth/services/error-mapper";
import { styles } from "./styles";

function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function formatDocumentDisplay(value: string, documentType: string): string {
  const d = value.replace(/\D/g, "");
  if (documentType === "cpf") {
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  }
  if (documentType === "cnpj") {
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  }
  return value;
}

export default function TermsScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    document: string;
    documentType: string;
    password: string;
    userType?: string;
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    lat?: string;
    lng?: string;
  }>();
  const { register } = useRegister();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

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
      headerTitle: auth.termsTitle,
      headerShadowVisible: false,
    });
  }, [navigation]);

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenState, setScreenState] = useState<"terms" | "error">("terms");
  const [fieldError, setFieldError] = useState<{ field: string | null; message: string } | null>(null);

  const allFieldsValid =
    params.firstName &&
    params.lastName &&
    params.email &&
    params.phone &&
    params.document &&
    params.password;

  const handleSubmit = async () => {
    if (!accepted || !allFieldsValid) return;

    // 🚀 INÍCIO DO FLUXO: Registro de usuário
    logger.screenEvent('TermsScreen', 'register.start', {
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
    });

    setLoading(true);
    try {
      // 1. Cria conta com endereço junto (sem precisar de token extra)
      const documentRaw = params.document?.replace(/\D/g, "") || "";
      const { keycloakId } = await register({
        email: params.email,
        password: params.password,
        firstName: params.firstName,
        lastName: params.lastName,
        phone: params.phone.replace(/\D/g, ""),
        userType: (params.userType as "contractor" | "provider") ?? "contractor",
        ...(params.documentType === "cpf" ? { cpf: documentRaw } : {}),
        ...(params.documentType === "cnpj" ? { cnpj: documentRaw } : {}),
        ...(params.documentType === "rg" ? { rg: documentRaw } : {}),
        ...(params.documentType === "passport" ? { passport: params.document } : {}),
        termsAccepted: true,
        // Endereço (opcional - enviado junto no registro sem token)
        ...(params.cep && params.street ? {
          cep: params.cep,
          street: params.street,
          number: params.number,
          complement: params.complement,
          neighborhood: params.neighborhood,
          city: params.city,
          state: params.state,
          lat: params.lat,
          lng: params.lng,
        } : {}),
      });

      // 2. Salva credenciais temporárias, keycloakId e dados do registro pendente
      useRegisterStore.getState().setTempCredentials({
        email: params.email,
        password: params.password,
      });
      useRegisterStore.getState().setKeycloakId(keycloakId);
      useRegisterStore.getState().setPendingRegistration({
        keycloakId,
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        phone: params.phone,
        document: params.document,
        documentType: params.documentType,
        password: params.password,
      });

      // 3. Navega para tela de endereço se não tiver endereço
      const hasAddress = !!(params.cep && params.street);
      if (!hasAddress) {
        logger.screenEvent('TermsScreen', 'register.redirect-address', { email: params.email });
        router.replace({
          pathname: "/address" as any,
          params: {
            firstName: params.firstName,
            lastName: params.lastName,
            email: params.email,
            phone: params.phone,
            document: params.document,
            documentType: params.documentType,
            password: params.password,
            keycloakId,
          },
        });
        return;
      }

      // 4. Já tem endereço - vai direto pra verificação
      logger.screenEvent('TermsScreen', 'register.redirect-verification', { email: params.email });
      router.replace({
        pathname: "/verification" as any,
        params: {
          email: params.email,
          phone: params.phone,
          firstName: params.firstName,
          lastName: params.lastName,
          mode: "post-register",
        },
      });
    } catch (error: any) {
      // 🔄 FLUXO ALTERNATIVO: Erro no registro
      logger.error('TermsScreen', 'register.error', 'Erro no registro', error, {
        status: error?.response?.status,
        field: error?.response?.data?.field,
        message: error?.response?.data?.message,
      });

      const messageKey = getErrorMessage(error);
      const field = (error as any)?.response?.data?.field ?? null;
      const message = auth[messageKey as keyof typeof auth] || messageKey;

      setFieldError({ field, message });
      setScreenState("error");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEdit = () => {
    router.push({
      pathname: "/register" as any,
      params: {
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        phone: params.phone,
        document: params.document,
        documentType: params.documentType,
        userType: params.userType,
        fieldError: fieldError?.field,
        errorMessage: fieldError?.message,
      },
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{auth.registerTitle}</Text>

            {fieldError && fieldError.field === null && (
              <View style={styles.genericErrorContainer}>
                <Ionicons name="alert-circle" size={moderateScale(16, 0.3)} color={theme.colors.status.error} />
                <Text style={styles.genericErrorMessage}>{fieldError.message}</Text>
              </View>
            )}

            {/* Campo Nome */}
            <View style={styles.summaryRow}>
              <Ionicons name="person-outline" size={moderateScale(16, 0.3)} color={theme.colors.text.secondary} />
              <Text style={styles.summaryText}>{params.firstName} {params.lastName}</Text>
            </View>
            
            {/* Campo Email com erro */}
            <View style={styles.summaryRow}>
              <Ionicons 
                name="mail-outline" 
                size={moderateScale(16, 0.3)} 
                color={fieldError?.field === 'email' ? theme.colors.status.error : theme.colors.text.secondary} 
              />
              <Text style={[
                styles.summaryText,
                fieldError?.field === 'email' && styles.summaryTextError
              ]}>{params.email}</Text>
            </View>
            {fieldError?.field === 'email' && (
              <View style={styles.fieldErrorContainer}>
                <Ionicons name="alert-circle" size={moderateScale(14, 0.3)} color={theme.colors.status.error} />
                <Text style={styles.fieldErrorMessage}>{fieldError.message}</Text>
              </View>
            )}
            
            {/* Campo Telefone */}
            <View style={styles.summaryRow}>
              <Ionicons 
                name="call-outline" 
                size={moderateScale(16, 0.3)} 
                color={fieldError?.field === 'phone' ? theme.colors.status.error : theme.colors.text.secondary} 
              />
              <Text style={[
                styles.summaryText,
                fieldError?.field === 'phone' && styles.summaryTextError
              ]}>{formatPhoneDisplay(params.phone)}</Text>
            </View>
            {fieldError?.field === 'phone' && (
              <View style={styles.fieldErrorContainer}>
                <Ionicons name="alert-circle" size={moderateScale(14, 0.3)} color={theme.colors.status.error} />
                <Text style={styles.fieldErrorMessage}>{fieldError.message}</Text>
              </View>
            )}
            
            {/* Campo Documento */}
            <View style={styles.summaryRow}>
              <Ionicons 
                name="card-outline" 
                size={moderateScale(16, 0.3)} 
                color={fieldError?.field === 'document' ? theme.colors.status.error : theme.colors.text.secondary} 
              />
              <Text style={[
                styles.summaryText,
                fieldError?.field === 'document' && styles.summaryTextError
              ]}>{formatDocumentDisplay(params.document, params.documentType)}</Text>
            </View>
            {fieldError?.field === 'document' && (
              <View style={styles.fieldErrorContainer}>
                <Ionicons name="alert-circle" size={moderateScale(14, 0.3)} color={theme.colors.status.error} />
                <Text style={styles.fieldErrorMessage}>{fieldError.message}</Text>
              </View>
            )}
          </View>

          <View style={styles.termsCard}>
            <Text style={styles.termsCardTitle}>{auth.termsTitle}</Text>
            <Text style={styles.termsText}>{auth.termsContent}</Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity
            style={[styles.checkboxRow]}
            onPress={() => setAccepted((prev) => !prev)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxActive]}>
              {accepted && (
                <Ionicons
                  name="checkmark"
                  size={moderateScale(14, 0.3)}
                  color={theme.palette.neutral[0]}
                />
              )}
            </View>
            <Text style={styles.checkboxText}>
              {auth.termsAcceptCheckbox}{" "}
              <Text style={styles.linkText}>{auth.termsLinkText}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!accepted || loading || screenState === "error") && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!accepted || loading || screenState === "error"}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={theme.palette.neutral[0]} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {auth.termsFinalizeButton}
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Botão para voltar e editar quando há erro */}
          {screenState === "error" && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleBackToEdit}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={moderateScale(18, 0.3)} color={theme.colors.primary.DEFAULT} />
              <Text style={styles.editButtonText}>Editar cadastro</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
