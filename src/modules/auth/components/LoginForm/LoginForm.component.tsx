import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import { t } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { styles } from "./styles";
import type { LoginFormProps } from "./types";

export const LoginForm: React.FC<LoginFormProps> = ({
  control,
  errors,
  isSubmitting,
  onSubmit,
  handleSubmit,
  onForgotPassword,
  onRegister,
  onContinueAsGuest,
  rememberMe,
  onToggleRememberMe,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<
    "username" | "password" | null
  >(null);
  const passwordRef = useRef<TextInput>(null);

  const getIconColor = (field: "username" | "password") => {
    if (errors[field]) return theme.colors.status.error;
    if (focusedField === field) return theme.colors.primary.DEFAULT;
    return theme.palette.neutral[400];
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(600)}
      style={styles.formCard}
    >
      <Text style={styles.cardTitle}>
        {t("auth.welcomeBack") || "Bem-vindo de volta"}
      </Text>
      <Text style={styles.cardSubtitle}>
        {t("auth.accessAccount") || "Acesse sua conta para continuar"}
      </Text>

      <View style={styles.fields}>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value, onBlur } }) => (
            <>
              <View
                style={[
                  styles.inputRow,
                  focusedField === "username" && styles.inputRowFocused,
                  errors.username && styles.inputRowError,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={getIconColor("username")}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputText}
                  placeholder={t("auth.usernamePlaceholder")}
                  placeholderTextColor={theme.palette.neutral[400]}
                  value={value}
                  onChangeText={onChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => {
                    setFocusedField(null);
                    onBlur();
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
              {errors.username && (
                <Text style={styles.fieldError}>
                  {t("auth.usernameRequired")}
                </Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value, onBlur } }) => (
            <>
              <View
                style={[
                  styles.inputRow,
                  focusedField === "password" && styles.inputRowFocused,
                  errors.password && styles.inputRowError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={getIconColor("password")}
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={passwordRef}
                  style={styles.inputText}
                  placeholder={t("auth.passwordPlaceholder")}
                  placeholderTextColor={theme.palette.neutral[400]}
                  value={value}
                  onChangeText={onChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => {
                    setFocusedField(null);
                    onBlur();
                  }}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((p) => !p)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={theme.palette.neutral[400]}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.fieldError}>
                  {t("auth.passwordRequired")}
                </Text>
              )}
            </>
          )}
        />

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={onToggleRememberMe}
            activeOpacity={0.7}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxActive]}
            >
              {rememberMe && (
                <Ionicons
                  name="checkmark"
                  size={11}
                  color={theme.palette.neutral[0]}
                />
              )}
            </View>
            <Text style={styles.rememberText}>{t("auth.rememberMe")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onForgotPassword}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.forgotText}>{t("auth.forgotPassword")}</Text>
          </TouchableOpacity>
        </View>

        {errors.root && (
          <View style={styles.errorBanner}>
            <Ionicons
              name="alert-circle-outline"
              size={theme.metrics.iconSize.sm}
              color={theme.colors.status.error}
            />
            <Text style={styles.errorBannerText}>{errors.root.message}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        activeOpacity={0.85}
      >
        {isSubmitting ? (
          <ActivityIndicator color={theme.palette.neutral[0]} size="small" />
        ) : (
          <Text style={styles.buttonText}>{t("auth.loginButton")}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.secondaryActions}>
        <TouchableOpacity
          onPress={onRegister}
          activeOpacity={0.8}
          style={styles.secondaryButton}
        >
          <View style={styles.secondaryButtonContent}>
            <Ionicons
              name="person-add-outline"
              size={16}
              color={theme.colors.primary.DEFAULT}
            />
            <Text style={styles.secondaryText}>{t("auth.register")}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onContinueAsGuest}
          activeOpacity={0.8}
          style={styles.secondaryButton}
        >
          <View style={styles.secondaryButtonContent}>
            <Ionicons
              name="enter-outline"
              size={16}
              color={theme.colors.primary.DEFAULT}
            />
            <Text style={styles.secondaryText}>
              {t("auth.continueAsGuest")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
