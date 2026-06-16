import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, scale } from "@/shared/utils/scale";
import { formatBRL } from "@/shared/utils/currency";
import { useProviders } from "@/modules/providers/hooks/useProviders";
import type { ProviderListItem } from "@/modules/providers/types/providers.types";
import { styles } from "./styles";

const WEEK_DAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatNextAvailable(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dow = WEEK_DAYS_SHORT[date.getDay()];
  return `${dow}, ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
}

const PRICE_TYPE_LABEL: Record<string, string> = {
  HOUR: '/h',
  DAY: '/dia',
  FIXED: '',
};

export default function ProvidersScreen() {
  const { providers } = useLocale<LocaleKeys>();
  const { data, isLoading, isError, refetch, isRefetching } = useProviders();

  const renderProvider = ({ item }: { item: ProviderListItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/providers/${item.id}` as any)}
      activeOpacity={0.7}
      testID="provider-card"
      accessibilityLabel={item.businessName}
    >
      <View style={styles.cardMain}>
        <View style={styles.cardAvatar}>
          <Ionicons name="person" size={scale(28)} color={theme.colors.primary.DEFAULT} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardName}>{item.businessName}</Text>
          <View style={styles.cardRow}>
            <Ionicons name="star" size={moderateScale(14, 0.3)} color={theme.colors.accent.yellow} />
            <Text style={styles.cardRating}>{item.averageRating > 0 ? item.averageRating.toFixed(1) : "—"}</Text>
            <Text style={styles.cardReviews}>({item.reviewCount})</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="location-outline" size={moderateScale(14, 0.3)} color={theme.colors.text.tertiary} />
            <Text style={styles.cardLocation}>{item.city}, {item.state}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.badge, item.isAvailable ? styles.badgeAvailable : styles.badgeUnavailable]}>
            <Text style={[styles.badgeText, item.isAvailable ? styles.badgeTextAvailable : styles.badgeTextUnavailable]}>
              {item.isAvailable ? providers.available : providers.unavailable}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={moderateScale(18, 0.3)} color={theme.colors.text.tertiary} />
        </View>
      </View>

      {item.services.length > 0 && (
        <View style={styles.servicesRow}>
          {item.services.slice(0, 3).map((svc, i) => (
            <View key={i} style={styles.serviceChip}>
              <Text style={styles.serviceChipText} numberOfLines={1}>
                {svc.name}
              </Text>
              <Text style={styles.serviceChipPrice}>
                {formatBRL(svc.priceBase)}{PRICE_TYPE_LABEL[svc.priceType] ?? ''}
              </Text>
            </View>
          ))}
          {item.services.length > 3 && (
            <Text style={styles.serviceMore}>+{item.services.length - 3}</Text>
          )}
        </View>
      )}

      {item.nextAvailableDate ? (
        <View style={styles.nextAvailableRow}>
          <Ionicons name="calendar-outline" size={moderateScale(13, 0.3)} color={theme.colors.text.secondary} />
          <Text style={styles.nextAvailableDate}>{formatNextAvailable(item.nextAvailableDate)}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{providers.loadError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderProvider}
        contentContainerStyle={data?.length === 0 ? styles.centeredList : styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.colors.primary.DEFAULT]}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>{providers.empty}</Text>
        }
      />
    </View>
  );
}
