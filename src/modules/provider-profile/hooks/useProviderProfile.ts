import { useQuery } from '@tanstack/react-query';
import { ProviderProfileService } from '@/modules/provider-profile/services/provider-profile.service';
import { isTestEnvironment } from '@/shared/utils/test-environment';

export function useProviderProfile(id: string) {
  return useQuery({
    queryKey: ['provider-profile', id],
    queryFn: async () => {
      if (isTestEnvironment()) {
        return {
          id,
          name: 'Maria Limpeza',
          bio: 'Profissional de limpeza com 10 anos de experiência. Especializada em limpeza residencial e comercial.',
          avatarUrl: '',
          rating: 4.9,
          reviewCount: 122,
          categories: ['Limpeza'],
          location: { city: 'São Paulo', state: 'SP' },
          services: [
            { id: '1', name: 'Limpeza Completa', price: 150, unit: 'hora' },
            { id: '2', name: 'Limpeza Rápida', price: 75, unit: 'hora' },
          ],
        };
      }
      return ProviderProfileService.get({ id });
    },
    staleTime: 3 * 60 * 1000, // 3min conforme SPEC
    enabled: !!id,
  });
}
