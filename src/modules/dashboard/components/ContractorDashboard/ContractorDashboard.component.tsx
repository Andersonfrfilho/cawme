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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        {data.stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon as any}
          />
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {locale?.dashboard?.contractorTitle ?? "dashboard.contractorTitle"}
        </Text>
        {data.recentRequests.map((request) => (
          <RequestItem key={request.id} item={request} />
        ))}
      </View>
    </ScrollView>
  );
}

export default ContractorDashboardComponent;
