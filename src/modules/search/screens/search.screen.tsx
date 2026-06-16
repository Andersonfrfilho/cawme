import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSearch } from "@/modules/search/hooks/useSearch";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { styles } from "./styles";
import { t } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { formatBRL } from "@/shared/utils/currency";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { apiClient } from "@/shared/services/api-client";
import type { SearchProviderItem } from "@/modules/search/types/search.types";

type CategoryItem = { id: string; name: string; slug: string };

const MAX_PRICE = 1000;

function RangeSlider({ min, max, onMinChange, onMaxChange }: {
  min: number;
  max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  const pctMin = (min / MAX_PRICE) * 100;
  const pctMax = ((max > 0 ? max : MAX_PRICE) / MAX_PRICE) * 100;

  return (
    <View style={{ paddingHorizontal: 4, marginTop: verticalScale(8) }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
        <Text style={{ fontSize: moderateScale(11, 0.3), color: theme.colors.text.secondary }}>
          R$ {min || 0}
        </Text>
        <Text style={{ fontSize: moderateScale(11, 0.3), color: theme.colors.text.secondary }}>
          R$ {max || MAX_PRICE}
        </Text>
      </View>
      <View style={{ height: 34, justifyContent: "center" }}>
        <View style={{ height: 6, backgroundColor: theme.colors.border.DEFAULT, borderRadius: 3 }}>
          <View style={{ position: "absolute", left: (pctMin + "%") as any, right: ((100 - pctMax) + "%") as any, height: 6, backgroundColor: theme.colors.primary.DEFAULT, borderRadius: 3 }} />
          <View style={{ position: "absolute", left: (pctMin + "%") as any, marginLeft: -10, top: -7, width: 20, height: 20, borderRadius: 10, backgroundColor: theme.colors.primary.DEFAULT, borderWidth: 2, borderColor: "#fff" }} />
          <View style={{ position: "absolute", left: (pctMax + "%") as any, marginLeft: -10, top: -7, width: 20, height: 20, borderRadius: 10, backgroundColor: theme.colors.primary.DEFAULT, borderWidth: 2, borderColor: "#fff" }} />
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
        <TextInput style={{ flex: 1, backgroundColor: theme.colors.background.card, borderWidth: 1, borderColor: theme.colors.border.DEFAULT, borderRadius: 8, paddingVertical: verticalScale(8), paddingHorizontal: 8, fontSize: moderateScale(13, 0.3), color: theme.colors.text.primary, textAlign: "center" }} placeholder="R$ mín" placeholderTextColor={theme.colors.text.tertiary} value={min > 0 ? String(min) : ""} onChangeText={(t) => onMinChange(Number(t) || 0)} keyboardType="numeric" />
        <Text style={{ alignSelf: "center", color: theme.colors.text.tertiary, fontSize: moderateScale(12, 0.3) }}>até</Text>
        <TextInput style={{ flex: 1, backgroundColor: theme.colors.background.card, borderWidth: 1, borderColor: theme.colors.border.DEFAULT, borderRadius: 8, paddingVertical: verticalScale(8), paddingHorizontal: 8, fontSize: moderateScale(13, 0.3), color: theme.colors.text.primary, textAlign: "center" }} placeholder="R$ máx" placeholderTextColor={theme.colors.text.tertiary} value={max > 0 ? String(max) : ""} onChangeText={(t) => onMaxChange(Number(t) || 0)} keyboardType="numeric" />
      </View>
    </View>
  );
}

const WEEK_DAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const PRICE_TYPE_LABEL: Record<string, string> = { HOUR: "/h", DAY: "/dia", FIXED: "" };

function formatNextAvailable(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dow = WEEK_DAYS_SHORT[date.getDay()];
  return `${dow}, ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
}

export default function SearchScreen() {
  const navigation = useNavigation();
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => isSignedIn ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(4, 0.5) }}>
          <TouchableOpacity onPress={() => router.push("/(app)/account/profile-edit" as any)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ marginRight: moderateScale(8, 0.5) }}>
            <Ionicons name="person-circle-outline" size={22} color={theme.colors.primary.DEFAULT} />
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ marginRight: 16 }}>
            <Ionicons name="log-out-outline" size={22} color={theme.colors.status.error} />
          </TouchableOpacity>
        </View>
      ) : undefined,
    });
  }, [navigation, isSignedIn]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);

  useEffect(() => {
    apiClient.get<{ data: CategoryItem[] }>("/bff/auth/categories", { _skipGlobalError: true })
      .then((r) => setCategories(r.data.data ?? []))
      .catch(() => {});
  }, []);

  const activeFilterCount = (availableOnly ? 1 : 0) + (minRating > 0 ? 1 : 0) + (city.trim() ? 1 : 0) + (state.trim() ? 1 : 0) + (selectedCategoryId ? 1 : 0);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useSearch({
    q: searchTerm || undefined,
    available: availableOnly || undefined,
    ratingMin: minRating > 0 ? minRating : undefined,
    city: city.trim() || undefined,
    state: state.trim().toUpperCase() || undefined,
    categoryId: selectedCategoryId || undefined,
    priceMin: priceMin > 0 ? priceMin : undefined,
    priceMax: priceMax > 0 ? priceMax : undefined,
  });

  const allItems = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  const handleSearch = () => {
    refetch();
  };

  const renderProvider = ({ item }: { item: SearchProviderItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/providers/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.cardMain}>
        <View style={styles.cardAvatar}>
          <Ionicons name="person" size={moderateScale(22, 0.3)} color={theme.colors.primary.DEFAULT} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={1}>{item.businessName}</Text>
          <View style={styles.cardRow}>
            <Ionicons name="star" size={moderateScale(13, 0.3)} color={theme.colors.accent.yellow} />
            <Text style={styles.cardRating}>{item.averageRating > 0 ? item.averageRating.toFixed(1) : "—"}</Text>
            <Text style={styles.cardReviews}>({item.reviewCount})</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="location-outline" size={moderateScale(13, 0.3)} color={theme.colors.text.tertiary} />
            <Text style={styles.cardLocation} numberOfLines={1}>{item.city}, {item.state}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.badge, item.isAvailable ? styles.badgeAvailable : styles.badgeUnavailable]}>
            <Text style={[styles.badgeText, item.isAvailable ? styles.badgeTextAvailable : styles.badgeTextUnavailable]}>
              {item.isAvailable ? "Disponível" : "Indisp."}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={moderateScale(18, 0.3)} color={theme.colors.text.tertiary} />
        </View>
      </View>

      {item.services.length > 0 && (
        <View style={styles.servicesRow}>
          {item.services.slice(0, 3).map((svc, i) => (
            <View key={i} style={styles.serviceChip}>
              <Text style={styles.serviceChipText} numberOfLines={1}>{svc.name}</Text>
              <Text style={styles.serviceChipPrice}>
                {formatBRL(svc.priceBase)}{PRICE_TYPE_LABEL[svc.priceType] ?? ""}
              </Text>
            </View>
          ))}
          {item.services.length > 3 && (
            <Text style={styles.serviceMore}>+{item.services.length - 3}</Text>
          )}
        </View>
      )}

      {item.nextAvailableDate && (
        <View style={styles.nextRow}>
          <Ionicons name="calendar-outline" size={moderateScale(12, 0.3)} color={theme.colors.text.secondary} />
          <Text style={styles.nextDate}>Próx: {formatNextAvailable(item.nextAvailableDate)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <ActivityIndicator style={{ padding: verticalScale(16) }} color={theme.colors.primary.DEFAULT} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={theme.colors.text.secondary} style={{ marginRight: moderateScale(8, 0.5) }} />
          <TextInput
            style={styles.input}
            placeholder="Buscar serviços ou prestadores..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchTerm(""); refetch(); }} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtersRow}>
        <View style={styles.filtersRowLeft}>
          <TouchableOpacity
            style={[styles.filterChip, availableOnly && styles.filterChipActive]}
            onPress={() => setAvailableOnly((v) => !v)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="checkmark-circle"
              size={moderateScale(14, 0.3)}
              color={availableOnly ? theme.colors.primary.DEFAULT : theme.colors.text.tertiary}
            />
            <Text style={[styles.filterChipText, availableOnly && styles.filterChipTextActive]}>
              Disponíveis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, minRating > 0 && styles.filterChipActive]}
            onPress={() => setShowFilters((v) => !v)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="options-outline"
              size={moderateScale(14, 0.3)}
              color={showFilters || activeFilterCount > 0 ? theme.colors.primary.DEFAULT : theme.colors.text.tertiary}
            />
            <Text style={[styles.filterChipText, (showFilters || activeFilterCount > 0) && styles.filterChipTextActive]}>
              Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersRowRight}>
          <Text style={styles.filterLabel}>Avaliação:</Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setMinRating(minRating === star ? 0 : star)}>
              <Ionicons
                name={star <= minRating ? "star" : "star-outline"}
                size={moderateScale(16, 0.3)}
                color={star <= minRating ? theme.colors.accent.yellow : theme.colors.text.tertiary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filtros avançados */}
      {showFilters && (
        <View style={styles.advancedFilters}>
          {categories.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: verticalScale(8) }}>
              {categories.map((cat) => {
                const selected = selectedCategoryId === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryChip, selected && styles.categoryChipActive]}
                    onPress={() => setSelectedCategoryId(selected ? null : cat.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.categoryChipText, selected && styles.categoryChipTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
          <View style={styles.cityFilterRow}>
            <Ionicons name="location-outline" size={moderateScale(16, 0.3)} color={theme.colors.text.secondary} />
            <TextInput
              style={styles.cityInput}
              placeholder="Cidade..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={city}
              onChangeText={setCity}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCorrect={false}
            />
            {city.length > 0 && (
              <TouchableOpacity onPress={() => { setCity(""); refetch(); }} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.cityFilterRow}>
            <Ionicons name="flag-outline" size={moderateScale(16, 0.3)} color={theme.colors.text.secondary} />
            <TextInput
              style={styles.cityInput}
              placeholder="Estado (UF)..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={state}
              onChangeText={(t) => setState(t.toUpperCase().slice(0, 2))}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="characters"
              maxLength={2}
              autoCorrect={false}
            />
            {state.length > 0 && (
              <TouchableOpacity onPress={() => { setState(""); refetch(); }} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
          <RangeSlider
            min={priceMin}
            max={priceMax}
            onMinChange={setPriceMin}
            onMaxChange={setPriceMax}
          />
        </View>
      )}

      {isLoading && !isFetchingNextPage && (
        <ActivityIndicator style={{ padding: verticalScale(40) }} size="large" color={theme.colors.primary.DEFAULT} />
      )}
      {isError && (
        <Text style={styles.errorText}>{t("search.loadError")}</Text>
      )}

      {!isLoading && !isError && (
        <FlatList
          data={allItems}
          keyExtractor={(item) => item.id}
          renderItem={renderProvider}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={56} color={theme.colors.text.secondary} />
              <Text style={styles.emptyText}>{t("search.noResults")}</Text>
              <Text style={styles.emptySubtext}>Busque por "eletricista", "faxina", "pintura"...</Text>
            </View>
          }
          contentContainerStyle={allItems.length === 0 ? styles.emptyContent : styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}
