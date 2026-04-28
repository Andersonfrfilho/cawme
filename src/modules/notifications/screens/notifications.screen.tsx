import React, { useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useNotifications } from "@/modules/notifications/hooks/useNotifications";
import { NotificationItem } from "../components";
import { styles } from "./styles";
import { t } from "@/shared/locales";

export default function NotificationsScreen() {
  const { notifications, isLoading, refetch, markAsRead } = useNotifications();

  if (isLoading) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        onRefresh={refetch}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            onPress={(id) => !item.read && markAsRead(id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t("notifications.empty")}</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
