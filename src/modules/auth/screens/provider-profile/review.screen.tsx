import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useProviderProfileStore } from '@/modules/auth/store/provider-profile.store';
import { theme } from '@/shared/constants';
import { formatBRL } from '@/shared/utils/currency';
import { moderateScale, scale, verticalScale } from '@/shared/utils/scale';
import { t } from '@/shared/locales';
import { DAY_LABELS } from './types';
import styles from './styles';

export default function ReviewScreen() {
  const { selectedCategories, services, availability, reset } = useProviderProfileStore();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="chevron-back" size={moderateScale(22, 0.3)} color={theme.colors.text.primary} />
        </TouchableOpacity>
      ),
      headerTitle: t('auth.profileSetupReviewTitle'),
      headerTitleStyle: {
        fontSize: moderateScale(16, 0.3),
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
      },
      headerShadowVisible: false,
      headerStyle: { backgroundColor: theme.colors.background.DEFAULT },
    });
  }, [navigation]);

  const servicesByCategory = selectedCategories.map((category) => ({
    category,
    services: services.filter((s) => s.categoryId === category.id),
  }));

  const handleSubmit = () => {
    reset();
    router.replace('/(app)/home');
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { marginBottom: verticalScale(24) }]}>
          {t('auth.profileSetupReviewSubtitle')}
        </Text>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>{t('auth.profileSetupReviewCategories')}</Text>
          {selectedCategories.length === 0 ? (
            <Text style={styles.reviewItemContent}>{t('auth.profileSetupReviewEmpty')}</Text>
          ) : (
            selectedCategories.map((category) => (
              <View key={category.id} style={styles.reviewItem}>
                <Text style={styles.reviewItemTitle}>{category.name}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>{t('auth.profileSetupReviewServices')}</Text>
          {services.length === 0 ? (
            <Text style={styles.reviewItemContent}>{t('auth.profileSetupReviewEmpty')}</Text>
          ) : (
            servicesByCategory.map(({ category, services: categoryServices }) =>
              categoryServices.length > 0 ? (
                <View key={category.id}>
                  <Text
                    style={[
                      styles.reviewItemTitle,
                      { color: theme.colors.primary.DEFAULT, marginTop: verticalScale(12) },
                    ]}
                  >
                    {category.name}
                  </Text>
                  {categoryServices.map((service) => (
                    <View key={service.id} style={styles.reviewItem}>
                      <Text style={styles.reviewItemTitle}>{service.serviceName}</Text>
                      <Text style={styles.reviewItemContent}>
                        {service.estimatedDurationMinutes}min • {service.pricePerHour == null ? '' : formatBRL(service.pricePerHour)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null,
            )
          )}
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>{t('auth.profileSetupReviewAvailability')}</Text>
          {availability.length === 0 ? (
            <Text style={styles.reviewItemContent}>{t('auth.profileSetupReviewEmpty')}</Text>
          ) : (
            Array.from({ length: 7 }).map((_, day) => {
              const daySlots = availability.filter((slot) => slot.dayOfWeek === day);
              return daySlots.length > 0 ? (
                <View key={day} style={styles.reviewItem}>
                  <Text style={styles.reviewItemTitle}>{DAY_LABELS[day]}</Text>
                  {daySlots.map((slot) => (
                    <Text key={`${slot.dayOfWeek}-${slot.startTime}`} style={styles.reviewItemContent}>
                      {slot.startTime} - {slot.endTime}
                    </Text>
                  ))}
                </View>
              ) : null;
            })
          )}
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleSubmit}
          activeOpacity={0.85}
          testID="action-bar-submit-button"
        >
          <Text style={styles.nextButtonText}>{t('auth.profileSetupSubmit')}</Text>
          <Ionicons name="checkmark" size={scale(20)} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
