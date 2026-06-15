import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { t } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale } from "@/shared/utils/scale";
import { styles } from "../../screens/styles";
import type { ProfileHeaderProps } from "./types";

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }).map((_, i) => {
        const name =
          rating >= i + 1 ? "star" : rating >= i + 0.5 ? "star-half" : "star-outline";
        return (
          <Ionicons
            key={i}
            name={name}
            size={moderateScale(14, 0.3)}
            color={theme.colors.accent.yellow}
          />
        );
      })}
    </View>
  );
}

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
        <Text style={styles.name} testID="provider-profile-name">{name}</Text>
        <Text style={styles.location}>
          {location.city}, {location.state}
        </Text>
        <View style={styles.ratingContainer}>
          <StarRating rating={rating} />
          <View style={styles.ratingTextRow}>
            <Text style={styles.rating} testID="provider-profile-rating">
              {rating.toFixed(1)}
            </Text>
            <Text style={styles.reviews}>
              ({reviewCount} {t("profile.reviews")})
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
