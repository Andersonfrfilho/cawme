import React, { useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { t } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { ForgotPasswordForm, ForgotPasswordSuccess } from "../../components";
import { styles } from "./styles";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "./types";

export default function ForgotPasswordScreen() {
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

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
      await forgotPassword({ email });
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
