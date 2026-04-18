import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useChatMessages } from '@/modules/chat/hooks/useChat';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, fetchNextPage, hasNextPage } = useChatMessages(roomId);
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text.trim());
      setText('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen options={{ title: 'Chat' }} />
      
      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        onEndReached={() => hasNextPage && fetchNextPage()}
        renderItem={({ item }) => {
          const isMe = item.senderId === user?.id;
          return (
            <View style={[styles.messageRow, isMe ? styles.myRow : styles.otherRow]}>
              <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
                <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
                  {item.content}
                </Text>
                <Text style={styles.time}>
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mensagem..."
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messageRow: { flexDirection: 'row', marginVertical: 5, paddingHorizontal: 10 },
  myRow: { justifyContent: 'flex-end' },
  otherRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 10, borderRadius: 15 },
  myBubble: { backgroundColor: '#007AFF', borderBottomRightRadius: 2 },
  otherBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 2 },
  messageText: { fontSize: 16 },
  myText: { color: '#fff' },
  otherText: { color: '#000' },
  time: { fontSize: 10, color: 'rgba(0,0,0,0.4)', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: { 
    flexDirection: 'row', 
    padding: 10, 
    backgroundColor: '#fff', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  input: { 
    flex: 1, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100
  },
  sendButton: { padding: 5 }
});
