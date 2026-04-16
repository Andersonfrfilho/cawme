import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { useContractorDashboard, useProviderDashboard } from '@/hooks/useDashboard';
import { Ionicons } from '@expo/vector-icons';
import { ServiceRequestSummary } from '@/types/bff/dashboard.types';

function StatCard({ label, value, icon }: { label: string, value: string | number, icon: any }) {
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
      case 'accepted': return '#2ecc71';
      case 'pending': return '#f1c40f';
      case 'canceled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <View style={styles.requestItem}>
      <View>
        <Text style={styles.requestTitle}>{item.title}</Text>
        <Text style={styles.requestDate}>{item.date}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
    </View>
  );
}

function ContractorDashboard() {
  const { data, isLoading, error } = useContractorDashboard();

  if (isLoading) return <ActivityIndicator style={{ marginTop: 50 }} />;
  if (error || !data) return <Text style={styles.error}>Erro ao carregar dashboard.</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        {data.stats.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} icon={s.icon as any} />
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Solicitações Recentes</Text>
        {data.recentRequests.map(item => (
          <RequestItem key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

function ProviderDashboard() {
  const { data, isLoading, error } = useProviderDashboard();

  if (isLoading) return <ActivityIndicator style={{ marginTop: 50 }} />;
  if (error || !data) return <Text style={styles.error}>Erro ao carregar dashboard.</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        {data.stats.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} icon={s.icon as any} />
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agenda Ativa</Text>
        {data.activeSchedule.map(item => (
          <RequestItem key={item.id} item={item} />
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Novas Solicitações</Text>
        {data.pendingRequests.map(item => (
          <RequestItem key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);

  // Fallback se não estiver logado
  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>Você precisa estar logado para ver o dashboard.</Text>
      </View>
    );
  }

  return user.type === 'provider' ? <ProviderDashboard /> : <ContractorDashboard />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  requestItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  requestDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
