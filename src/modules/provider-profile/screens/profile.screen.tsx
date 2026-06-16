import React from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useProviderProfile } from "@/modules/provider-profile/hooks/useProviderProfile";
import { ProfileHeader, ServiceItem } from "../components";
import { styles } from "./styles";
import { t } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, scale, verticalScale } from "@/shared/utils/scale";

const requestButtonStyles = StyleSheet.create({
  wrapper: {
    padding: moderateScale(16, 0.5),
    backgroundColor: theme.palette.neutral[0],
    marginTop: moderateScale(2, 0.5),
  },
  button: {
    height: verticalScale(52),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
});

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

      <View style={styles.section} testID="provider-profile-about">
        <Text style={styles.sectionTitle}>{t("profile.about")}</Text>
        <Text style={styles.bio} testID="provider-profile-bio">{profile.bio}</Text>
      </View>

      <View style={styles.section} testID="provider-profile-services">
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

      <View style={styles.section} testID="provider-profile-payment-methods">
        <Text style={styles.sectionTitle}>{t("profile.paymentMethods")}</Text>
        {profile.paymentMethods.length === 0 ? (
          <Text style={styles.bio}>{t("profile.noPaymentMethods")}</Text>
        ) : (
          <View style={styles.paymentMethodsGrid}>
            {profile.paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentMethodChip}>
                <Ionicons
                  name={(method.icon ?? "cash") as any}
                  size={scale(14)}
                  color={theme.colors.primary.DEFAULT}
                />
                <Text style={styles.paymentMethodLabel}>{method.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section} testID="provider-profile-reviews">
        <Text style={styles.sectionTitle}>{t("profile.recentReviews")}</Text>
        {profile.reviews.length === 0 ? (
          <Text style={styles.bio}>{t("profile.noReviews")}</Text>
        ) : (
          profile.reviews.map((review, index) => (
            <View key={`${review.contractorName}-${review.createdAt}-${index}`} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= review.rating ? "star" : "star-outline"}
                      size={scale(14)}
                      color={theme.colors.accent.yellow}
                    />
                  ))}
                </View>
                <Text style={styles.reviewMeta}>{review.serviceName}</Text>
              </View>
              {review.comment ? (
                <Text style={styles.reviewComment}>{review.comment}</Text>
              ) : null}
              <Text style={styles.reviewAuthor}>{review.contractorName}</Text>
            </View>
          ))
        )}
      </View>

      <View style={requestButtonStyles.wrapper}>
        {profile.verificationStatus !== 'APPROVED' && (
          <Text style={styles.notApprovedText}>{t("profile.providerNotApproved")}</Text>
        )}
        <TouchableOpacity
          style={[
            requestButtonStyles.button,
            profile.verificationStatus !== 'APPROVED' && styles.buttonDisabled,
          ]}
          onPress={() =>
            router.push({
              pathname: "/(app)/service-requests/create" as any,
              params: { providerId: id, providerName: profile.name },
            })
          }
          disabled={profile.verificationStatus !== 'APPROVED'}
          activeOpacity={0.85}
          testID="request-service-button"
        >
          <Text style={requestButtonStyles.buttonText}>
            {t("serviceRequests.requestButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
