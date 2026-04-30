import { Redirect } from "expo-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { theme } from "@/shared/constants";

export type RequireAuthProps = {
  children: React.ReactNode;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const isSignedIn = useAuthStore((s) => s.isSignedIn);

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return <>{children}</>;
};

export const RequireAuthLoading: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
  </View>
);
