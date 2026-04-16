import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNotifications } from '@/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItem } from '@/types/bff/notification.types';

export default function NotificationsScreen() {
  const { notifications, isLoading, refetch, markAsRead } = useNotifications();

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success': return { name: 'checkmark-circle', color: '#2ecc71' };
      case 'warning': return { name: 'warning', color: '#f1c40f' };
      case 'error': return { name: 'alert-circle', color: '#e74c3c' };
      default: return { name: 'information-circle', color: '#3498db' };
    }
  };

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        onRefresh={refetch}
        refreshing={isLoading}
        renderItem={({ item }) => {
          const icon = getIcon(item.type);
          return (
            <TouchableOpacity 
              style={[styles.notificationCard, item.read && styles.readCard]}
              onPress={() => !item.read && markAsRead(item.id)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={icon.name as any} size={24} color={icon.color} />
              </View>
              <View style={styles.content}>
                <Text style={[styles.title, item.read && styles.readText]}>{item.title}</Text>
                <Text style={[styles.body, item.read && styles.readText]}>{item.body}</Text>
                <Text style={styles.time}>
                  {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Você não tem notificações no momento.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  notificationCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
  },
  readCard: {
    backgroundColor: '#fafafa',
  },
  iconContainer: {
    marginRight: 15,
    marginTop: 2,
  },
  content: { flex: 1 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  body: { fontSize: 14, color: '#444', marginBottom: 6 },
  readText: { color: '#999' },
  time: { fontSize: 12, color: '#bbb' },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 10,
    marginTop: 5,
  },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999', textAlign: 'center' },
});
