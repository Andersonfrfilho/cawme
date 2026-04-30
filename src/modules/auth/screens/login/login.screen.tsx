import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { mmkvStorage } from "@/shared/providers/cache";
import { LoginHero, LoginForm } from "../../components";
import { LoginScreenParams, LoginFormValues, loginSchema } from "./types";
import { styles } from "./styles";
import { LocaleKeys, useLocale } from "@/shared/locales";

const REMEMBERED_USERNAME_KEY = "auth_remembered_username";

export default function LoginScreen(_: LoginScreenParams) {
  const { login } = useAuth();
  const {
    auth: { loginError, loginSubtitle },
  } = useLocale<LocaleKeys>();
  const insets = useSafeAreaInsets();
  const [rememberMe, setRememberMe] = useState(
    () => !!mmkvStorage.get(REMEMBERED_USERNAME_KEY),
  );

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: mmkvStorage.get(REMEMBERED_USERNAME_KEY) ?? "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      if (rememberMe) {
        mmkvStorage.set(REMEMBERED_USERNAME_KEY, values.username);
      } else {
        mmkvStorage.remove(REMEMBERED_USERNAME_KEY);
      }
      await login(values);
    } catch {
      setError("root", { message: loginError });
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={[styles.backgroundLayer, { height: 240 + insets.top }]} pointerEvents="none">
          <LoginHero subtitle={loginSubtitle} showContent={false} />
        </View>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.heroForeground, { height: 240 + insets.top }]}>
              <LoginHero subtitle={loginSubtitle} showBackground={false} />
            </View>

            <LoginForm
              control={control}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
              onForgotPassword={() => router.push("/forgot-password" as any)}
              onRegister={() => router.push("/register" as any)}
              onContinueAsGuest={() => router.replace("/(app)/search" as any)}
              rememberMe={rememberMe}
              onToggleRememberMe={() => setRememberMe((remember) => !remember)}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
