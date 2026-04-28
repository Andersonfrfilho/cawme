import React from "react";
import { View, Text } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { t } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { styles } from "../../screens/styles";
import type { ProfileHeaderProps } from "./types";

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  avatarUrl,
  location,
  rating,
  reviewCount,
}) => {
  return (
    <View style={styles.header}>
      <ExpoImage
        source={avatarUrl}
        style={styles.avatar}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.headerInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.location}>
          {location.city}, {location.state}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>
            ({reviewCount} {t("profile.reviews")})
          </Text>
        </View>
      </View>
    </View>
  );
};
