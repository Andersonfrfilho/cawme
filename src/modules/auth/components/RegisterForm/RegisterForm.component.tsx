import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useFormState } from "react-hook-form";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { styles } from "./styles";
import type { RegisterFormProps, RegisterFormValues, DocumentType } from "./types";

type FieldName = keyof RegisterFormValues;

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatDocument(value: string, documentType: DocumentType): string {
  if (documentType === "passport") {
    return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 12);
  }

  const digits = value.replace(/\D/g, "");

  if (documentType === "cpf") {
    const formatted = digits.slice(0, 11);
    if (formatted.length <= 3) return formatted;
    if (formatted.length <= 6) return `${formatted.slice(0, 3)}.${formatted.slice(3)}`;
    if (formatted.length <= 9) return `${formatted.slice(0, 3)}.${formatted.slice(3, 6)}.${formatted.slice(6)}`;
    return `${formatted.slice(0, 3)}.${formatted.slice(3, 6)}.${formatted.slice(6, 9)}-${formatted.slice(9)}`;
  }
  
  if (documentType === "cnpj") {
    const formatted = digits.slice(0, 14);
    if (formatted.length <= 2) return formatted;
    if (formatted.length <= 5) return `${formatted.slice(0, 2)}.${formatted.slice(2)}`;
    if (formatted.length <= 8) return `${formatted.slice(0, 2)}.${formatted.slice(2, 5)}.${formatted.slice(5)}`;
    if (formatted.length <= 12) return `${formatted.slice(0, 2)}.${formatted.slice(2, 5)}.${formatted.slice(5, 8)}/${formatted.slice(8)}`;
    return `${formatted.slice(0, 2)}.${formatted.slice(2, 5)}.${formatted.slice(5, 8)}/${formatted.slice(8, 12)}-${formatted.slice(12)}`;
  }
  
  if (documentType === "rg") {
    const formatted = digits.slice(0, 12);
    if (formatted.length <= 2) return formatted;
    if (formatted.length <= 5) return `${formatted.slice(0, 2)}.${formatted.slice(2)}`;
    if (formatted.length <= 8) return `${formatted.slice(0, 2)}.${formatted.slice(2, 5)}.${formatted.slice(5)}`;
    return `${formatted.slice(0, 2)}.${formatted.slice(2, 5)}.${formatted.slice(5, 8)}-${formatted.slice(8)}`;
  }
  
  return digits.slice(0, 12);
}

function getDocumentMaxLength(documentType: DocumentType): number {
  if (documentType === "cpf") return 14;
  if (documentType === "cnpj") return 18;
  if (documentType === "rg") return 15;
  return 12;
}

function getRawLength(value: string): number {
  return value.replace(/[^a-zA-Z0-9]/g, "").length;
}

