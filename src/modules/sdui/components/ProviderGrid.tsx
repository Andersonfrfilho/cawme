import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SduiComponentProps } from '@/modules/sdui/types/sdui.types';
import { styles as sduiStyles } from './styles';
import { theme } from '@/shared/constants';
import { moderateScale, verticalScale } from '@/shared/utils/scale';
import { formatBRL } from '@/shared/utils/currency';

const WEEK_DAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatNextDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return `${WEEK_DAYS_SHORT[date.getDay()]}, ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
}

interface PaymentMethod {
  id: string;
  name: string;
  label: string;
  icon: string | null;
}

interface ProviderService {
  name: string;
  priceBase?: number;
  priceType?: string;
}

interface Provider {
  id: string;
  name?: string;
  businessName?: string;
  title?: string;
  displayName?: string;
  rating?: number;
  averageRating?: number;
  reviewCount?: number;
  avatarUrl?: string | null;
  imageUrl?: string;
  city?: string;
  state?: string;
  isAvailable?: boolean;
  nextAvailableDate?: string | null;
  services?: ProviderService[];
  paymentMethods?: PaymentMethod[];
}

interface ProviderGridConfig {
  columns?: number;
  title?: string;
  searchTerm?: string;
  activeFilter?: string | null;
}

export default function ProviderGrid({ data, config, onItemPress }: SduiComponentProps) {
  const gridConfig: ProviderGridConfig = config || {};
  const numColumns = gridConfig.columns || 2;

  const term = gridConfig.searchTerm?.trim().toLowerCase() ?? '';
  const SORT_FILTERS = new Set(['top_rated', 'location']);

  const filtered: Provider[] = (data || []).filter((item: Provider) => {
    const categoryFilter =
      gridConfig.activeFilter && !SORT_FILTERS.has(gridConfig.activeFilter)
        ? gridConfig.activeFilter.toLowerCase()
        : null;

    if (categoryFilter) {
      const serviceNames = (item.services || []).map((s) => s.name.toLowerCase());
      if (!serviceNames.some((s) => s.includes(categoryFilter))) return false;
    }

    if (!term) return true;
    const name = (item.name || item.businessName || item.title || item.displayName || '').toLowerCase();
    const service = (item.services?.[0]?.name || '').toLowerCase();
    const location = (item.city || '').toLowerCase();
    return name.includes(term) || service.includes(term) || location.includes(term);
  });

  const providers: Provider[] = gridConfig.activeFilter === 'top_rated'
    ? [...filtered].sort((a, b) => (b.averageRating ?? b.rating ?? 0) - (a.averageRating ?? a.rating ?? 0))
    : filtered;

  const renderProvider = ({ item }: { item: Provider }) => {
    const displayName = item.name || item.businessName || item.title || item.displayName || 'Profissional';
    const rating = item.averageRating ?? item.rating ?? 0;
    const reviewCount = item.reviewCount ?? 0;
    const imageUrl = item.avatarUrl || item.imageUrl;
    const location = item.city && item.state ? `${item.city}, ${item.state}` : item.city ?? null;
    const services = item.services ?? [];

    return (
      <TouchableOpacity
        style={[cardStyles.card, { flex: 1 / numColumns }]}
        onPress={() => onItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={cardStyles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={cardStyles.image} resizeMode="cover" />
          ) : (
            <View style={cardStyles.imagePlaceholder}>
              <Ionicons name="person-circle-outline" size={40} color={theme.colors.primary.light} />
            </View>
          )}
          <View style={[cardStyles.availBadge, item.isAvailable ? cardStyles.availBadgeOn : cardStyles.availBadgeOff]}>
            <Text style={[cardStyles.availBadgeText, item.isAvailable ? cardStyles.availBadgeTextOn : cardStyles.availBadgeTextOff]}>
              {item.isAvailable ? 'Disponível' : 'Indisp.'}
            </Text>
          </View>
        </View>

        <View style={cardStyles.content}>
          <Text style={cardStyles.name} numberOfLines={1}>{displayName}</Text>

          <View style={cardStyles.row}>
            <Ionicons name="star" size={moderateScale(12, 0.3)} color={theme.colors.accent.yellow} />
            <Text style={cardStyles.rating}>{rating > 0 ? Number(rating).toFixed(1) : '—'}</Text>
            <Text style={cardStyles.reviews}>({reviewCount})</Text>
          </View>

          {location && (
            <View style={cardStyles.row}>
              <Ionicons name="location-outline" size={moderateScale(11, 0.3)} color={theme.colors.text.tertiary} />
              <Text style={cardStyles.location} numberOfLines={1}>{location}</Text>
            </View>
          )}

          {services.length > 0 && (
            <View style={cardStyles.servicesRow}>
              {services.slice(0, 2).map((svc, i) => (
                <View key={i} style={cardStyles.serviceChip}>
                  <Text style={cardStyles.serviceChipName} numberOfLines={1}>{svc.name}</Text>
                  {svc.priceBase != null && svc.priceBase > 0 && (
                    <Text style={cardStyles.serviceChipPrice}>{formatBRL(svc.priceBase)}</Text>
                  )}
                </View>
              ))}
              {services.length > 2 && (
                <Text style={cardStyles.serviceMore}>+{services.length - 2}</Text>
              )}
            </View>
          )}

          {item.nextAvailableDate && (
            <View style={cardStyles.row}>
              <Ionicons name="calendar-outline" size={moderateScale(10, 0.3)} color={theme.colors.primary.DEFAULT} />
              <Text style={cardStyles.nextDate}>{formatNextDate(item.nextAvailableDate)}</Text>
            </View>
          )}

          {item.paymentMethods && item.paymentMethods.length > 0 && (
            <View style={cardStyles.paymentRow}>
              {item.paymentMethods.slice(0, 2).map((pm) => (
                <View key={pm.id} style={cardStyles.paymentChip}>
                  <Text style={cardStyles.paymentChipText} numberOfLines={1}>{pm.label}</Text>
                </View>
              ))}
              {item.paymentMethods.length > 2 && (
                <Text style={cardStyles.paymentMore}>+{item.paymentMethods.length - 2}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (providers.length === 0) {
    return (
      <View style={sduiStyles.sectionContainer}>
        {gridConfig.title && <Text style={sduiStyles.sectionTitle}>{gridConfig.title}</Text>}
        <View style={[sduiStyles.providerImagePlaceholder, { height: verticalScale(80) }]}>
          <Ionicons name="people-outline" size={40} color={theme.colors.text.secondary} />
          <Text style={sduiStyles.providerName}>Nenhum profissional disponível</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={sduiStyles.sectionContainer}>
      {gridConfig.title && <Text style={sduiStyles.sectionTitle}>{gridConfig.title}</Text>}
      <FlatList
        key={`grid-${numColumns}`}
        data={providers}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={sduiStyles.providerGridContent}
        columnWrapperStyle={numColumns > 1 ? sduiStyles.providerGridRow : undefined}
        scrollEnabled={false}
      />
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    marginRight: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.palette.neutral[300],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: moderateScale(110, 0.5),
    backgroundColor: theme.palette.neutral[100],
  },
  imagePlaceholder: {
    width: '100%',
    height: moderateScale(110, 0.5),
    backgroundColor: theme.palette.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  availBadge: {
    position: 'absolute',
    top: verticalScale(6),
    right: moderateScale(6, 0.5),
    paddingHorizontal: moderateScale(6, 0.5),
    paddingVertical: verticalScale(2),
    borderRadius: 20,
  },
  availBadgeOn: { backgroundColor: '#DCFCE7' },
  availBadgeOff: { backgroundColor: 'rgba(0,0,0,0.35)' },
  availBadgeText: { fontSize: moderateScale(9, 0.3), fontWeight: theme.typography.fontWeight.semibold },
  availBadgeTextOn: { color: '#15803D' },
  availBadgeTextOff: { color: '#fff' },
  content: {
    padding: theme.spacing[3],
    gap: verticalScale(3),
  },
  name: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(3, 0.3),
  },
  rating: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  reviews: {
    fontSize: moderateScale(10, 0.3),
    color: theme.colors.text.secondary,
  },
  location: {
    fontSize: moderateScale(10, 0.3),
    color: theme.colors.text.tertiary,
    flex: 1,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(3, 0.3),
    marginTop: verticalScale(2),
  },
  serviceChip: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 6,
    paddingHorizontal: moderateScale(5, 0.5),
    paddingVertical: verticalScale(2),
    maxWidth: '48%',
  },
  serviceChipName: {
    fontSize: moderateScale(9, 0.3),
    color: theme.colors.text.secondary,
  },
  serviceChipPrice: {
    fontSize: moderateScale(9, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.DEFAULT,
  },
  serviceMore: {
    fontSize: moderateScale(9, 0.3),
    color: theme.colors.text.tertiary,
    alignSelf: 'center',
  },
  nextDate: {
    fontSize: moderateScale(9, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.medium,
  },
  paymentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(3, 0.3),
    marginTop: verticalScale(2),
  },
  paymentChip: {
    paddingHorizontal: moderateScale(5, 0.5),
    paddingVertical: verticalScale(2),
    borderRadius: 4,
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  paymentChipText: {
    fontSize: moderateScale(9, 0.3),
    color: theme.colors.text.secondary,
  },
  paymentMore: {
    fontSize: moderateScale(9, 0.3),
    color: theme.colors.text.tertiary,
    alignSelf: 'center',
  },
});
