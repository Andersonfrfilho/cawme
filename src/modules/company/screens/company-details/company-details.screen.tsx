import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, scale, verticalScale } from "@/shared/utils/scale";
import {
  CompanyService,
  type CompanyDetails,
  type CompanyMember,
  type CompanyProvider,
} from "@/modules/company/services/company.service";

import { styles } from "./styles";

type CompanyDetailsScreenParams = {
  id: string;
};

function StatusBadge({ status, activeLabel, inactiveLabel }: { status: string; activeLabel: string; inactiveLabel: string }) {
  const isActive = status === "ACTIVE";
  return (
    <View style={isActive ? styles.badgeActive : styles.badgeInactive}>
      <Text style={isActive ? styles.badgeActiveText : styles.badgeInactiveText}>
        {isActive ? activeLabel : inactiveLabel}
      </Text>
    </View>
  );
}

export default function CompanyDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { company } = useLocale<LocaleKeys>();
  const { id } = useLocalSearchParams<CompanyDetailsScreenParams>();
  const [details, setDetails] = useState<CompanyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      setIsLoading(true);
      setIsError(false);
      CompanyService.getCompanyDetails(id)
        .then(setDetails)
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false));
    }, [id]),
  );

  function handleAddProvider(): void {
    router.push({ pathname: "/(app)/company/[id]/add-provider" as any, params: { id } });
  }

  const displayName = details?.tradeName ?? details?.companyName ?? company.companyDetails.title;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(24) }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {displayName}
          </Text>
          {details?.tradeName && details.tradeName !== details.companyName && (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {details.companyName}
            </Text>
          )}
        </View>
      </View>

      {isLoading && (
        <ActivityIndicator
          style={{ paddingTop: verticalScale(40) }}
          size="large"
          color={theme.colors.primary.DEFAULT}
        />
      )}

      {!isLoading && isError && (
        <Text style={styles.errorText}>{company.companyDetails.loadError}</Text>
      )}

      {!isLoading && !isError && details && (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Informações de contato */}
          <View style={styles.infoCard}>
            {details.emails.length > 0 && (
              <View style={styles.infoRow}>
                <Ionicons
                  name="mail-outline"
                  size={moderateScale(16, 0.3)}
                  color={theme.colors.text.secondary}
                />
                <Text style={styles.infoText} numberOfLines={1}>
                  {details.emails.find((e) => e.isDefault)?.email ?? details.emails[0].email}
                </Text>
              </View>
            )}
            {details.phones.length > 0 && (
              <View style={styles.infoRow}>
                <Ionicons
                  name="call-outline"
                  size={moderateScale(16, 0.3)}
                  color={theme.colors.text.secondary}
                />
                <Text style={styles.infoText} numberOfLines={1}>
                  {details.phones.find((p) => p.isDefault)?.phone ?? details.phones[0].phone}
                </Text>
              </View>
            )}
            {details.addresses.length > 0 && (() => {
              const address = details.addresses.find((a) => a.isDefault) ?? details.addresses[0];
              return (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="location-outline"
                    size={moderateScale(16, 0.3)}
                    color={theme.colors.text.secondary}
                  />
                  <Text style={styles.infoText} numberOfLines={2}>
                    {`${address.street}, ${address.city}/${address.state}`}
                  </Text>
                </View>
              );
            })()}
          </View>

          {/* Providers Vinculados */}
          <View style={{ gap: moderateScale(10, 0.5) }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{company.companyDetails.providersSection}</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddProvider} activeOpacity={0.8}>
                <Ionicons name="add" size={moderateScale(14, 0.3)} color={theme.palette.neutral[0]} />
                <Text style={styles.addButtonText}>{company.companyDetails.addProviderButton}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.listCard}>
              {details.providers.length === 0 ? (
                <Text style={styles.emptyText}>{company.companyDetails.noProviders}</Text>
              ) : (
                details.providers.map((provider: CompanyProvider, index: number) => (
                  <View key={provider.id}>
                    {index > 0 && <View style={styles.listItemSeparator} />}
                    <View style={styles.listItem}>
                      <View style={styles.listItemIcon}>
                        <Ionicons
                          name="person-outline"
                          size={moderateScale(16, 0.3)}
                          color={theme.colors.primary.DEFAULT}
                        />
                      </View>
                      <View style={styles.listItemBody}>
                        <Text style={styles.listItemTitle} numberOfLines={1}>
                          {provider.providerId.slice(0, 8)}...
                        </Text>
                        <Text style={styles.listItemSubtitle}>
                          {provider.role === "ADMIN"
                            ? company.companyDetails.roleAdmin
                            : company.companyDetails.roleMember}
                        </Text>
                      </View>
                      <StatusBadge
                        status={provider.status}
                        activeLabel={company.companyDetails.statusActive}
                        inactiveLabel={company.companyDetails.statusInactive}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Membros */}
          <View style={{ gap: moderateScale(10, 0.5) }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{company.companyDetails.membersSection}</Text>
            </View>
            <View style={styles.listCard}>
              {details.members.length === 0 ? (
                <Text style={styles.emptyText}>{company.companyDetails.noMembers}</Text>
              ) : (
                details.members.map((member: CompanyMember, index: number) => (
                  <View key={member.id}>
                    {index > 0 && <View style={styles.listItemSeparator} />}
                    <View style={styles.listItem}>
                      <View style={styles.listItemIcon}>
                        <Ionicons
                          name="person-circle-outline"
                          size={moderateScale(16, 0.3)}
                          color={theme.colors.primary.DEFAULT}
                        />
                      </View>
                      <View style={styles.listItemBody}>
                        <Text style={styles.listItemTitle} numberOfLines={1}>
                          {member.userId.slice(0, 8)}...
                        </Text>
                        <Text style={styles.listItemSubtitle}>
                          {member.role === "ADMIN"
                            ? company.companyDetails.roleAdmin
                            : company.companyDetails.roleMember}
                        </Text>
                      </View>
                      <StatusBadge
                        status={member.status}
                        activeLabel={company.companyDetails.statusActive}
                        inactiveLabel={company.companyDetails.statusInactive}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
