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
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useAppConfig } from "@/modules/auth/hooks/useAppConfig";
import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { getErrorMessage } from "@/modules/auth/services/error-mapper";
import { styles } from "./styles";

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

  const setUser = useAuthStore((s) => s.setUser);
  const { isDocumentPhotoVerificationEnabled } = useAppConfig();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenState, setScreenState] = useState<"terms" | "error">("terms");
  const [fieldError, setFieldError] = useState<{ field: string; message: string } | null>(null);

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
      // 1. Cria conta
      await register({
        email: params.email,
        password: params.password,
        firstName: params.firstName,
        lastName: params.lastName,
        phone: params.phone.replace(/\D/g, ""),
        cpf: params.document.replace(/\D/g, ""),
      });

      // 2. Login automático para obter token
      logger.screenEvent('TermsScreen', 'register.auto-login', { email: params.email });
      const { id, name, email } = await KeycloakService.login({
        username: params.email,
        password: params.password,
      });

      // 3. Salva usuário no store
      logger.screenEvent('TermsScreen', 'register.redirect', { email: params.email });
      setUser({ id, name, email, type: "contractor" });

      // 4. Decide próxima tela conforme feature flags
      if (isDocumentPhotoVerificationEnabled) {
        logger.screenEvent('TermsScreen', 'register.redirect-document-upload', { email: params.email });
        router.replace({
          pathname: "/document-upload" as any,
          params: {
            email: params.email,
            phone: params.phone,
            mode: "post-register",
          },
        });
      } else {
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
      }
    } catch (error: any) {
      // 🔄 FLUXO ALTERNATIVO: Erro no registro
      logger.error('TermsScreen', 'register.error', 'Erro no registro', error, {
        status: error?.response?.status,
        field: error?.response?.data?.field,
        message: error?.response?.data?.message,
      });

      const messageKey = getErrorMessage(error);
      const field = (error as any)?.response?.data?.field || 'email';
      const message = auth[messageKey as keyof typeof auth] || messageKey;

      // Mostra erro inline na tela
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
              ]}>{params.phone}</Text>
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
              ]}>{params.document}</Text>
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
              (!accepted || loading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!accepted || loading}
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
