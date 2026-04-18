import { View, Text, ActivityIndicator } from "react-native";
import { useHome } from "@/modules/home/hooks/useHome";
import { SduiRenderer } from "@/modules/sdui/components/SduiRenderer";
import { styles } from "./styles";
import { t } from "@/shared/locales";

export default function HomeScreen() {
  const { data, isLoading, error, refetch } = useHome();

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
