import React from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import { useProviderDashboard } from "@/modules/dashboard/hooks/useDashboard";
import StatCard from "@/modules/dashboard/components/StatCard";
import RequestItem from "@/modules/dashboard/components/RequestItem";
import { styles } from "@/modules/dashboard/screens/styles";
import { useLocale, type LocaleKeys } from "@/shared/locales";

export function ProviderDashboardComponent() {
  const locale = useLocale<LocaleKeys>();
  const { data, isLoading, error } = useProviderDashboard();

  if (isLoading) return <ActivityIndicator style={styles.loader} />;
  if (error || !data)
    return (
      <Text style={styles.error}>
        {locale?.dashboard?.loadError ?? "dashboard.loadError"}
      </Text>
    );

  const stats = [
    {
      label: "Avaliação",
      value: data.averageRating > 0 ? data.averageRating.toFixed(1) : "—",
      icon: "star-outline",
    },
    {
      label: "Avaliações",
      value: String(data.reviewCount),
      icon: "chatbubble-outline",
    },
    {
      label: "Ativos",
      value: String(data.activeRequests?.length ?? 0),
      icon: "calendar-outline",
    },
    {
      label: "Pendentes",
      value: String(data.incomingRequests?.length ?? 0),
      icon: "time-outline",
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
          {locale?.dashboard?.providerActiveTitle ?? "Agenda Ativa"}
        </Text>
        {(data.activeRequests ?? []).length === 0 ? (
          <Text style={styles.emptyText}>Nenhum agendamento ativo.</Text>
        ) : (
          (data.activeRequests ?? []).map((request) => (
            <RequestItem key={request.id} item={request} />
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {locale?.dashboard?.providerPendingTitle ?? "Novas Solicitações"}
        </Text>
        {(data.incomingRequests ?? []).length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma solicitação pendente.</Text>
        ) : (
          (data.incomingRequests ?? []).map((request) => (
            <RequestItem key={request.id} item={request} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default ProviderDashboardComponent;
