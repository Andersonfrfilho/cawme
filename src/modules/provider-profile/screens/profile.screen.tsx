import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useProviderProfile } from "@/modules/provider-profile/hooks/useProviderProfile";
import { Image as ExpoImage } from "expo-image";
import { styles } from "./styles";
import { t } from "@/shared/locales";

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
        <Text style={styles.errorText}>{t("profile.loadError")}</Text>
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
          <Text style={styles.location}>
            {profile.location.city}, {profile.location.state}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {profile.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>
              ({profile.reviewCount} {t("profile.reviews")})
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.about")}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.services")}</Text>
        {profile.services.map((service) => (
          <View key={service.id} style={styles.serviceItem}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>
              R$ {service.price.toFixed(2)} / {service.unit}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
