import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/modules/dashboard/services/dashboard.service';
import { isTestEnvironment } from '@/shared/utils/test-environment';
import type { ServiceRequestSummary } from '@/modules/dashboard/types/dashboard.types';

const mockRequest: ServiceRequestSummary = {
  id: '1',
  title: 'Limpeza Completa',
  status: 'PENDING',
  date: '30/05/2026 09:00',
  priceFinal: 150,
  serviceName: 'Limpeza Completa',
  contractorName: 'Anderson Filho',
  paymentMethod: 'Pix',
  scheduledAt: '2026-05-30T12:00:00Z',
  createdAt: '2026-05-29T10:00:00Z',
  description: 'Preciso de limpeza completa no apartamento.',
  address: {
    street: 'Rua das Flores',
    number: '123',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Jardins',
  },
};

export function useContractorDashboard() {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ['dashboard', 'contractor'],
    queryFn: async () => {
      if (isTestEnvironment()) {
        return {
          activeRequests: [{ ...mockRequest, status: 'ACCEPTED' as const }],
          pendingRequests: [{ ...mockRequest, status: 'PENDING' as const }],
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
  const query = useQuery({
    queryKey: ['dashboard', 'provider'],
    queryFn: async () => {
      if (isTestEnvironment()) {
        return {
          incomingRequests: [{ ...mockRequest, status: 'PENDING' as const }],
          activeRequests: [{ ...mockRequest, status: 'ACCEPTED' as const }],
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
  return { data: query.data, isLoading: query.isLoading || query.isPending, error: query.error, refetch: () => query.refetch() };
}
