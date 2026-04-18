import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useChatMessages } from "@/modules/chat/hooks/useChat";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { t } from "@/shared/locales";

export default function ChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, fetchNextPage, hasNextPage } =
    useChatMessages(roomId);
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text.trim());
      setText("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen options={{ title: t("chat.title") }} />

      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        onEndReached={() => hasNextPage && fetchNextPage()}
        renderItem={({ item }) => {
          const isMe = item.senderId === user?.id;
          return (
            <View
              style={[styles.messageRow, isMe ? styles.myRow : styles.otherRow]}
            >
              <View
                style={[
                  styles.bubble,
                  isMe ? styles.myBubble : styles.otherBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isMe ? styles.myText : styles.otherText,
                  ]}
                >
                  {item.content}
                </Text>
                <Text style={styles.time}>
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("chat.inputPlaceholder")}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
