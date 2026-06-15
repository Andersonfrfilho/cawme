import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useProviderProfileStore } from '@/modules/auth/store/provider-profile.store';
import { useLoading } from '@/shared/hooks/useLoading';
import { theme } from '@/shared/constants';
import { moderateScale, scale, verticalScale } from '@/shared/utils/scale';
import { t } from '@/shared/locales';
import { isTestEnvironment } from '@/shared/utils/test-environment';
import { DAY_LABELS } from './types';
import styles from './styles';

export default function AvailabilityScreen() {
  const { selectedCategories, addAvailabilitySlot, availability } = useProviderProfileStore();
  const { setProviderAvailability } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [dayTimes, setDayTimes] = useState<Record<number, { enabled: boolean; startTime: string; endTime: string }>>(() => {
    const initial: Record<number, { enabled: boolean; startTime: string; endTime: string }> = {};
    for (let i = 0; i < 7; i++) {
      const existing = availability.find((slot) => slot.dayOfWeek === i);
      initial[i] = {
        enabled: !!existing,
        startTime: existing?.startTime ?? '09:00',
        endTime: existing?.endTime ?? '17:00',
      };
    }
    return initial;
  });
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

  const toggleDay = (day: number) => {
    setDayTimes((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const updateTime = (day: number, field: 'startTime' | 'endTime', value: string) => {
    setDayTimes((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleNext = async () => {
    const enabledDays = Object.entries(dayTimes)
      .filter(([, slot]) => slot.enabled)
      .map(([day]) => parseInt(day, 10));

    if (enabledDays.length === 0) {
      alert(t('auth.profileSetupValidationRequired'));
      return;
    }

    setIsSubmitting(true);
    showLoading();
    try {
      const isTest = isTestEnvironment();
      for (const day of enabledDays) {
        const slot = dayTimes[day];
        if (!isTest) {
          await setProviderAvailability({
            dayOfWeek: day,
            startTime: slot.startTime,
            endTime: slot.endTime,
          });
        }

        addAvailabilitySlot({
          id: `${day}-${slot.startTime}-${slot.endTime}`,
          dayOfWeek: day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: true,
        });
      }

      router.push('/(auth)/provider-profile/review');
    } catch (error) {
      console.error('[availability] Failed to set availability:', error);
      alert(t('auth.profileSetupErrorFinalizing'));
    } finally {
      hideLoading();
      setIsSubmitting(false);
    }
  };

  const enabledDaysCount = Object.values(dayTimes).filter((slot) => slot.enabled).length;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('auth.profileSetupAvailabilityTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.profileSetupAvailabilitySubtitle')}</Text>
        </View>

        <View style={styles.timePickerContainer}>
          {Array.from({ length: 7 }).map((_, day) => (
            <View key={day} style={styles.dayAvailabilityItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(12) }}>
                <Text style={[styles.timePickerLabel, { flex: 1 }]}>{DAY_LABELS[day]}</Text>
                <Switch
                  value={dayTimes[day].enabled}
                  onValueChange={() => toggleDay(day)}
                  trackColor={{
                    false: theme.palette.neutral[200],
                    true: theme.colors.primary.surface,
                  }}
                  thumbColor={dayTimes[day].enabled ? theme.colors.primary.DEFAULT : theme.palette.neutral[300]}
                  testID={`day-toggle-${day}`}
                />
              </View>

              {dayTimes[day].enabled && (
                <View style={styles.timeInputRow}>
                  <TextInput
                    placeholder={t('auth.profileSetupStartTime')}
                    value={dayTimes[day].startTime}
                    onChangeText={(text) => updateTime(day, 'startTime', text)}
                    style={styles.timeInput}
                    placeholderTextColor={theme.colors.text.secondary}
                    testID={`day-${day}-start-time`}
                  />
                  <Text style={{ color: theme.colors.text.primary, alignSelf: 'center' }}>até</Text>
                  <TextInput
                    placeholder={t('auth.profileSetupEndTime')}
                    value={dayTimes[day].endTime}
                    onChangeText={(text) => updateTime(day, 'endTime', text)}
                    style={styles.timeInput}
                    placeholderTextColor={theme.colors.text.secondary}
                    testID={`day-${day}-end-time`}
                  />
                </View>
              )}
            </View>
          ))}
        </View>

        <View
          style={{
            backgroundColor: theme.colors.background.card,
            borderRadius: theme.radii.lg,
            padding: moderateScale(16, 0.5),
            marginBottom: verticalScale(24),
          }}
        >
          <Text style={styles.timePickerLabel}>
            {enabledDaysCount} {enabledDaysCount === 1 ? 'dia' : 'dias'} selecionados
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.nextButton, enabledDaysCount === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={enabledDaysCount === 0 || isSubmitting}
          activeOpacity={0.85}
          testID="action-bar-next-button"
        >
          <Text style={styles.nextButtonText}>{t('auth.profileSetupContinue')}</Text>
          <Ionicons name="arrow-forward" size={scale(20)} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
