import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { apiClient } from "@/shared/services/api-client";
import { CompanyService } from "@/modules/company/services/company.service";
import type { SearchProviderItem } from "@/modules/search/types/search.types";

import { styles } from "./styles";

type CompanyAddProviderScreenParams = {
  id: string;
};

export default function CompanyAddProviderScreen() {
  const insets = useSafeAreaInsets();
  const { company } = useLocale<LocaleKeys>();
  const { id: companyId } = useLocalSearchParams<CompanyAddProviderScreenParams>();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchProviderItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setIsSearching(true);
      apiClient
        .get<{ data: SearchProviderItem[] }>("/bff/search", {
          params: { q: trimmed, limit: 20 },
          _skipGlobalError: true,
        } as any)
        .then((response) => setResults(response.data.data ?? []))
        .catch(() => setResults([]))
        .finally(() => setIsSearching(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  function handleLinkProvider(provider: SearchProviderItem): void {
    Alert.alert(
      company.companyAddProvider.confirmTitle,
      `${company.companyAddProvider.confirmMessage}\n\n${provider.businessName}`,
      [
        { text: company.companyAddProvider.cancelButton, style: "cancel" },
        {
          text: company.companyAddProvider.confirmButton,
          style: "default",
          onPress: () => confirmLink(provider.id),
        },
      ],
    );
  }

  async function confirmLink(providerId: string): Promise<void> {
    if (!companyId) return;
    setIsLinking(true);
    try {
      await CompanyService.addCompanyProvider({ companyId, providerId });
      Alert.alert("", company.companyAddProvider.successMessage, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("", company.companyAddProvider.errorMessage);
    } finally {
      setIsLinking(false);
    }
  }

  function renderItem({ item }: { item: SearchProviderItem }) {
    const serviceNames = item.services
      .slice(0, 2)
      .map((s) => s.name)
      .join(", ");
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleLinkProvider(item)}
        activeOpacity={0.7}
        disabled={isLinking}
      >
        <View style={styles.cardAvatar}>
          <Ionicons
            name="person-outline"
            size={moderateScale(20, 0.3)}
            color={theme.colors.primary.DEFAULT}
          />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.businessName}
          </Text>
          {serviceNames.length > 0 && (
            <Text style={styles.cardServices} numberOfLines={1}>
              {serviceNames}
              {item.services.length > 2 ? ` +${item.services.length - 2}` : ""}
            </Text>
          )}
          <Text style={styles.cardLocation} numberOfLines={1}>
            {item.city}, {item.state}
          </Text>
        </View>
        <Ionicons
          name="add-circle-outline"
          size={moderateScale(22, 0.3)}
          color={theme.colors.primary.DEFAULT}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{company.companyAddProvider.title}</Text>
        </View>
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={moderateScale(18, 0.3)}
            color={theme.colors.text.secondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={company.companyAddProvider.searchPlaceholder}
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCorrect={false}
            autoFocus
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")} hitSlop={8}>
              <Ionicons
                name="close-circle"
                size={moderateScale(18, 0.3)}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {(isSearching || isLinking) && (
        <ActivityIndicator
          style={{ paddingTop: verticalScale(24) }}
          color={theme.colors.primary.DEFAULT}
        />
      )}

      {!isSearching && !isLinking && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={
            results.length === 0 && searchTerm.trim().length >= 2
              ? { flex: 1 }
              : styles.listContent
          }
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            searchTerm.trim().length >= 2 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={theme.colors.text.secondary}
                />
                <Text style={styles.emptyText}>{company.companyAddProvider.noResults}</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
