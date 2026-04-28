import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { t } from "@/shared/locales";
import { styles } from "../../screens/styles";
import type { RoomItemProps } from "./types";

export const RoomItem: React.FC<RoomItemProps> = ({
  id,
  participant,
  lastMessage,
  unreadCount,
  onPress,
}) => {
  const formattedTime = lastMessage
    ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <TouchableOpacity style={styles.roomItem} onPress={() => onPress(id)}>
      <ExpoImage source={participant.avatarUrl} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{participant.name}</Text>
          {lastMessage && <Text style={styles.time}>{formattedTime}</Text>}
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMessage?.content ?? t("chat.emptyRooms")}
        </Text>
      </View>
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
