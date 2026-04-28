import React from 'react';
import { View, Text } from 'react-native';
import { RequestItemProps } from './types';
import { styles } from './styles';

export function RequestItemComponent({ item }: RequestItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return '#2ecc71';
      case 'pending':
        return '#f1c40f';
      case 'canceled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  return (
    <View style={styles.requestItem}>
      <View>
        <Text style={styles.requestTitle}>{item.title}</Text>
        <Text style={styles.requestDate}>{item.date}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
    </View>
  );
}

export default RequestItemComponent;
