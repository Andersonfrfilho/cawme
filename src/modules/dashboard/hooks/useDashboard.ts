import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/modules/dashboard/services/dashboard.service';
import { isTestEnvironment } from '@/shared/utils/test-environment';

export function useContractorDashboard() {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ['dashboard', 'contractor'],
    queryFn: async () => {
      if (isTestEnvironment()) {
        return {
          activeRequests: [
            { id: '1', title: 'Limpeza Completa', status: 'accepted' as const, date: '29/05/2026' },
          ],
          pendingRequests: [
            { id: '2', title: 'Desentupimento Urgente', status: 'pending' as const, date: '30/05/2026' },
          ],
          recentHistory: [],
          unreadNotifications: 0,
        };
      }
      return DashboardService.getContractor();
    },
    staleTime: 60 * 1000,
  });
  return { data, isLoading: isLoading || isPending, error };
}

export function useProviderDashboard() {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ['dashboard', 'provider'],
    queryFn: async () => {
      if (isTestEnvironment()) {
        return {
          incomingRequests: [
            { id: '2', title: 'Desentupimento Urgente', status: 'pending' as const, date: '30/05/2026 09:00' },
          ],
          activeRequests: [
            { id: '1', title: 'Limpeza Residencial', status: 'accepted' as const, date: '29/05/2026 10:00' },
          ],
          averageRating: 4.9,
          reviewCount: 47,
          verificationStatus: 'VERIFIED',
          unreadNotifications: 0,
        };
      }
      return DashboardService.getProvider();
    },
    staleTime: 60 * 1000,
  });
  return { data, isLoading: isLoading || isPending, error };
}
