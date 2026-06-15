import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SduiComponentProps } from '@/modules/sdui/types/sdui.types';
import { theme } from '@/shared/constants';
import { moderateScale, scale, verticalScale } from '@/shared/utils/scale';

interface ProviderItem {
  id: string;
  name: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  distance?: string;
  avatarUrl?: string;
}

interface ProviderListConfig {
  providers?: ProviderItem[];
  title?: string;
  activeFilter?: string | null;
  searchTerm?: string;
}

function parseDistanceKm(distance?: string): number {
  if (!distance) return Infinity;
  const match = distance.match(/[\d,.]+/);
  if (!match) return Infinity;
  return parseFloat(match[0].replace(',', '.'));
}

const SORT_FILTERS = new Set(['top_rated', 'location']);

function sortProviders(providers: ProviderItem[], filter: string | null): ProviderItem[] {
  if (!filter) return providers;
  const list = [...providers];
  switch (filter) {
    case 'top_rated':
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'location':
      return list.sort((a, b) => parseDistanceKm(a.distance) - parseDistanceKm(b.distance));
    default:
      return list;
  }
}

function ProviderCard({ provider, onPress }: { provider: ProviderItem; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={scale(28)} color={theme.colors.text.tertiary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{provider.name}</Text>
        {provider.category && (
          <Text style={styles.category} numberOfLines={1}>{provider.category}</Text>
        )}
        <View style={styles.meta}>
          {provider.rating !== undefined && (
            <View style={styles.rating}>
              <Ionicons name="star" size={scale(12)} color={theme.colors.accent.yellow} />
              <Text style={styles.ratingText}>{provider.rating.toFixed(1)}</Text>
              {provider.reviewCount !== undefined && (
                <Text style={styles.reviewCount}>({provider.reviewCount})</Text>
              )}
            </View>
          )}
          {provider.distance && (
            <Text style={styles.distance}>{provider.distance}</Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={scale(16)} color={theme.colors.text.tertiary} />
    </TouchableOpacity>
  );
}

export default function ProviderList({ config, data, onItemPress }: SduiComponentProps) {
  const listConfig = config as ProviderListConfig;
  const rawProviders: ProviderItem[] = listConfig.providers ?? (data as any)?.providers ?? [];

  const term = listConfig.searchTerm?.trim().toLowerCase() ?? '';
  const categoryFilter =
    listConfig.activeFilter && !SORT_FILTERS.has(listConfig.activeFilter)
      ? listConfig.activeFilter.toLowerCase()
      : null;

  const filtered = rawProviders.filter((p) => {
    if (categoryFilter && !(p.category?.toLowerCase().includes(categoryFilter) ?? false)) {
      return false;
    }
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      (p.category?.toLowerCase().includes(term) ?? false)
    );
  });

  const providers = sortProviders(filtered, listConfig.activeFilter ?? null);

  if (providers.length === 0) return null;

  return (
    <View style={styles.container}>
      {listConfig.title && <Text style={styles.title}>{listConfig.title}</Text>}
      <FlatList
        data={providers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() => onItemPress({ providerId: item.id })}
          />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: verticalScale(8),
  },
  title: {
    fontSize: moderateScale(theme.typography.fontSize.md, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(12),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.palette.neutral[0],
    borderRadius: theme.radii.lg,
    padding: moderateScale(theme.spacing[3], 0.5),
    gap: moderateScale(theme.spacing[3], 0.5),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    ...theme.shadows.sm,
  },
  avatar: {
    width: scale(theme.metrics.avatarSize.md),
    height: scale(theme.metrics.avatarSize.md),
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: verticalScale(2),
  },
  name: {
    fontSize: moderateScale(theme.typography.fontSize.base, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  category: {
    fontSize: moderateScale(theme.typography.fontSize.sm, 0.3),
    color: theme.colors.text.secondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(theme.spacing[2], 0.5),
    marginTop: verticalScale(2),
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(3, 0.3),
  },
  ratingText: {
    fontSize: moderateScale(theme.typography.fontSize.sm, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  reviewCount: {
    fontSize: moderateScale(theme.typography.fontSize.xs, 0.3),
    color: theme.colors.text.tertiary,
  },
  distance: {
    fontSize: moderateScale(theme.typography.fontSize.xs, 0.3),
    color: theme.colors.text.tertiary,
  },
  separator: {
    height: verticalScale(8),
  },
});
