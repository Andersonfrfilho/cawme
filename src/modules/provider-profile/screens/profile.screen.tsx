import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useProviderProfile } from "@/modules/provider-profile/hooks/useProviderProfile";
import { ProfileHeader, ServiceItem } from "../components";
import { styles } from "./styles";
import { t } from "@/shared/locales";

export default function ProviderProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: profile, isLoading, error } = useProviderProfile(id);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={styles.servicePrice.color} />
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: profile.name }} />

      <ProfileHeader
        name={profile.name}
        avatarUrl={profile.avatarUrl}
        location={profile.location}
        rating={profile.rating}
        reviewCount={profile.reviewCount}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.about")}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.services")}</Text>
        {profile.services.map((service) => (
          <ServiceItem
            key={service.id}
            name={service.name}
            price={service.price}
            unit={service.unit}
          />
        ))}
      </View>
    </ScrollView>
  );
}
