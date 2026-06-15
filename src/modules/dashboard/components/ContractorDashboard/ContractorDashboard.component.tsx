import React from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import { useContractorDashboard } from "@/modules/dashboard/hooks/useDashboard";
import StatCard from "@/modules/dashboard/components/StatCard";
import RequestItem from "@/modules/dashboard/components/RequestItem";
import { styles } from "@/modules/dashboard/screens/styles";
import { useLocale, type LocaleKeys } from "@/shared/locales";

export function ContractorDashboardComponent() {
  const locale = useLocale<LocaleKeys>();
  const { data, isLoading, error } = useContractorDashboard();

  if (isLoading) return <ActivityIndicator style={styles.loader} />;
  if (error || !data)
    return (
      <Text style={styles.error}>
        {locale?.dashboard?.loadError ?? "dashboard.loadError"}
      </Text>
    );

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
    <ScrollView style={styles.container}>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {locale?.dashboard?.contractorTitle ?? "Solicitações Recentes"}
        </Text>
        {(data.activeRequests ?? []).length === 0 && (data.pendingRequests ?? []).length === 0 ? (
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
