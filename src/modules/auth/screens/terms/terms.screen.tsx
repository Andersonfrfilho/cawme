import React, { useState, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";
import { logger } from "@/shared/utils/logger";
import { useRegister } from "@/modules/auth/hooks/useRegister";
import { getErrorMessage } from "@/modules/auth/services/error-mapper";
import { RegisterSuccess } from "../../components";
import { styles } from "./styles";

export default function TermsScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const params = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    cpf: string;
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

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenState, setScreenState] = useState<"terms" | "success" | "error">("terms");
  const [fieldError, setFieldError] = useState<{ field: string; message: string } | null>(null);

  const allFieldsValid =
    params.firstName &&
    params.lastName &&
    params.email &&
    params.phone &&
    params.cpf &&
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
      await register({
        email: params.email,
        password: params.password,
        firstName: params.firstName,
        lastName: params.lastName,
        phone: params.phone.replace(/\D/g, ""),
        cpf: params.cpf.replace(/\D/g, ""),
      });
      
      // ✅ FIM DO FLUXO: Sucesso
      logger.screenEvent('TermsScreen', 'register.success', {
        email: params.email,
      });
      
      setScreenState("success");
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
    router.back();
  };

  if (screenState === "success") {
    return (
      <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
        <StatusBar barStyle="dark-content" />
        <RegisterSuccess
          email={params.email}
          onGoToLogin={() => router.replace("/login" as any)}
        />
      </SafeAreaView>
    );
  }

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
            
            {/* Campo CPF */}
            <View style={styles.summaryRow}>
              <Ionicons 
                name="card-outline" 
                size={moderateScale(16, 0.3)} 
                color={fieldError?.field === 'cpf' ? theme.colors.status.error : theme.colors.text.secondary} 
              />
              <Text style={[
                styles.summaryText,
                fieldError?.field === 'cpf' && styles.summaryTextError
              ]}>{params.cpf}</Text>
            </View>
            {fieldError?.field === 'cpf' && (
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
