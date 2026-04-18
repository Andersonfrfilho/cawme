import { useQuery } from '@tanstack/react-query';
import { ProviderProfileService } from '@/modules/provider-profile/services/provider-profile.service';

export function useProviderProfile(id: string) {
  return useQuery({
    queryKey: ['provider-profile', id],
    queryFn: () => ProviderProfileService.get({ id }),
    staleTime: 3 * 60 * 1000, // 3min conforme SPEC
    enabled: !!id,
  });
}
