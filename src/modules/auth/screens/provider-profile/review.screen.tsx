import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useProviderProfileStore } from '@/modules/auth/store/provider-profile.store';
import { useLoading } from '@/shared/hooks/useLoading';
import { theme } from '@/shared/constants';
import { moderateScale, scale, verticalScale } from '@/shared/utils/scale';
import { t } from '@/shared/locales';
import { DAY_LABELS } from './types';
import styles from './styles';

export default function ReviewScreen() {
  const { selectedCategories, services, availability, reset } = useProviderProfileStore();
  const { createProviderService, setProviderAvailability } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      headerTitle: '',
      headerShadowVisible: false,
    });
  }, [navigation]);

  const servicesByCategory = selectedCategories.map((category) => ({
    category,
    services: services.filter((s) => s.categoryId === category.id),
  }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    showLoading();
    try {
      for (const service of services) {
        await createProviderService({
          serviceId: service.serviceId,
          estimatedDurationMinutes: service.estimatedDurationMinutes,
          pricePerHour: service.pricePerHour,
          priceBase: service.priceBase,
          priceType: service.priceType,
        });
      }

      for (const slot of availability) {
        await setProviderAvailability({
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
      }

      reset();
      router.replace('/(app)/home');
    } catch (error) {
      console.error('[review] Failed to finalize:', error);
      alert(t('auth.profileSetupValidationRequired'));
    } finally {
      hideLoading();
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('auth.profileSetupReviewTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.profileSetupReviewSubtitle')}</Text>
        </View>

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
                        {service.estimatedDurationMinutes}min • R${service.pricePerHour?.toFixed(2)}
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
                  {daySlots.map((slot, idx) => (
                    <Text key={idx} style={styles.reviewItemContent}>
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
          style={[styles.nextButton, isSubmitting && styles.nextButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
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
