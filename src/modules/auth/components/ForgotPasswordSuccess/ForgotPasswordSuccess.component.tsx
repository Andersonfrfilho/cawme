import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { styles } from "../../screens/forgot-password/styles";
import type { ForgotPasswordSuccessProps } from "./types";

export const ForgotPasswordSuccess: React.FC<ForgotPasswordSuccessProps> = ({
  onBackToLogin,
}) => {
  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.successContainer}>
      <View style={styles.successIconWrapper}>
        <Ionicons name="checkmark-circle" size={theme.metrics.avatarSize.lg} color={theme.colors.status.success} />
      </View>
      <Text style={styles.successTitle}>{t("auth.forgotPasswordSuccessTitle")}</Text>
      <Text style={styles.successText}>{t("auth.forgotPasswordSuccess")}</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackToLogin}
        activeOpacity={0.85}
      >
        <Text style={styles.backButtonText}>{t("auth.backToLogin")}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
