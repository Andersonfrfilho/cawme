import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useChatRooms } from '@/hooks/useChat';
import { ExpoImage } from 'expo-image';
import { router } from 'expo-router';

export default function ChatRoomsScreen() {
  const { data, isLoading, error } = useChatRooms();

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

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
                    {new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                )}
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage?.content ?? 'Inicie uma conversa'}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  roomItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee' },
  content: { flex: 1, marginLeft: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  name: { fontWeight: 'bold', fontSize: 16 },
  time: { fontSize: 12, color: '#999' },
  lastMessage: { color: '#666', fontSize: 14 },
  badge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});
