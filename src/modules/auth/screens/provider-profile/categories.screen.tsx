import React, { useLayoutEffect, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useProviderProfileStore } from '@/modules/auth/store/provider-profile.store';
import { useLoading } from '@/shared/hooks/useLoading';
import { theme } from '@/shared/constants';
import { moderateScale, verticalScale, scale } from '@/shared/utils/scale';
import { t } from '@/shared/locales';
import styles from './styles';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      // Em dev/E2E, se o banco não tiver categorias seedadas, usa dados de teste
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
      // Em dev/E2E, usa dados de teste mesmo em caso de erro
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
      addCategory({
        id: category.id,
        name: category.name,
        slug: category.slug,
      });
    }
  };

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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('auth.profileSetupCategoriesTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.profileSetupCategoriesSubtitle')}</Text>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((category) => {
            const isSelected = selectedCategories.some((cat) => cat.id === category.id);
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                onPress={() => toggleCategory(category)}
                activeOpacity={0.7}
                testID="category-card"
              >
                <View
                  style={[
                    styles.categoryIcon,
                    isSelected && styles.categoryIconSelected,
                  ]}
                >
                  <Ionicons
                    name={category.slug as any}
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
          style={[
            styles.nextButton,
            selectedCategories.length === 0 && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedCategories.length === 0}
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
