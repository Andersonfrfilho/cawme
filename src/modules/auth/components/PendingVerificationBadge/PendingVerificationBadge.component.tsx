import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { usePendingVerification } from "../../hooks/usePendingVerification";
import { useAuthStore } from "../../store/auth.store";
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
  const { pendingCount, pendingItems, isLoading } = usePendingVerification();
  const user = useAuthStore((state) => state.user);
  const { auth } = useLocale<LocaleKeys>();

  if (isLoading) return null;
  if (pendingCount === 0) return null;

  const getSubtitle = () => {
    if (pendingItems.length === 1) {
      const item = pendingItems[0];
      if (item === "email") return auth.verificationPendingEmail;
      if (item === "phone") return auth.verificationPendingPhone;
      if (item === "document") return auth.verificationPendingDocument;
    }
    if (pendingItems.includes("email") && pendingItems.includes("phone")) {
      return auth.verificationPendingBoth;
    }
    if (pendingItems.includes("document")) {
      if (pendingItems.length === 2) {
        const other = pendingItems.find((i) => i !== "document");
        if (other === "email") return auth.verificationPendingEmail + " e documento";
        if (other === "phone") return auth.verificationPendingPhone + " e documento";
      }
      return auth.verificationPendingDocument;
    }
    return auth.verificationPendingEmail;
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    const hasDocument = pendingItems.includes("document");
    if (hasDocument) {
      router.push({ pathname: "/(auth)/document-upload" as any, params: { mode: "post-login" } });
    } else {
      router.push({
        pathname: "/(auth)/verification" as any,
        params: { mode: "post-login", email: user?.email ?? "", phone: user?.phone ?? "" },
      });
    }
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
    <TouchableOpacity testID="pending-verification-banner" onPress={handlePress} style={styles.bannerContainer} activeOpacity={0.9}>
      <View style={styles.bannerIconContainer}>
        <Ionicons name="shield-half-outline" size={moderateScale(24, 0.3)} color={theme.colors.status.warning} />
      </View>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{auth.verificationPendingTitle}</Text>
        <Text style={styles.bannerSubtitle}>{getSubtitle()}</Text>
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
