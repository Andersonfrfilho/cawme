import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/shared/constants";
import { styles } from "../../screens/styles";
import type { ChatInputProps } from "./types";

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder,
}) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.palette.neutral[400]}
        value={text}
        onChangeText={setText}
        multiline
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSend}
        activeOpacity={0.8}
      >
        <Ionicons name="send" size={theme.metrics.iconSize.md} color={theme.palette.neutral[0]} />
      </TouchableOpacity>
    </View>
  );
};
