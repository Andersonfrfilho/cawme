import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register/index" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="register-success" />
      <Stack.Screen name="map-picker" />
      <Stack.Screen name="forgot-password/index" />
    </Stack>
  );
}
