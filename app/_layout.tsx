import { useEffect, useState, useCallback } from "react";
// importa todos os locales dos módulos (registro global via side-effect)
import "@/shared/locales/register-all-modules";
import { startMockServer } from "@/mocks";

startMockServer();
import { Stack, router } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppConfigStore } from "@/modules/app-config/store/app-config.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { AppConfigService } from "@/modules/app-config/services/app-config.service";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as Linking from "expo-linking";
import { styles } from "@/shared/styles/root-layout.styles";
import { useUIStore } from "@/shared/store/ui.store";
import { t } from "@/shared/locales";
import { ErrorScreen } from "@/shared/components/error-screen";
import { colors } from "@/shared/constants";

const queryClient = new QueryClient();

function GlobalLoading() {
  const isLoading = useUIStore((s) => s.isLoading);

  if (!isLoading) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(255,255,255,0.7)",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    </View>
  );
}

function ForceUpdateScreen({ latestVersion }: Readonly<{ latestVersion: string }>) {
  return (
    <View style={styles.forceUpdateContainer}>
      <Text style={styles.forceUpdateTitle}>
        {t("root.updateRequiredTitle")}
      </Text>
      <Text style={styles.forceUpdateBody}>
        {t("root.updateRequiredBody")} ({latestVersion})
      </Text>
      <Button
        title={t("root.updateButton")}
        onPress={() => Linking.openURL("https://cawme.com/download")}
      />
    </View>
  );
}

export default function RootLayout() {
  const { config, setConfig, isStale } = useAppConfigStore();
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const [configError, setConfigError] = useState(false);

  const fetchConfig = useCallback(() => {
    setConfigError(false);
    AppConfigService.get()
      .then(setConfig)
      .catch((err) => {
        console.error("Failed to fetch app config", err);
        setConfigError(true);
      });
  }, [setConfig]);

  useEffect(() => {
    if (!isStale() && config) return;
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!config) return;
    if (!isSignedIn) {
      router.replace("/(auth)");
    } else {
      router.replace("/(app)/home");
    }
  }, [isSignedIn, config]);

  if (config?.version.forceUpdate) {
    return <ForceUpdateScreen latestVersion={config.version.latest} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="error" options={{ headerShown: false, animation: 'fade_from_bottom', gestureEnabled: false }} />
      </Stack>
      <GlobalLoading />
      {!config && !configError && (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer, { backgroundColor: colors.background.DEFAULT }]}>
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>{t("root.configLoading")}</Text>
        </View>
      )}
      {!config && configError && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background.DEFAULT }]}>
          <ErrorScreen variant="network" onRetry={fetchConfig} />
        </View>
      )}
    </QueryClientProvider>
  );
}
