import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { usePendingVerification } from "../../hooks/usePendingVerification";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { styles } from "./styles";

type BadgeVariant = "banner" | "pill" | "dot";

export type PendingVerificationBadgeProps = {
  variant?: BadgeVariant;
  onPress?: () => void;
};

export const PendingVerificationBadge: React.FC<PendingVerificationBadgeProps> = ({
  variant = "banner",
  onPress,
}) => {
  const { pendingCount, isLoading } = usePendingVerification();
  const { auth } = useLocale<LocaleKeys>();

  if (isLoading || pendingCount === 0) return null;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push({
      pathname: "/verification" as any,
      params: { mode: "post-login" },
    });
  };

  if (variant === "dot") {
    return (
      <TouchableOpacity onPress={handlePress} style={styles.dotContainer} activeOpacity={0.7}>
        <View style={styles.dotBadge}>
          <Text style={styles.dotText}>{pendingCount}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === "pill") {
    return (
      <TouchableOpacity onPress={handlePress} style={styles.pillContainer} activeOpacity={0.7}>
        <Ionicons name="warning-outline" size={moderateScale(14, 0.3)} color={theme.colors.status.warning} />
        <Text style={styles.pillText}>
          {pendingCount} {auth.verificationPendingPills}
        </Text>
      </TouchableOpacity>
    );
  }

  // Banner (default)
  return (
    <TouchableOpacity onPress={handlePress} style={styles.bannerContainer} activeOpacity={0.9}>
      <View style={styles.bannerIconContainer}>
        <Ionicons name="shield-half-outline" size={moderateScale(24, 0.3)} color={theme.colors.status.warning} />
      </View>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{auth.verificationPendingTitle}</Text>
        <Text style={styles.bannerSubtitle}>
          {pendingCount === 2
            ? auth.verificationPendingBoth
            : auth.verificationPendingEmail}
        </Text>
      </View>
      <View style={styles.bannerArrow}>
        <Ionicons name="chevron-forward" size={moderateScale(18, 0.3)} color={theme.colors.primary.DEFAULT} />
      </View>
      {pendingCount > 0 && (
        <View style={styles.bannerCountBadge}>
          <Text style={styles.bannerCountText}>{pendingCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
