import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNotifications } from "@/modules/notifications/hooks/useNotifications";
import { Ionicons } from "@expo/vector-icons";
import { NotificationItem } from "@/modules/notifications/types/notification.types";
import { styles } from "./styles";
import { t } from "@/shared/locales";

export default function NotificationsScreen() {
  const { notifications, isLoading, refetch, markAsRead } = useNotifications();

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "success":
        return { name: "checkmark-circle", color: "#2ecc71" };
      case "warning":
        return { name: "warning", color: "#f1c40f" };
      case "error":
        return { name: "alert-circle", color: "#e74c3c" };
      default:
        return { name: "information-circle", color: "#3498db" };
    }
  };

  if (isLoading) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        onRefresh={refetch}
        refreshing={isLoading}
        renderItem={({ item }) => {
          const icon = getIcon(item.type);
          return (
            <TouchableOpacity
              style={[styles.notificationCard, item.read && styles.readCard]}
              onPress={() => !item.read && markAsRead(item.id)}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={icon.name as any}
                  size={24}
                  color={icon.color}
                />
              </View>
              <View style={styles.content}>
                <Text style={[styles.title, item.read && styles.readText]}>
                  {item.title}
                </Text>
                <Text style={[styles.body, item.read && styles.readText]}>
                  {item.body}
                </Text>
                <Text style={styles.time}>
                  {new Date(item.createdAt).toLocaleDateString()}{" "}
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t("notifications.empty")}</Text>
          </View>
        }
      />
    </View>
  );
}
