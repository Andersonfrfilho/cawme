import { View, Text, ActivityIndicator } from 'react-native';
import { useHome } from '@/modules/home/hooks/useHome';
import { SduiRenderer } from '@/modules/sdui/components/SduiRenderer';

export default function HomeScreen() {
  const { data, isLoading, error, refetch } = useHome();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', marginBottom: 10 }}>Falha ao carregar a home</Text>
        <Text onPress={() => refetch()} style={{ color: '#007AFF' }}>Tentar novamente</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SduiRenderer layout={data?.layout ?? []} />
    </View>
  );
}
