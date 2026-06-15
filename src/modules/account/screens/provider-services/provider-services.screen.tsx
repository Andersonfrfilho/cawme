import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useLoading } from '@/shared/hooks/useLoading';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { useLocale, LocaleKeys, t } from '@/shared/locales';
import { theme } from '@/shared/constants';
import { moderateScale, scale, verticalScale } from '@/shared/utils/scale';
import type { CategoryDto, ProviderServiceDto, ServiceDto } from '@/modules/auth/services/types';
import styles from './styles';

const NEW_ITEM_ID = '__new__';

type ModalState = {
  categoryId: string | null;
  newCategoryName: string;
  serviceId: string | null;
  newServiceName: string;
  pricePerHour: string;
  estimatedDurationMinutes: string;
};

const EMPTY_MODAL: ModalState = {
  categoryId: null,
  newCategoryName: '',
  serviceId: null,
  newServiceName: '',
  pricePerHour: '',
  estimatedDurationMinutes: '',
};

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function ProviderServicesScreen() {
  const insets = useSafeAreaInsets();
  const { account } = useLocale<LocaleKeys>();
  const {
    getProviderServices,
    createProviderService,
    deleteProviderService,
    getCategories,
    getServices,
    createCategory,
    createServiceCatalog,
  } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const [allCategories, setAllCategories] = useState<CategoryDto[]>([]);
  const [allServices, setAllServices] = useState<ServiceDto[]>([]);
  const [providerServices, setProviderServices] = useState<ProviderServiceDto[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState<ModalState>(EMPTY_MODAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [confirmService, setConfirmService] = useState<ProviderServiceDto | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [servicesResult, categoriesResult, catalogResult] = await Promise.all([
        getProviderServices(),
        getCategories(),
        getServices(),
      ]);
      const loadedServices = servicesResult.data ?? [];
      const loadedCategories = categoriesResult.data ?? [];
      const loadedCatalog = catalogResult.data ?? [];
      setProviderServices(loadedServices);
      setAllCategories(loadedCategories);
      setAllServices(loadedCatalog);

      const uniqueCategoryIds = [...new Set(loadedServices.map((s) => s.categoryId))];
      if (uniqueCategoryIds.length > 0) {
        setActiveCategory(uniqueCategoryIds[0]);
      } else if (loadedCategories.length > 0) {
        setActiveCategory(loadedCategories[0].id);
      }
    } catch {
      Alert.alert('', account.providerServicesLoadError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categoryTabs = allCategories.filter(
    (cat) =>
      providerServices.some((s) => s.categoryId === cat.id) || cat.id === activeCategory,
  );
  const visibleCategories = categoryTabs.length > 0 ? categoryTabs : allCategories;
  const currentServices = providerServices.filter((s) => s.categoryId === activeCategory);
  const servicesForSelectedCategory = allServices.filter((s) => s.categoryId === modal.categoryId);

  const isNewCategory = modal.categoryId === NEW_ITEM_ID;
  const isNewService = modal.serviceId === NEW_ITEM_ID;

  const handleAddService = async () => {
    const price = Number.parseFloat(modal.pricePerHour.replace(',', '.'));

    if (!modal.categoryId || !modal.serviceId || !modal.pricePerHour) {
      Alert.alert('', t('auth.profileSetupValidationRequired'));
      return;
    }
    if (isNewCategory && !modal.newCategoryName.trim()) {
      Alert.alert('', t('auth.profileSetupValidationRequired'));
      return;
    }
    if (isNewService && !modal.newServiceName.trim()) {
      Alert.alert('', t('auth.profileSetupValidationRequired'));
      return;
    }
    if (Number.isNaN(price) || price <= 0) {
      Alert.alert('', t('auth.profileSetupValidationRequired'));
      return;
    }

    setIsSubmitting(true);
    showLoading();
    try {
      let resolvedCategoryId = modal.categoryId;
      let resolvedCategoryName =
        allCategories.find((c) => c.id === modal.categoryId)?.name ?? '';

      if (isNewCategory) {
        const created = await createCategory({
          name: modal.newCategoryName.trim(),
          slug: toSlug(modal.newCategoryName),
        });
        resolvedCategoryId = created.id;
        resolvedCategoryName = created.name;
        setAllCategories((prev) => [
          ...prev,
          { id: created.id, name: created.name, slug: created.slug, iconUrl: null },
        ]);
      }

      let resolvedServiceId = modal.serviceId;
      let resolvedServiceName =
        allServices.find((s) => s.id === modal.serviceId)?.name ?? '';

      if (isNewService) {
        const created = await createServiceCatalog({
          name: modal.newServiceName.trim(),
          categoryId: resolvedCategoryId,
        });
        resolvedServiceId = created.id;
        resolvedServiceName = created.name;
        setAllServices((prev) => [
          ...prev,
          { id: created.id, name: created.name, categoryId: resolvedCategoryId, description: null },
        ]);
      }

      const result = await createProviderService({
        serviceId: resolvedServiceId,
        estimatedDurationMinutes: Number.parseInt(modal.estimatedDurationMinutes, 10) || 60,
        pricePerHour: price,
      });

      setProviderServices((prev) => [
        ...prev,
        {
          ...result.data,
          categoryId: resolvedCategoryId,
          categoryName: resolvedCategoryName,
          serviceName: resolvedServiceName,
        },
      ]);
      setActiveCategory(resolvedCategoryId);
      setModal(EMPTY_MODAL);
      setShowModal(false);
    } catch {
      Alert.alert('', account.providerServicesAddError);
    } finally {
      hideLoading();
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirmed = async (): Promise<void> => {
    if (!confirmService) return;
    const target = confirmService;
    setConfirmService(null);
    showLoading();
    try {
      await deleteProviderService(target.id);
      setProviderServices((prev) => prev.filter((s) => s.id !== target.id));
    } catch {
      Alert.alert('', account.providerServicesDeleteError);
    } finally {
      hideLoading();
    }
  };

  const closeModal = () => {
    setModal(EMPTY_MODAL);
    setShowModal(false);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{account.providerServicesTitle}</Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.colors.primary.DEFAULT} />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.subtitle}>{account.providerServicesSubtitle}</Text>

          {visibleCategories.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPillsRow}
            >
              {visibleCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryPill,
                    activeCategory === category.id && styles.categoryPillActive,
                  ]}
                  onPress={() => setActiveCategory(category.id)}
                  activeOpacity={0.7}
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
          )}

          <TouchableOpacity
            style={styles.addServiceButton}
            onPress={() => setShowModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={scale(20)} color={theme.colors.primary.DEFAULT} />
            <Text style={styles.addServiceButtonText}>{account.providerServicesAddButton}</Text>
          </TouchableOpacity>

          {currentServices.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="briefcase-outline"
                size={moderateScale(40, 0.3)}
                color={theme.palette.neutral[300]}
              />
              <Text style={styles.emptyStateText}>{account.providerServicesEmpty}</Text>
            </View>
          ) : (
            currentServices.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.serviceName}</Text>
                  <Text style={styles.serviceDetails}>
                    {service.estimatedDurationMinutes}min • R${service.pricePerHour?.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setConfirmService(service)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={scale(20)} color={theme.colors.status.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <ConfirmModal
        visible={confirmService !== null}
        title={account.providerServicesDeleteConfirmTitle}
        message={account.providerServicesDeleteConfirmMessage}
        confirmLabel={account.providerServicesDeleteConfirmButton}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmService(null)}
      />

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={closeModal}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom + verticalScale(24), verticalScale(40)) }]}>
                  <View style={styles.modalHandle} />
                  <Text style={styles.modalTitle}>{t('auth.profileSetupAddServiceTitle')}</Text>

                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {/* Categoria */}
                    <Text style={styles.sectionLabel}>CATEGORIA</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: moderateScale(8, 0.5), paddingBottom: verticalScale(16) }}
                    >
                      {allCategories.map((cat) => (
                        <TouchableOpacity
                          key={cat.id}
                          style={[
                            styles.pickerItem,
                            modal.categoryId === cat.id && styles.pickerItemActive,
                          ]}
                          onPress={() => setModal({ ...modal, categoryId: cat.id, serviceId: null })}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.pickerItemText,
                              modal.categoryId === cat.id && styles.pickerItemTextActive,
                            ]}
                          >
                            {cat.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        style={[
                          styles.pickerItem,
                          styles.pickerItemNew,
                          modal.categoryId === NEW_ITEM_ID && styles.pickerItemActive,
                        ]}
                        onPress={() => setModal({ ...modal, categoryId: NEW_ITEM_ID, serviceId: null })}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            styles.pickerItemTextNew,
                            modal.categoryId === NEW_ITEM_ID && styles.pickerItemTextActive,
                          ]}
                        >
                          + Nova categoria
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>

                    {isNewCategory && (
                      <TextInput
                        style={[styles.fieldInput, focusedField === 'catName' && styles.fieldInputFocused]}
                        placeholder="Nome da nova categoria"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={modal.newCategoryName}
                        onChangeText={(text) => setModal({ ...modal, newCategoryName: text })}
                        onFocus={() => setFocusedField('catName')}
                        onBlur={() => setFocusedField(null)}
                        autoFocus
                      />
                    )}

                    {/* Serviço — aparece apenas quando categoria selecionada */}
                    {modal.categoryId && (
                      <>
                        <Text style={styles.sectionLabel}>SERVIÇO</Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: moderateScale(8, 0.5), paddingBottom: verticalScale(16) }}
                        >
                          {servicesForSelectedCategory.map((svc) => (
                            <TouchableOpacity
                              key={svc.id}
                              style={[
                                styles.pickerItem,
                                modal.serviceId === svc.id && styles.pickerItemActive,
                              ]}
                              onPress={() => setModal({ ...modal, serviceId: svc.id })}
                              activeOpacity={0.7}
                            >
                              <Text
                                style={[
                                  styles.pickerItemText,
                                  modal.serviceId === svc.id && styles.pickerItemTextActive,
                                ]}
                              >
                                {svc.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                          <TouchableOpacity
                            style={[
                              styles.pickerItem,
                              styles.pickerItemNew,
                              modal.serviceId === NEW_ITEM_ID && styles.pickerItemActive,
                            ]}
                            onPress={() => setModal({ ...modal, serviceId: NEW_ITEM_ID })}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.pickerItemText,
                                styles.pickerItemTextNew,
                                modal.serviceId === NEW_ITEM_ID && styles.pickerItemTextActive,
                              ]}
                            >
                              + Novo serviço
                            </Text>
                          </TouchableOpacity>
                        </ScrollView>

                        {isNewService && (
                          <TextInput
                            style={[styles.fieldInput, focusedField === 'svcName' && styles.fieldInputFocused]}
                            placeholder="Nome do novo serviço"
                            placeholderTextColor={theme.colors.text.secondary}
                            value={modal.newServiceName}
                            onChangeText={(text) => setModal({ ...modal, newServiceName: text })}
                            onFocus={() => setFocusedField('svcName')}
                            onBlur={() => setFocusedField(null)}
                          />
                        )}
                      </>
                    )}

                    {/* Preço e duração — aparecem apenas quando serviço selecionado */}
                    {modal.serviceId && (
                      <>
                        <Text style={styles.fieldLabel}>{t('auth.profileSetupPricePerHourLabel')}</Text>
                        <TextInput
                          style={[styles.fieldInput, focusedField === 'price' && styles.fieldInputFocused]}
                          placeholder={t('auth.profileSetupPricePerHourPlaceholder')}
                          placeholderTextColor={theme.colors.text.secondary}
                          value={modal.pricePerHour}
                          onChangeText={(text) => setModal({ ...modal, pricePerHour: text })}
                          onFocus={() => setFocusedField('price')}
                          onBlur={() => setFocusedField(null)}
                          keyboardType="decimal-pad"
                        />

                        <Text style={styles.fieldLabel}>{t('auth.profileSetupDurationLabel')}</Text>
                        <TextInput
                          style={[styles.fieldInput, focusedField === 'duration' && styles.fieldInputFocused]}
                          placeholder={t('auth.profileSetupDurationPlaceholder')}
                          placeholderTextColor={theme.colors.text.secondary}
                          value={modal.estimatedDurationMinutes}
                          onChangeText={(text) => setModal({ ...modal, estimatedDurationMinutes: text })}
                          onFocus={() => setFocusedField('duration')}
                          onBlur={() => setFocusedField(null)}
                          keyboardType="number-pad"
                        />
                      </>
                    )}

                    <TouchableOpacity
                      style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                      onPress={handleAddService}
                      disabled={isSubmitting}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.submitButtonText}>
                        {t('auth.profileSetupAddServiceButton')}
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
