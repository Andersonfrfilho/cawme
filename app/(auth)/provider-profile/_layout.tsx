import { Stack } from 'expo-router';

export default function ProviderProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="services" />
      <Stack.Screen name="availability" />
      <Stack.Screen name="review" />
    </Stack>
  );
}
