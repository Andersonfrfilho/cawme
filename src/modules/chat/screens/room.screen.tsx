import React from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useChatMessages } from "@/modules/chat/hooks/useChat";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { t } from "@/shared/locales";
import { MessageBubble, ChatInput } from "../components";
import { styles } from "./styles";

export default function ChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, fetchNextPage, hasNextPage } =
    useChatMessages(roomId);
  const user = useAuthStore((s) => s.user);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <Stack.Screen options={{ title: t("chat.title") }} />

      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <MessageBubble
            content={item.content}
            createdAt={item.createdAt}
            isMe={item.senderId === user?.id}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <ChatInput
        onSend={sendMessage}
        placeholder={t("chat.inputPlaceholder")}
      />
    </KeyboardAvoidingView>
  );
}
