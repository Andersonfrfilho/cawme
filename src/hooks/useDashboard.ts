import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/services/api/dashboard.service';

export function useContractorDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'contractor'],
    queryFn: DashboardService.getContractor,
    staleTime: 60 * 1000, // 1min conforme SPEC
  });
}

export function useProviderDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'provider'],
    queryFn: DashboardService.getProvider,
    staleTime: 60 * 1000, // 1min conforme SPEC
  });
}
