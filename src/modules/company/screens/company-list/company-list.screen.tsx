import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import {
  CompanyService,
  type CompanyListItem,
} from "@/modules/company/services/company.service";

import { styles } from "./styles";

export default function CompanyListScreen() {
  const insets = useSafeAreaInsets();
  const { company } = useLocale<LocaleKeys>();
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setIsError(false);
      CompanyService.listMyCompanies()
        .then(setCompanies)
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false));
    }, []),
  );

  function handleNewCompany(): void {
    router.push("/(app)/company/create" as any);
  }

  function handleCardPress(companyId: string): void {
    router.push({ pathname: "/(app)/company/[id]" as any, params: { id: companyId } });
  }

  function renderItem({ item }: { item: CompanyListItem }) {
    const isActive = item.status === "ACTIVE";
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCardPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardIcon}>
          <Ionicons
            name="business-outline"
            size={moderateScale(22, 0.3)}
            color={theme.colors.primary.DEFAULT}
          />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.tradeName ?? item.companyName}
          </Text>
          <Text style={styles.cardDocument} numberOfLines={1}>
            {item.companyName}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <View style={isActive ? styles.badgeActive : styles.badgeInactive}>
            <Text style={isActive ? styles.badgeActiveText : styles.badgeInactiveText}>
              {isActive
                ? company.companyList.statusActive
                : company.companyList.statusInactive}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={moderateScale(16, 0.3)}
            color={theme.colors.text.tertiary}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{company.companyList.title}</Text>
        </View>
        <TouchableOpacity style={styles.newButton} onPress={handleNewCompany} activeOpacity={0.8}>
          <Ionicons name="add" size={moderateScale(16, 0.3)} color={theme.colors.primary.DEFAULT} />
          <Text style={styles.newButtonText}>{company.companyList.newButton}</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <ActivityIndicator
          style={{ paddingTop: verticalScale(40) }}
          size="large"
          color={theme.colors.primary.DEFAULT}
        />
      )}

      {!isLoading && isError && (
        <Text style={styles.errorText}>{company.companyList.loadError}</Text>
      )}

      {!isLoading && !isError && (
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={
            companies.length === 0
              ? { flex: 1 }
              : styles.listContent
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="business-outline"
                size={56}
                color={theme.colors.text.secondary}
              />
              <Text style={styles.emptyTitle}>{company.companyList.emptyTitle}</Text>
              <Text style={styles.emptySubtitle}>{company.companyList.emptySubtitle}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
