import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../screens/styles";
import type { MessageBubbleProps } from "./types";

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  createdAt,
  isMe,
}) => {
  const formattedTime = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.messageRow, isMe ? styles.myRow : styles.otherRow]}>
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
          {content}
        </Text>
        <Text style={[styles.messageTime, isMe ? styles.myTime : styles.otherTime]}>
          {formattedTime}
        </Text>
      </View>
    </View>
  );
};
