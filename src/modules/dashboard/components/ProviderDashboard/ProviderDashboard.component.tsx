import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useProviderDashboard } from "@/modules/dashboard/hooks/useDashboard";
import { AccountService, type ProviderPaymentMethod } from "@/modules/account/services/account.service";
import StatCard from "@/modules/dashboard/components/StatCard";
import RequestItem from "@/modules/dashboard/components/RequestItem";
import { styles } from "@/modules/dashboard/screens/styles";
import { useLocale, type LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { useServiceRequests } from "@/modules/service-requests/hooks/useServiceRequests";
import { useLoading } from "@/shared/hooks/useLoading";

export function ProviderDashboardComponent() {
  const locale = useLocale<LocaleKeys>();
  const { data, isLoading, error, refetch } = useProviderDashboard();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const { showLoading } = useLoading();
  const { acceptRequest, rejectRequest, completeRequest } = useServiceRequests();
  const [providerPaymentMethods, setProviderPaymentMethods] = useState<ProviderPaymentMethod[]>([]);
  const [hasCheckedPaymentMethods, setHasCheckedPaymentMethods] = useState(false);

  useEffect(() => {
    AccountService.listProviderPaymentMethods()
      .then(setProviderPaymentMethods)
      .catch(() => setProviderPaymentMethods([]))
      .finally(() => setHasCheckedPaymentMethods(true));
  }, []);

  const showPaymentMethodsBanner =
    hasCheckedPaymentMethods && providerPaymentMethods.length === 0;

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
    <ScrollView
      style={[styles.container, { paddingTop: theme.spacing[4] }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary.DEFAULT]}
          tintColor={theme.colors.primary.DEFAULT}
        />
      }
    >
      {showPaymentMethodsBanner && (
        <TouchableOpacity
          onPress={() => router.push("/(app)/account/provider-payment-methods" as any)}
          activeOpacity={0.9}
          style={{
            backgroundColor: theme.colors.status.warning + "15",
            marginHorizontal: theme.spacing[6],
            marginTop: theme.spacing[4],
            marginBottom: theme.spacing[2],
            borderRadius: 12,
            padding: theme.spacing[4],
            flexDirection: "row",
            alignItems: "center",
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.status.warning,
          }}
        >
          <Ionicons
            name="card-outline"
            size={moderateScale(24, 0.3)}
            color={theme.colors.status.warning}
            style={{ marginRight: theme.spacing[3] }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: moderateScale(13, 0.3),
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
              }}
            >
              Cadastre suas formas de pagamento
            </Text>
            <Text
              style={{
                fontSize: moderateScale(12, 0.3),
                color: theme.colors.text.secondary,
                marginTop: 2,
              }}
            >
              Sem isso você não aparece nas buscas
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={moderateScale(18, 0.3)}
            color={theme.colors.primary.DEFAULT}
          />
        </TouchableOpacity>
      )}

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
            Ver todas as solicitações
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={moderateScale(18, 0.3)} color={theme.colors.primary.DEFAULT} />
      </TouchableOpacity>

      <View style={styles.section}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: theme.spacing[3] }}>
          <View style={{ width: 4, height: 22, backgroundColor: theme.colors.primary.DEFAULT, borderRadius: 2, marginRight: theme.spacing[2] }} />
          <Text style={styles.sectionTitle}>
            {locale?.dashboard?.providerActiveTitle ?? "Agenda Ativa"}
          </Text>
          {(data.activeRequests?.length ?? 0) > 0 && (
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{data.activeRequests?.length ?? 0}</Text>
            </View>
          )}
        </View>
        {(data.activeRequests ?? []).length === 0 ? (
          <Text style={styles.emptyText}>Nenhum agendamento ativo.</Text>
        ) : (
          (data.activeRequests ?? []).map((request) => (
            <RequestItem key={request.id} item={request} onComplete={(id) => completeRequest(id).then(() => refetch())} />
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: theme.spacing[3] }}>
          <View style={{ width: 4, height: 22, backgroundColor: theme.colors.accent.yellow, borderRadius: 2, marginRight: theme.spacing[2] }} />
          <Text style={styles.sectionTitle}>
            {locale?.dashboard?.providerPendingTitle ?? "Novas Solicitações"}
          </Text>
          {(data.incomingRequests ?? []).length > 0 && (
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{data.incomingRequests?.length ?? 0}</Text>
            </View>
          )}
        </View>
        {(data.incomingRequests ?? []).length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma solicitação pendente.</Text>
        ) : (
          (data.incomingRequests ?? []).map((request) => (
            <RequestItem
              key={request.id}
              item={request}
              onAccept={(id) => acceptRequest(id).then(() => refetch())}
              onReject={(id) => rejectRequest(id).then(() => refetch())}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default ProviderDashboardComponent;
