import React from "react";
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContractorDashboard } from "@/modules/dashboard/hooks/useDashboard";
import StatCard from "@/modules/dashboard/components/StatCard";
import RequestItem from "@/modules/dashboard/components/RequestItem";
import { styles } from "@/modules/dashboard/screens/styles";
import { useLocale, type LocaleKeys } from "@/shared/locales";
import { useLoading } from "@/shared/hooks/useLoading";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export function ContractorDashboardComponent() {
  const locale = useLocale<LocaleKeys>();
  const { data, isLoading, isRefetching, error, refetch } = useContractorDashboard();
  const { showLoading } = useLoading();

  if (isLoading) return <ActivityIndicator style={styles.loader} />;
  if (error || !data)
    return (
      <Text style={styles.error}>
        {locale?.dashboard?.loadError ?? "dashboard.loadError"}
      </Text>
    );

  const hasRequests = (data.activeRequests?.length ?? 0) > 0 || (data.pendingRequests?.length ?? 0) > 0;

  const stats = [
    {
      label: "Ativos",
      value: String(data.activeRequests?.length ?? 0),
      icon: "calendar-outline",
    },
    {
      label: "Pendentes",
      value: String(data.pendingRequests?.length ?? 0),
      icon: "time-outline",
    },
    {
      label: "Histórico",
      value: String(data.recentHistory?.length ?? 0),
      icon: "checkmark-circle-outline",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={[theme.colors.primary.DEFAULT]}
          tintColor={theme.colors.primary.DEFAULT}
        />
      }
    >
      <View style={styles.statsContainer}>
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon as any}
          />
        ))}
      </View>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: theme.spacing[6],
          marginBottom: theme.spacing[4],
          paddingVertical: verticalScale(12),
          paddingHorizontal: moderateScale(16, 0.5),
          backgroundColor: theme.colors.primary.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.colors.primary.DEFAULT + "30",
        }}
        onPress={() => { showLoading(); router.push("/(app)/service-requests" as any); }}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="list-outline" size={moderateScale(20, 0.3)} color={theme.colors.primary.DEFAULT} />
          <Text style={{
            fontSize: moderateScale(14, 0.3),
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.primary.DEFAULT,
          }}>
            Minhas solicitações
          </Text>
        </View>
        {hasRequests && (
          <View style={{
            backgroundColor: theme.colors.primary.DEFAULT,
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}>
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>
              {(data.activeRequests?.length ?? 0) + (data.pendingRequests?.length ?? 0)}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {locale?.dashboard?.contractorTitle ?? "Solicitações Recentes"}
        </Text>
        {!hasRequests ? (
          <Text style={styles.emptyText}>Nenhuma solicitação no momento.</Text>
        ) : (
          [...(data.activeRequests ?? []), ...(data.pendingRequests ?? [])].map((request) => (
            <RequestItem key={request.id} item={request} />
          ))
        )}
      </View>

      {(data.recentHistory ?? []).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico Recente</Text>
          {(data.recentHistory ?? []).map((request) => (
            <RequestItem key={request.id} item={request} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

export default ContractorDashboardComponent;
