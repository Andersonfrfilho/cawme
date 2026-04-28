import React, { useState } from "react";
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
import { styles } from "../../screens/forgot-password/styles";
import type { ForgotPasswordFormProps } from "./types";

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  control,
  errors,
  isSubmitting,
  onSubmit,
  handleSubmit,
}) => {
  const [focusedField, setFocusedField] = useState(false);

  const getIconColor = () => {
    if (errors.email) return theme.colors.status.error;
    if (focusedField) return theme.colors.primary.DEFAULT;
    return theme.palette.neutral[400];
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(100).duration(500)}
      style={styles.content}
    >
      <View style={styles.iconArea}>
        <View style={styles.iconCircle}>
          <Ionicons
            name="lock-open-outline"
            size={theme.metrics.iconSize.xl}
            color={theme.colors.primary.DEFAULT}
          />
        </View>
      </View>

      <Text style={styles.title}>{t("auth.forgotPasswordTitle")}</Text>
      <Text style={styles.subtitle}>{t("auth.forgotPasswordSubtitle")}</Text>

      <View style={styles.fields}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value, onBlur } }) => (
            <>
              <View
                style={[
                  styles.inputRow,
                  focusedField && styles.inputRowFocused,
                  errors.email && styles.inputRowError,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={theme.metrics.iconSize.md}
                  color={getIconColor()}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputText}
                  placeholder={t("auth.emailPlaceholder")}
                  placeholderTextColor={theme.palette.neutral[400]}
                  value={value}
                  onChangeText={onChange}
                  onFocus={() => setFocusedField(true)}
                  onBlur={() => {
                    setFocusedField(false);
                    onBlur();
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              </View>
              {errors.email && (
                <Text style={styles.fieldError}>{t("auth.emailInvalid")}</Text>
              )}
            </>
          )}
        />

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
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        activeOpacity={0.85}
      >
        {isSubmitting ? (
          <ActivityIndicator color={theme.palette.neutral[0]} size="small" />
        ) : (
          <Text style={styles.buttonText}>
            {t("auth.forgotPasswordButton")}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