export const RegisterForm: React.FC<RegisterFormProps & { 
  serverError?: { field: string; message: string } | null;
  onForgotPassword?: () => void;
  checkingFields?: Record<string, boolean>;
  verificationResults?: Record<string, any>;
  onFieldChange?: (field: string, value: string) => void;
  showForgotPasswordButton?: boolean;
}> = ({
  control,
  errors,
  isSubmitting,
  onSubmit,
  handleSubmit,
  serverError,
  onForgotPassword,
  checkingFields,
  verificationResults,
  onFieldChange,
  showForgotPasswordButton = false,
}) => {
  const { auth } = useLocale<LocaleKeys>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("cpf");
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const documentRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const { isValid } = useFormState({ control });

  const hasFieldError = (field: FieldName) =>
    !!errors[field] || !!(verificationResults?.[field]?.error);

  const hasVerificationError = Object.values(verificationResults ?? {}).some(
    (result) => !!(result as any)?.error,
  );

  const isButtonDisabled = !isValid || isSubmitting || hasVerificationError;

  const getIconColor = (field: FieldName) => {
    if (hasFieldError(field)) return theme.colors.status.error;
    if (focusedField === field) return theme.colors.primary.DEFAULT;
    return theme.palette.neutral[400];
  };

  const getErrorMessage = (message?: string) => {
    if (!message) return "";
    if (message === "passwordMismatch") return auth.registerPasswordMismatch;
    const translated = (auth as Record<string, string>)[message];
    return translated || message;
  };

  const renderField = (
    name: FieldName,
    placeholder: string,
    iconName: string,
    config?: {
      secureTextEntry?: boolean;
      showToggle?: boolean;
      showPassword?: boolean;
      onToggle?: () => void;
      keyboardType?: "email-address" | "phone-pad" | "numeric" | "default";
      autoCapitalize?: "none" | "sentences" | "words" | "characters";
      returnKeyType?: "next" | "done";
      onSubmitEditing?: () => void;
      inputRef?: React.RefObject<TextInput | null>;
      maxLength?: number;
      textContentType?: "none" | "givenName" | "familyName" | "emailAddress" | "telephoneNumber" | "oneTimeCode";
      fieldKey?: string;
      formatter?: (value: string) => string;
      onChangeFormatter?: (value: string) => string;
      nextRef?: React.RefObject<TextInput | null>;
    },
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => {
        const handleChangeText = (text: string) => {
          let processed = text;
          if (config?.onChangeFormatter) {
            processed = config.onChangeFormatter(text);
          }
          onChange(processed);
          const rawLength = getRawLength(processed);
          if (config?.maxLength && config?.nextRef && rawLength >= config.maxLength) {
            config.nextRef.current?.focus();
          }
        };

        return (
          <>
            <View
              style={[
                styles.inputRow,
                focusedField === name && styles.inputRowFocused,
                hasFieldError(name) && styles.inputRowError,
              ]}
            >
              <Ionicons
                name={iconName as any}
                size={moderateScale(18, 0.3)}
                color={getIconColor(name)}
                style={styles.inputIcon}
              />
              <TextInput
                key={config?.fieldKey ?? name}
                testID={`register-${name}`}
                ref={config?.inputRef}
                style={styles.inputText}
                placeholder={placeholder}
                placeholderTextColor={theme.palette.neutral[400]}
                value={config?.formatter || config?.secureTextEntry ? undefined : (value as string) ?? ""}
                onChangeText={handleChangeText}
                onFocus={() => setFocusedField(name)}
                onBlur={() => {
                  setFocusedField(null);
                  onBlur();
                  // Aplica formatação ao sair do campo (campos não-controlados com formatter)
                  if (config?.formatter && config?.inputRef?.current && typeof value === "string") {
                    config.inputRef.current.setNativeProps({ text: config.formatter(value) });
                  }
                  // Dispara verificação ao terminar digitação (sair do campo)
                  if (onFieldChange && ['email', 'phone', 'document'].includes(name)) {
                    const currentValue = config?.formatter && typeof value === "string"
                      ? value
                      : (value as string) ?? "";
                    onFieldChange(name, currentValue);
                  }
                }}
                secureTextEntry={config?.secureTextEntry && !config?.showPassword}
                keyboardType={config?.keyboardType ?? "default"}
                autoCapitalize={config?.autoCapitalize ?? "sentences"}
                returnKeyType={config?.returnKeyType ?? "next"}
                onSubmitEditing={config?.onSubmitEditing}
                maxLength={config?.maxLength}
                autoComplete={config?.secureTextEntry ? "off" : undefined}
                textContentType={config?.secureTextEntry ? "none" : config?.textContentType}
                importantForAutofill={config?.secureTextEntry ? "no" : undefined}
                passwordRules=""
                autoCorrect={false}
                spellCheck={false}
              />
              {config?.showToggle && (
                <TouchableOpacity
                  testID={`register-${name}-toggle`}
                  style={styles.eyeButton}
                  onPress={config.onToggle}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={config.showPassword ? "eye-off-outline" : "eye-outline"}
                    size={moderateScale(18, 0.3)}
                    color={theme.palette.neutral[400]}
                  />
                </TouchableOpacity>
              )}
            </View>
            {errors[name] && (
              <Text style={styles.fieldError}>
                {getErrorMessage(errors[name]?.message)}
              </Text>
            )}
            {/* Mostra erro de verificação em tempo real */}
            {verificationResults?.[name]?.error && !errors[name] && (
              <View style={styles.fieldErrorContainer}>
                <Ionicons name="alert-circle" size={moderateScale(14, 0.3)} color={theme.colors.status.error} />
                <Text style={styles.fieldErrorText}>{verificationResults[name].error}</Text>
              </View>
            )}
          </>
        );
      }}
    />
  );

  return (
    <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.formCard}>
      <Text style={styles.cardTitle}>{auth.registerTitle}</Text>
      <Text style={styles.cardSubtitle}>{auth.registerSubtitle}</Text>

      <View style={styles.fields}>
        {renderField("firstName", auth.registerFirstNamePlaceholder, "person-outline", {
          returnKeyType: "next",
          onSubmitEditing: () => lastNameRef.current?.focus(),
          inputRef: firstNameRef,
          textContentType: "givenName",
        })}

        {renderField("lastName", auth.registerLastNamePlaceholder, "person-outline", {
          returnKeyType: "next",
          onSubmitEditing: () => emailRef.current?.focus(),
          inputRef: lastNameRef,
          textContentType: "familyName",
        })}

        {renderField("email", auth.registerEmailPlaceholder, "mail-outline", {
          keyboardType: "email-address",
          autoCapitalize: "none",
          returnKeyType: "next",
          onSubmitEditing: () => phoneRef.current?.focus(),
          inputRef: emailRef,
          textContentType: "emailAddress",
        })}
        
        {/* Indicador de verificação de email */}
        {checkingFields?.email && (
          <View style={styles.checkingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
            <Text style={styles.checkingText}>Verificando e-mail...</Text>
          </View>
        )}
        
        {/* Email já cadastrado com botão de recuperação */}
        {showForgotPasswordButton && onForgotPassword && (
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={onForgotPassword}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="lock-closed-outline" 
              size={moderateScale(14, 0.3)} 
              color={theme.colors.primary.DEFAULT} 
              style={styles.forgotPasswordIcon}
            />
            <Text style={styles.forgotPasswordText}>
              {auth.registerForgotPassword || "Esqueci minha senha"}
            </Text>
          </TouchableOpacity>
        )}

        {renderField("phone", auth.registerPhonePlaceholder, "call-outline", {
          keyboardType: "phone-pad",
          returnKeyType: "next",
          onSubmitEditing: () => documentRef.current?.focus(),
          inputRef: phoneRef,
          nextRef: documentRef,
          maxLength: 15,
          formatter: formatPhone,
          onChangeFormatter: (text) => text.replace(/\D/g, "").slice(0, 11),
          textContentType: "telephoneNumber",
        })}
        
        {/* Indicador de verificação de telefone */}
        {checkingFields?.phone && (
          <View style={styles.checkingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
            <Text style={styles.checkingText}>Verificando telefone...</Text>
          </View>
        )}

        <Controller
          control={control}
          name="documentType"
          render={({ field: { onChange, value } }) => (
            <View style={styles.documentTypeContainer}>
              <Text style={styles.documentTypeLabel}>Tipo de documento</Text>
              <View style={styles.documentTypeRow}>
                {(["cpf", "cnpj", "rg", "passport"] as DocumentType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    testID={`register-docType-${type}`}
                    style={[
                      styles.documentTypeChip,
                      value === type && styles.documentTypeChipSelected,
                    ]}
                    onPress={() => {
                      onChange(type);
                      setDocumentType(type);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.documentTypeChipText,
                        value === type && styles.documentTypeChipTextSelected,
                      ]}
                    >
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />

        {renderField("document", auth.registerDocumentPlaceholder, "card-outline", {
          keyboardType: documentType === "passport" ? "default" : "number-pad",
          returnKeyType: "next",
          onSubmitEditing: () => passwordRef.current?.focus(),
          inputRef: documentRef,
          nextRef: passwordRef,
          maxLength: getDocumentMaxLength(documentType),
          textContentType: "none",
          fieldKey: `document-${documentType}`,
          formatter: (text) => formatDocument(text, documentType),
          onChangeFormatter: (text) => {
            if (documentType === "passport") {
              return text.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
            }
            return text.replace(/\D/g, "").slice(0, 14);
          },
        })}
        
        {/* Indicador de verificação de documento */}
        {checkingFields?.document && (
          <View style={styles.checkingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
            <Text style={styles.checkingText}>Verificando documento...</Text>
          </View>
        )}

        {renderField("password", auth.registerPasswordPlaceholder, "lock-closed-outline", {
          secureTextEntry: true,
          showToggle: true,
          showPassword,
          onToggle: () => setShowPassword((p) => !p),
          returnKeyType: "next",
          onSubmitEditing: () => confirmRef.current?.focus(),
          inputRef: passwordRef,
        })}

        {renderField(
          "passwordConfirmation",
          auth.registerPasswordConfirmationPlaceholder,
          "lock-closed-outline",
          {
            secureTextEntry: true,
            showToggle: true,
            showPassword: showConfirmPassword,
            onToggle: () => setShowConfirmPassword((p) => !p),
            returnKeyType: "done",
            onSubmitEditing: handleSubmit(onSubmit),
            inputRef: confirmRef,
          },
        )}
      </View>

      <TouchableOpacity
        style={[styles.advanceButton, isButtonDisabled && styles.advanceButtonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isButtonDisabled}
        activeOpacity={0.85}
        testID="register-submit"
      >
        {isSubmitting ? (
          <ActivityIndicator color={theme.palette.neutral[0]} size="small" />
        ) : (
          <Text style={styles.buttonText}>{auth.registerAdvanceButton}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
