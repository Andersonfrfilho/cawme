import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SduiComponentProps } from '@/modules/sdui/types/sdui.types';
import { styles } from './styles';
import { theme } from '@/shared/constants';
import { moderateScale } from '@/shared/utils/scale';

interface Category {
  id: string;
  name: string;
  icon?: string;
  imageUrl?: string;
}

export default function CategoryList({ data, config, onItemPress }: SduiComponentProps) {
  const categories: Category[] = data || [];

  return (
    <View style={styles.sectionContainer}>
      {config?.title && (
        <Text style={styles.sectionTitle}>{config.title}</Text>
      )}
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryListContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryChip}
            onPress={() => onItemPress(category)}
            activeOpacity={0.7}
          >
            {category.imageUrl ? (
              <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} />
            ) : (
              <Ionicons
                name={(category.icon as any) || 'apps-outline'}
                size={moderateScale(20, 0.3)}
                color={theme.colors.primary.DEFAULT}
                style={styles.categoryIcon}
              />
            )}
            <Text style={styles.categoryChipText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
