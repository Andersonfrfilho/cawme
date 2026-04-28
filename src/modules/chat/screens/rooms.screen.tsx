import React, { useCallback } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { useChatRooms } from "@/modules/chat/hooks/useChat";
import { router } from "expo-router";
import { RoomItem } from "../components";
import { styles } from "./styles";

export default function ChatRoomsScreen() {
  const { data, isLoading } = useChatRooms();

  if (isLoading) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.rooms ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoomItem
            id={item.id}
            participant={item.participant}
            lastMessage={item.lastMessage}
            unreadCount={item.unreadCount}
            onPress={(id) => router.push(`/chat/${id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
