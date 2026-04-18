import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import {
  useContractorDashboard,
  useProviderDashboard,
} from "@/modules/dashboard/hooks/useDashboard";
import { Ionicons } from "@expo/vector-icons";
import { ServiceRequestSummary } from "@/modules/dashboard/types/dashboard.types";
import { styles } from "./styles";
import { t } from "@/shared/locales";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: any;
}) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color="#007AFF" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function RequestItem({ item }: { item: ServiceRequestSummary }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "#2ecc71";
      case "pending":
        return "#f1c40f";
      case "canceled":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  return (
    <View style={styles.requestItem}>
      <View>
        <Text style={styles.requestTitle}>{item.title}</Text>
        <Text style={styles.requestDate}>{item.date}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) },
        ]}
      >
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
    </View>
  );
}

function ContractorDashboard() {
  const { data, isLoading, error } = useContractorDashboard();

  if (isLoading) return <ActivityIndicator style={styles.loader} />;
  if (error || !data)
    return <Text style={styles.error}>{t("dashboard.loadError")}</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        {data.stats.map((s, i) => (
          <StatCard
            key={i}
            label={s.label}
            value={s.value}
            icon={s.icon as any}
          />
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t("dashboard.contractorTitle")}
        </Text>
        {data.recentRequests.map((item) => (
          <RequestItem key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

function ProviderDashboard() {
  const { data, isLoading, error } = useProviderDashboard();

  if (isLoading) return <ActivityIndicator style={styles.loader} />;
  if (error || !data)
    return <Text style={styles.error}>{t("dashboard.loadError")}</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        {data.stats.map((s, i) => (
          <StatCard
            key={i}
            label={s.label}
            value={s.value}
            icon={s.icon as any}
          />
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t("dashboard.providerActiveTitle")}
        </Text>
        {data.activeSchedule.map((item) => (
          <RequestItem key={item.id} item={item} />
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t("dashboard.providerPendingTitle")}
        </Text>
        {data.pendingRequests.map((item) => (
          <RequestItem key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>{t("dashboard.loginRequired")}</Text>
      </View>
    );
  }

  return user.type === "provider" ? (
    <ProviderDashboard />
  ) : (
    <ContractorDashboard />
  );
}
