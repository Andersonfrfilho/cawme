import { useQuery } from '@tanstack/react-query';
import { ProvidersService } from '../services/providers.service';

export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: () => ProvidersService.list(),
    staleTime: 2 * 60 * 1000,
  });
}
