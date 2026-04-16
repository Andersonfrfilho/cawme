import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppConfigStore } from '@/store/app-config.store';
import { useAuthStore } from '@/store/auth.store';
import { AppConfigService } from '@/services/api/app-config.service';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';

const queryClient = new QueryClient();

function ForceUpdateScreen({ latestVersion }: { latestVersion: string }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Atualização Obrigatória</Text>
      <Text style={{ textAlign: 'center', marginBottom: 20 }}>
        Uma nova versão do Cawme ({latestVersion}) está disponível. Por favor, atualize o app para continuar.
      </Text>
      <Button title="Atualizar Agora" onPress={() => Linking.openURL('https://cawme.com/download')} />
    </View>
  );
}

export default function RootLayout() {
  const { config, setConfig, isStale } = useAppConfigStore();
  const isSignedIn = useAuthStore((s) => s.isSignedIn);

  useEffect(() => {
    if (!isStale() && config) return;
    AppConfigService.get()
      .then(setConfig)
      .catch((err) => console.error('Failed to fetch app config', err));
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      router.replace('/(auth)/login');
    } else if (isSignedIn) {
      router.replace('/(app)/home');
    }
  }, [isSignedIn]);

  if (!config) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Configurando Cawme...</Text>
      </View>
    );
  }

  if (config.version.forceUpdate) {
    return <ForceUpdateScreen latestVersion={config.version.latest} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </QueryClientProvider>
  );
}
