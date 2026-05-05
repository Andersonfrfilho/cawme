import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { styles } from "./styles";
import type { RegisterFormProps, RegisterFormValues } from "./types";

type FieldName = keyof RegisterFormValues;

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function getRawLength(value: string): number {
  return value.replace(/\D/g, "").length;
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
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const cpfRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const getIconColor = (field: FieldName) => {
    if (errors[field]) return theme.colors.status.error;
    if (focusedField === field) return theme.colors.primary.DEFAULT;
    return theme.palette.neutral[400];
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
                errors[name] && styles.inputRowError,
              ]}
            >
              <Ionicons
                name={iconName as any}
                size={moderateScale(18, 0.3)}
                color={getIconColor(name)}
                style={styles.inputIcon}
              />
              <TextInput
                ref={config?.inputRef}
                style={styles.inputText}
                placeholder={placeholder}
                placeholderTextColor={theme.palette.neutral[400]}
                value={config?.formatter && typeof value === "string" ? config.formatter(value) : (value as string) ?? ""}
                onChangeText={handleChangeText}
                onFocus={() => setFocusedField(name)}
                onBlur={() => {
                  setFocusedField(null);
                  onBlur();
                }}
                secureTextEntry={config?.secureTextEntry && !config?.showPassword}
                keyboardType={config?.keyboardType ?? "default"}
                autoCapitalize={config?.autoCapitalize ?? "sentences"}
                returnKeyType={config?.returnKeyType ?? "next"}
                onSubmitEditing={config?.onSubmitEditing}
                maxLength={config?.maxLength}
              />
              {config?.showToggle && (
                <TouchableOpacity
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
                {errors[name]?.message === "passwordMismatch"
                  ? auth.registerPasswordMismatch
                  : errors[name]?.message}
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
        })}

        {renderField("lastName", auth.registerLastNamePlaceholder, "person-outline", {
          returnKeyType: "next",
          onSubmitEditing: () => emailRef.current?.focus(),
          inputRef: lastNameRef,
        })}

        {renderField("email", auth.registerEmailPlaceholder, "mail-outline", {
          keyboardType: "email-address",
          autoCapitalize: "none",
          returnKeyType: "next",
          onSubmitEditing: () => phoneRef.current?.focus(),
          inputRef: emailRef,
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
          onSubmitEditing: () => cpfRef.current?.focus(),
          inputRef: phoneRef,
          nextRef: cpfRef,
          maxLength: 15,
          formatter: formatPhone,
          onChangeFormatter: (text) => text.replace(/\D/g, "").slice(0, 11),
        })}
        
        {/* Indicador de verificação de telefone */}
        {checkingFields?.phone && (
          <View style={styles.checkingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
            <Text style={styles.checkingText}>Verificando telefone...</Text>
          </View>
        )}

        {renderField("cpf", auth.registerCpfPlaceholder, "card-outline", {
          keyboardType: "numeric",
          returnKeyType: "next",
          onSubmitEditing: () => passwordRef.current?.focus(),
          inputRef: cpfRef,
          nextRef: passwordRef,
          maxLength: 14,
          formatter: formatCpf,
          onChangeFormatter: (text) => text.replace(/\D/g, "").slice(0, 11),
        })}
        
        {/* Indicador de verificação de CPF */}
        {checkingFields?.cpf && (
          <View style={styles.checkingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
            <Text style={styles.checkingText}>Verificando CPF...</Text>
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
        style={[styles.advanceButton, isSubmitting && styles.advanceButtonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        activeOpacity={0.85}
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
