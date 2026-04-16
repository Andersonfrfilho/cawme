import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useProviderProfile } from '@/hooks/useProviderProfile';
import { ExpoImage } from 'expo-image';

export default function ProviderProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: profile, isLoading, error } = useProviderProfile(id);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar o perfil do prestador.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: profile.name }} />
      
      <View style={styles.header}>
        <ExpoImage
          source={profile.avatarUrl}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.location}>{profile.location.city}, {profile.location.state}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {profile.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({profile.reviewCount} avaliações)</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Serviços</Text>
        {profile.services.map((service) => (
          <View key={service.id} style={styles.serviceItem}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>R$ {service.price.toFixed(2)} / {service.unit}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
  headerInfo: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  location: {
    color: '#666',
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontWeight: '600',
    color: '#f1c40f',
  },
  reviews: {
    color: '#999',
    marginLeft: 5,
    fontSize: 12,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bio: {
    lineHeight: 22,
    color: '#444',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  serviceName: {
    fontSize: 16,
  },
  servicePrice: {
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  errorText: {
    color: 'red',
  },
});
