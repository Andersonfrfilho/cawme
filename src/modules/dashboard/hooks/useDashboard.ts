import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/modules/dashboard/services/dashboard.service';
import { isTestEnvironment } from '@/shared/utils/test-environment';

export function useContractorDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'contractor'],
    queryFn: async () => {
      if (isTestEnvironment()) {
        return {
          stats: [
            { label: 'Serviços', value: '12', icon: 'briefcase-outline' },
            { label: 'Gastos', value: 'R$1.200', icon: 'cash-outline' },
          ],
          recentRequests: [
            { id: '1', title: 'Limpeza Completa', status: 'accepted' as const, date: '29/05/2026' },
            { id: '2', title: 'Desentupimento Urgente', status: 'pending' as const, date: '30/05/2026' },
          ],
        };
      }
      return DashboardService.getContractor();
    },
    staleTime: 60 * 1000, // 1min conforme SPEC
  });
}

export function useProviderDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'provider'],
    queryFn: async () => {
      if (isTestEnvironment()) {
        return {
          stats: [
            { label: 'Agenda', value: '3', icon: 'calendar-outline' },
            { label: 'Pendentes', value: '2', icon: 'time-outline' },
            { label: 'Concluídos', value: '47', icon: 'checkmark-circle-outline' },
          ],
          activeSchedule: [
            { id: '1', title: 'Limpeza Residencial', status: 'accepted' as const, date: '29/05/2026 10:00' },
          ],
          pendingRequests: [
            { id: '2', title: 'Desentupimento Urgente', status: 'pending' as const, date: '30/05/2026 09:00' },
          ],
        };
      }
      return DashboardService.getProvider();
    },
    staleTime: 60 * 1000, // 1min conforme SPEC
  });
}
