import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as AuthSession from "expo-auth-session";
import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiClient } from "@/shared/services/api-client";
import { styles } from "./styles";
import { t } from "@/shared/locales";

export default function LoginScreen() {
  const setUser = useAuthStore((s) => s.setUser);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: KeycloakService.getClientId(),
      redirectUri: KeycloakService.getRedirectUri(),
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Code,
    },
    KeycloakService.getDiscovery(),
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      const codeVerifier = request?.codeVerifier;

      if (code && codeVerifier) {
        handleCallback(code, codeVerifier);
      }
    }
  }, [response]);

  const handleCallback = async (code: string, codeVerifier: string) => {
    try {
      await KeycloakService.handleTokenExchange(code, codeVerifier);

      // Busca dados do usuário logado
      const userRes = await apiClient.get("/bff/users/me");
      setUser(userRes.data);

      router.replace("/(app)/home");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="home" size={80} color="#007AFF" />
        <Text style={styles.title}>{t("auth.loginTitle")}</Text>
        <Text style={styles.subtitle}>{t("auth.loginSubtitle")}</Text>
      </View>

      <View style={styles.form}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          {!request ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t("auth.loginButton")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
