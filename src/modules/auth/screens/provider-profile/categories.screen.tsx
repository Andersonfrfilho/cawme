import React, { useLayoutEffect, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useProviderProfileStore } from '@/modules/auth/store/provider-profile.store';
import { theme } from '@/shared/constants';
import { moderateScale, scale, verticalScale } from '@/shared/utils/scale';
import { t } from '@/shared/locales';
import { getCategoryIcon } from './types';
import styles from './styles';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { getCategories } = useAuth();
  const { selectedCategories, addCategory, removeCategory } = useProviderProfileStore();
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

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const result = await getCategories();
      if (result.data.length === 0 && __DEV__) {
        setCategories([
          { id: 'test-cat-1', name: 'Limpeza', slug: 'cleaning' },
          { id: 'test-cat-2', name: 'Encanamento', slug: 'plumbing' },
          { id: 'test-cat-3', name: 'Eletricidade', slug: 'electrical' },
        ]);
      } else {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('[categories] Failed to load categories:', error);
      if (__DEV__) {
        setCategories([
          { id: 'test-cat-1', name: 'Limpeza', slug: 'cleaning' },
          { id: 'test-cat-2', name: 'Encanamento', slug: 'plumbing' },
          { id: 'test-cat-3', name: 'Eletricidade', slug: 'electrical' },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (category: any) => {
    const isSelected = selectedCategories.some((cat) => cat.id === category.id);
    if (isSelected) {
      removeCategory(category.id);
    } else {
      addCategory({ id: category.id, name: category.name, slug: category.slug });
    }
  };

  const handleConfirmAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    const slug = trimmed.toLowerCase().replace(/\s+/g, '-');
    const newCategory = { id: Crypto.randomUUID(), name: trimmed, slug };
    setCategories((prev) => [...prev, newCategory]);
    addCategory(newCategory);
    setNewCategoryName('');
    setShowAddModal(false);
  };

  const filteredCategories = searchQuery.trim()
    ? categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : categories;

  const handleNext = () => {
    if (selectedCategories.length === 0) return;
    router.push('/(auth)/provider-profile/services');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('auth.profileSetupCategoriesTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.profileSetupCategoriesSubtitle')}</Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={scale(18)}
              color={theme.colors.text.secondary}
              style={{ marginRight: moderateScale(8, 0.5) }}
            />
            <TextInput
              placeholder={t('auth.profileSetupCategoriesSearch')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor={theme.colors.text.secondary}
              returnKeyType="search"
              testID="category-search-input"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={scale(18)} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.addCategoryIconButton}
            onPress={() => setShowAddModal(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            testID="open-add-category-button"
          >
            <Ionicons name="add" size={scale(22)} color={theme.palette.neutral[0]} />
          </TouchableOpacity>
        </View>

        <View style={[styles.categoriesGrid, { marginTop: verticalScale(16) }]}>
          {filteredCategories.map((category) => {
            const isSelected = selectedCategories.some((cat) => cat.id === category.id);
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                onPress={() => toggleCategory(category)}
                activeOpacity={0.7}
                testID="category-card"
              >
                <View style={[styles.categoryIcon, isSelected && styles.categoryIconSelected]}>
                  <Ionicons
                    name={getCategoryIcon(category.slug) as any}
                    size={scale(32)}
                    color={isSelected ? theme.palette.neutral[0] : theme.colors.primary.DEFAULT}
                  />
                </View>
                <Text style={[styles.categoryName, isSelected && styles.categoryNameSelected]}>
                  {category.name}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark} testID="category-checkmark">
                    <Ionicons name="checkmark-circle" size={scale(24)} color={theme.colors.primary.DEFAULT} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.nextButton, selectedCategories.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedCategories.length === 0}
          activeOpacity={0.85}
          testID="action-bar-next-button"
        >
          <Text style={styles.nextButtonText}>{t('auth.profileSetupContinue')}</Text>
          <Ionicons name="arrow-forward" size={scale(20)} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => { setNewCategoryName(''); setShowAddModal(false); }}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => { setNewCategoryName(''); setShowAddModal(false); }}
          >
            <TouchableOpacity activeOpacity={1} style={styles.addCategoryModal}>
              <View style={styles.addCategoryModalHandle} />

              <Text style={styles.addCategoryModalTitle}>
                {t('auth.profileSetupCategoriesAddTitle')}
              </Text>
              <Text style={[styles.subtitle, { marginBottom: verticalScale(20) }]}>
                {t('auth.profileSetupCategoriesAddSubtitle')}
              </Text>

              <Text style={styles.timePickerLabel}>{t('auth.profileSetupCategoriesAddLabel')}</Text>
              <TextInput
                placeholder={t('auth.profileSetupCategoriesAddPlaceholder')}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                style={[styles.timeInput, { marginBottom: moderateScale(24, 0.5) }]}
                placeholderTextColor={theme.colors.text.secondary}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleConfirmAddCategory}
                testID="new-category-name-input"
              />

              <TouchableOpacity
                style={[styles.nextButton, !newCategoryName.trim() && styles.nextButtonDisabled]}
                onPress={handleConfirmAddCategory}
                disabled={!newCategoryName.trim()}
                activeOpacity={0.85}
                testID="confirm-add-category-button"
              >
                <Text style={styles.nextButtonText}>{t('auth.profileSetupCategoriesAddButton')}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
