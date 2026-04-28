import { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useHome } from "@/modules/home/hooks/useHome";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { SduiRenderer } from "@/modules/sdui/components/SduiRenderer";
import { styles } from "./styles";
import { t } from "@/shared/locales";
import { colors } from "@/shared/constants";

export default function HomeScreen() {
  const { data, isLoading, error, refetch } = useHome();
  const { logout } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity
          onPress={logout}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.status.error} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("home.loadError")}</Text>
        <Text onPress={() => refetch()} style={styles.retryText}>
          {t("common.retry")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SduiRenderer layout={data?.layout ?? []} />
    </View>
  );
}
