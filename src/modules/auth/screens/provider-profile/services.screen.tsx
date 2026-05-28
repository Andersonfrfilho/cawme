import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useProviderProfileStore } from '@/modules/auth/store/provider-profile.store';
import { useLoading } from '@/shared/hooks/useLoading';
import { theme } from '@/shared/constants';
import { moderateScale, scale } from '@/shared/utils/scale';
import { t } from '@/shared/locales';
import styles from './styles';

export default function ServicesScreen() {
  const { selectedCategories, addService, removeService, services } = useProviderProfileStore();
  const { createProviderService } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategories[0]?.id ?? null);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({
    serviceName: '',
    estimatedDurationMinutes: '60',
    pricePerHour: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCategoryServices = services.filter(
    (service) => service.categoryId === activeCategory,
  );

  const handleAddService = async () => {
    if (!formValues.serviceName.trim() || !formValues.pricePerHour.trim() || !activeCategory) {
      alert(t('auth.profileSetupValidationRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      await createProviderService({
        serviceId: `${activeCategory}-${Date.now()}`,
        estimatedDurationMinutes: parseInt(formValues.estimatedDurationMinutes, 10),
        pricePerHour: parseFloat(formValues.pricePerHour),
      });

      addService({
        id: `${activeCategory}-${Date.now()}`,
        serviceId: `${activeCategory}-${Date.now()}`,
        categoryId: activeCategory,
        categoryName: selectedCategories.find((cat) => cat.id === activeCategory)?.name ?? '',
        serviceName: formValues.serviceName,
        estimatedDurationMinutes: parseInt(formValues.estimatedDurationMinutes, 10),
        pricePerHour: parseFloat(formValues.pricePerHour),
        isActive: true,
      });

      setFormValues({ serviceName: '', estimatedDurationMinutes: '60', pricePerHour: '' });
      setShowModal(false);
    } catch (error) {
      console.error('[services] Failed to add service:', error);
      alert(t('auth.profileSetupErrorAddingService'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveService = async (serviceId: string) => {
    try {
      removeService(serviceId);
    } catch (error) {
      console.error('[services] Failed to remove service:', error);
    }
  };

  const handleNext = async () => {
    if (services.length === 0) {
      alert(t('auth.profileSetupValidationAtLeastOneService'));
      return;
    }
    router.push('/(auth)/provider-profile/availability');
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('auth.profileSetupServicesTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.profileSetupServicesSubtitle')}</Text>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.categorySectionTitle}>{t('auth.profileSetupSelectCategory')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: moderateScale(24, 0.5) }}>
            {selectedCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setActiveCategory(category.id)}
                style={[
                  styles.categoryPill,
                  activeCategory === category.id && styles.categoryPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    activeCategory === category.id && styles.categoryPillTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.servicesContainer}>
          <TouchableOpacity
            style={styles.addServiceButton}
            onPress={() => setShowModal(true)}
            testID="add-service-button"
          >
            <Ionicons name="add-circle-outline" size={scale(20)} color={theme.colors.primary.DEFAULT} />
            <Text style={styles.addServiceButtonText}>{t('auth.profileSetupAddService')}</Text>
          </TouchableOpacity>

          {currentCategoryServices.length > 0 && (
            <View style={{ marginTop: moderateScale(20, 0.5) }}>
              {currentCategoryServices.map((service) => (
                <View key={service.id} style={styles.serviceCard}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.serviceName}</Text>
                    <Text style={styles.serviceDetails}>
                      {service.estimatedDurationMinutes}min • R${service.pricePerHour?.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.serviceActions}>
                    <TouchableOpacity onPress={() => handleRemoveService(service.id)}>
                      <Ionicons name="trash-outline" size={scale(20)} color={theme.colors.primary.DEFAULT} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.nextButton, services.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={services.length === 0}
          activeOpacity={0.85}
          testID="action-bar-next-button"
        >
          <Text style={styles.nextButtonText}>{t('auth.profileSetupContinue')}</Text>
          <Ionicons name="arrow-forward" size={scale(20)} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.root}>
          <View style={{ flex: 1, padding: moderateScale(20, 0.5) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(20, 0.5) }}>
              <Text style={styles.title}>{t('auth.profileSetupAddServiceTitle')}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} testID="modal-close-button">
                <Ionicons name="close" size={scale(24)} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder={t('auth.profileSetupServiceNamePlaceholder')}
              value={formValues.serviceName}
              onChangeText={(text) => setFormValues({ ...formValues, serviceName: text })}
              style={[styles.timeInput, { marginBottom: moderateScale(16, 0.5) }]}
              placeholderTextColor={theme.colors.text.secondary}
              testID="service-name-input"
            />

            <TextInput
              placeholder={t('auth.profileSetupDurationPlaceholder')}
              value={formValues.estimatedDurationMinutes}
              onChangeText={(text) => setFormValues({ ...formValues, estimatedDurationMinutes: text })}
              keyboardType="number-pad"
              style={[styles.timeInput, { marginBottom: moderateScale(16, 0.5) }]}
              placeholderTextColor={theme.colors.text.secondary}
              testID="duration-input"
            />

            <TextInput
              placeholder={t('auth.profileSetupPricePerHourPlaceholder')}
              value={formValues.pricePerHour}
              onChangeText={(text) => setFormValues({ ...formValues, pricePerHour: text })}
              keyboardType="decimal-pad"
              style={[styles.timeInput, { marginBottom: moderateScale(32, 0.5) }]}
              placeholderTextColor={theme.colors.text.secondary}
              testID="price-input"
            />

            <TouchableOpacity
              style={[styles.nextButton, isSubmitting && styles.nextButtonDisabled]}
              onPress={handleAddService}
              disabled={isSubmitting}
              activeOpacity={0.85}
              testID="service-modal-submit-button"
            >
              <Text style={styles.nextButtonText}>{t('auth.profileSetupAddServiceButton')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
