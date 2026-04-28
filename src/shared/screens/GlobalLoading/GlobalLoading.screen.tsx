import { View } from "react-native-reanimated/lib/typescript/Animated";
import { ActivityIndicator, StyleSheet } from "react-native";
import { styles } from "./styles";
import { useUIStore } from "@/shared/store/ui.store";
import { theme } from "@/shared/constants";

export function GlobalLoading() {
  const isLoading = useUIStore((s) => s.isLoading);

  if (!isLoading) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, styles.forceUpdateContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
      </View>
    </View>
  );
}
