import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SduiComponentProps } from '@/modules/sdui/types/sdui.types';
import { theme } from '@/shared/constants';
import { moderateScale, scale, verticalScale } from '@/shared/utils/scale';

interface FilterItem {
  id: string;
  label: string;
  icon?: string;
}

interface SearchFiltersConfig {
  filters?: FilterItem[];
  activeFilter?: string | null;
}

const DEFAULT_FILTERS: FilterItem[] = [
  { id: 'top_rated', label: 'Mais avaliados', icon: 'star-outline' },
  { id: 'location', label: 'Mais próximos', icon: 'location-outline' },
  { id: 'available', label: 'Disponíveis', icon: 'time-outline' },
  { id: 'price', label: 'Menor preço', icon: 'pricetag-outline' },
];

export default function SearchFilters({ config, onItemPress }: SduiComponentProps) {
  const filtersConfig = config as SearchFiltersConfig;
  const filters: FilterItem[] = filtersConfig.filters ?? DEFAULT_FILTERS;
  const activeFilter = filtersConfig.activeFilter ?? null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.container}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <TouchableOpacity
            key={filter.id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onItemPress({ filterId: filter.id })}
            activeOpacity={0.75}
          >
            {filter.icon && (
              <Ionicons
                name={filter.icon as any}
                size={scale(14)}
                color={isActive ? theme.palette.neutral[0] : theme.colors.text.secondary}
              />
            )}
            <Text style={[styles.label, isActive && styles.labelActive]}>{filter.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(8),
  },
  row: {
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[2],
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4, 0.5),
    backgroundColor: theme.palette.neutral[0],
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    borderRadius: theme.radii.full,
    paddingHorizontal: moderateScale(12, 0.5),
    paddingVertical: verticalScale(6),
  },
  chipActive: {
    backgroundColor: theme.palette.blue[500],
    borderColor: theme.palette.blue[500],
  },
  label: {
    fontSize: moderateScale(theme.typography.fontSize.sm, 0.3),
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  labelActive: {
    color: theme.palette.neutral[0],
  },
});
