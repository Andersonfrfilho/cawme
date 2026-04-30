import { useEffect, useCallback } from "react";
import "@/shared/locales/register-all-modules";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppConfigStore } from "@/modules/app-config/store/app-config.store";
import { AppConfigService } from "@/modules/app-config/services/app-config.service";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Linking from "expo-linking";
import { styles } from "@/shared/styles/root-layout.styles";
import { useUIStore } from "@/shared/store/ui.store";
import { theme } from "@/shared/constants";

const queryClient = new QueryClient();

function GlobalLoading() {
  const isLoading = useUIStore((s) => s.isLoading);

  if (!isLoading) return null;

  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
    </View>
  );
}

function ForceUpdateOverlay({ latestVersion }: Readonly<{ latestVersion: string }>) {
  return (
    <View style={styles.forceUpdateContainer}>
      <Text style={styles.forceUpdateTitle}>Atualização necessária</Text>
      <Text style={styles.forceUpdateBody}>
        Uma nova versão está disponível ({latestVersion}). Por favor, atualize para continuar utilizando o Cawme.
      </Text>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => Linking.openURL("https://cawme.com/download")}
        activeOpacity={0.8}
      >
        <Text style={styles.updateButtonText}>Atualizar agora</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootLayout() {
  const { config, setConfig, isStale } = useAppConfigStore();

  const fetchConfig = useCallback(() => {
    AppConfigService.get()
      .then(setConfig)
      .catch(() => {
        // app-config is non-blocking — failures are silent
      });
  }, [setConfig]);

  useEffect(() => {
    if (isStale() || !config) {
      fetchConfig();
    }
  }, [config, fetchConfig, isStale]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen
          name="error"
          options={{
            headerShown: false,
            animation: "fade_from_bottom",
            gestureEnabled: false,
          }}
        />
      </Stack>
      <GlobalLoading />
      {config?.version.forceUpdate && (
        <ForceUpdateOverlay latestVersion={config.version.latest} />
      )}
    </QueryClientProvider>
  );
}
