import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useChatRooms } from "@/modules/chat/hooks/useChat";
import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import { styles } from "./styles";
import { t } from "@/shared/locales";

export default function ChatRoomsScreen() {
  const { data, isLoading, error } = useChatRooms();

  if (isLoading) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.rooms ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.roomItem}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <ExpoImage
              source={item.participant.avatarUrl}
              style={styles.avatar}
            />
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.name}>{item.participant.name}</Text>
                {item.lastMessage && (
                  <Text style={styles.time}>
                    {new Date(item.lastMessage.createdAt).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </Text>
                )}
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage?.content ?? t("chat.emptyRooms")}
              </Text>
            </View>
            {item.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
