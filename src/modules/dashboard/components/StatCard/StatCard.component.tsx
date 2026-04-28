import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatCardProps } from './types';
import { styles } from './styles';

export function StatCardComponent({ label, value, icon }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={24} color="#007AFF" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default StatCardComponent;
