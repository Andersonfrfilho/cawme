import React, { useState, useRef } from "react";
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

function formatCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  if (digits.length <= 5) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 3)}.${digits.slice(3, 5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 3)}.${digits.slice(3, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  control,
  errors,
  isSubmitting,
  onSubmit,
  handleSubmit,
  userType,
}) => {
  const { auth } = useLocale<LocaleKeys>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const documentRef = useRef<TextInput>(null);
  const cepRef = useRef<TextInput>(null);
  const streetRef = useRef<TextInput>(null);
  const numberRef = useRef<TextInput>(null);
  const neighborhoodRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
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
      onChangeFormatter?: (value: string) => void;
    },
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => (
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
              onChangeText={(text) => {
                if (config?.onChangeFormatter) {
                  config.onChangeFormatter(text);
                }
                onChange(text);
              }}
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
        </>
      )}
    />
  );

  return (
    <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.formCard}>
      <Text style={styles.cardTitle}>{auth.registerTitle}</Text>
      <Text style={styles.cardSubtitle}>{auth.registerSubtitle}</Text>

      <View style={styles.fields}>
        {renderField("fullName", auth.registerFullNamePlaceholder, "person-outline", {
          returnKeyType: "next",
          onSubmitEditing: () => emailRef.current?.focus(),
        })}

        {renderField("email", auth.registerEmailPlaceholder, "mail-outline", {
          keyboardType: "email-address",
          autoCapitalize: "none",
          returnKeyType: "next",
          onSubmitEditing: () => phoneRef.current?.focus(),
          inputRef: emailRef,
        })}

        {renderField("phone", auth.registerPhonePlaceholder, "call-outline", {
          keyboardType: "phone-pad",
          returnKeyType: "next",
          onSubmitEditing: () => documentRef.current?.focus(),
          inputRef: phoneRef,
          formatter: formatPhone,
          onChangeFormatter: (text) => {
            const digits = text.replace(/\D/g, "").slice(0, 11);
            return digits;
          },
        })}

        {renderField("document", auth.registerDocumentPlaceholder, "card-outline", {
          keyboardType: "numeric",
          returnKeyType: "next",
          onSubmitEditing: () => cepRef.current?.focus(),
          inputRef: documentRef,
          formatter: formatCpfCnpj,
          onChangeFormatter: (text) => {
            const digits = text.replace(/\D/g, "").slice(0, 14);
            return digits;
          },
        })}

        {renderField("cep", auth.registerCepPlaceholder, "location-outline", {
          keyboardType: "numeric",
          maxLength: 9,
          returnKeyType: "next",
          onSubmitEditing: () => streetRef.current?.focus(),
          inputRef: cepRef,
          formatter: formatCep,
          onChangeFormatter: (text) => {
            const digits = text.replace(/\D/g, "").slice(0, 8);
            return digits;
          },
        })}

        {renderField("street", auth.registerStreetPlaceholder, "map-outline", {
          returnKeyType: "next",
          onSubmitEditing: () => numberRef.current?.focus(),
          inputRef: streetRef,
        })}

        <View style={styles.row}>
          <View style={styles.rowHalf}>
            {renderField("number", auth.registerNumberPlaceholder, "home-outline", {
              keyboardType: "numeric",
              returnKeyType: "next",
              onSubmitEditing: () => neighborhoodRef.current?.focus(),
              inputRef: numberRef,
            })}
          </View>
          <View style={styles.rowHalf}>
            {renderField("neighborhood", auth.registerNeighborhoodPlaceholder, "business-outline", {
              returnKeyType: "next",
              onSubmitEditing: () => cityRef.current?.focus(),
              inputRef: neighborhoodRef,
            })}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.rowHalf}>
            {renderField("city", auth.registerCityPlaceholder, "globe-outline", {
              returnKeyType: "next",
              onSubmitEditing: () => stateRef.current?.focus(),
              inputRef: cityRef,
            })}
          </View>
          <View style={styles.rowHalf}>
            {renderField("state", auth.registerStatePlaceholder, "flag-outline", {
              autoCapitalize: "characters",
              maxLength: 2,
              returnKeyType: "next",
              onSubmitEditing: () => passwordRef.current?.focus(),
              inputRef: stateRef,
            })}
          </View>
        </View>

        {userType === "provider" && (
          <View style={styles.providerSection}>
            <Text style={styles.providerSectionTitle}>{auth.registerServicesTitle}</Text>
            <Text style={styles.providerSectionDesc}>{auth.registerServicesDesc}</Text>
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
        onPress={handleSubmit((values) => onSubmit(values))}
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
