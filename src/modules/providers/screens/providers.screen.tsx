import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, scale } from "@/shared/utils/scale";
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
      <View style={styles.cardAvatar}>
        <Ionicons name="person" size={scale(28)} color={theme.colors.primary.DEFAULT} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName} testID="provider-card-name">{item.businessName}</Text>
        <View style={styles.cardRow}>
          <Ionicons name="star" size={moderateScale(14, 0.3)} color={theme.colors.accent.yellow} />
          <Text style={styles.cardRating}>{item.averageRating.toFixed(1)}</Text>
          <Text style={styles.cardReviews}>({item.reviewCount})</Text>
          {item.city ? (
            <>
              <Ionicons
                name="location-outline"
                size={moderateScale(14, 0.3)}
                color={theme.colors.text.tertiary}
                style={{ marginLeft: moderateScale(8, 0.5) }}
              />
              <Text style={styles.cardLocation}>{item.city}, {item.state}</Text>
            </>
          ) : null}
        </View>
        <View style={[styles.badge, item.isAvailable ? styles.badgeAvailable : styles.badgeUnavailable]}>
          <Text style={[styles.badgeText, item.isAvailable ? styles.badgeTextAvailable : styles.badgeTextUnavailable]}>
            {item.isAvailable ? providers.available : providers.unavailable}
          </Text>
        </View>
        {item.nextAvailableDate ? (
          <View style={styles.nextAvailableRow}>
            <Text style={styles.nextAvailableLabel}>{providers.nextAvailable}</Text>
            <Text style={styles.nextAvailableDate}>{formatNextAvailable(item.nextAvailableDate)}</Text>
          </View>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={moderateScale(20, 0.3)} color={theme.colors.text.tertiary} />
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
