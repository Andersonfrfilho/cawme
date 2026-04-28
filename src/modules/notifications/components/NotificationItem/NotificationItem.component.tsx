import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/shared/constants";
import { styles } from "../../screens/styles";
import type { NotificationItemProps } from "./types";

export const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  onPress,
}) => {
  const getIcon = (type: typeof item.type) => {
    switch (type) {
      case "success":
        return { name: "checkmark-circle", color: theme.colors.status.success };
      case "warning":
        return { name: "warning", color: theme.colors.status.warning };
      case "error":
        return { name: "alert-circle", color: theme.colors.status.error };
      default:
        return { name: "information-circle", color: theme.colors.primary.DEFAULT };
    }
  };

  const icon = getIcon(item.type);

  return (
    <TouchableOpacity
      style={[styles.notificationCard, item.read && styles.readCard]}
      onPress={() => !item.read && onPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon.name as any} size={theme.metrics.iconSize.lg} color={icon.color} />
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
};
