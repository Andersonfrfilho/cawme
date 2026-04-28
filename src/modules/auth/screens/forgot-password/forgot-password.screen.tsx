import React, { useState, useCallback } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { t } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { ForgotPasswordForm, ForgotPasswordSuccess } from "../../components";
import { styles } from "./styles";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1)
    .refine((v) => /\S+@\S+\.\S+/.test(v), { message: "Invalid email" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: ForgotPasswordFormValues) => {
    try {
      await KeycloakService.forgotPassword({ email });
      setSubmitted(true);
    } catch (error) {
      console.error("[forgot-password] request failed", error);
      setError("root", { message: t("auth.forgotPasswordError") });
    }
  };

  if (submitted) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.flex} edges={["top", "bottom"]}>
          <ForgotPasswordSuccess
            onBackToLogin={() => router.replace("/(auth)")}
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.flex} edges={["top"]}>
        <TouchableOpacity
          style={styles.backNav}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ForgotPasswordForm
              control={control}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
