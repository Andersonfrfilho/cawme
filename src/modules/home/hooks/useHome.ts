import { useQuery } from '@tanstack/react-query';
import { HomeService } from '@/modules/home/services/home.service';

export function useHome() {
  return useQuery({
    queryKey: ['home'],
    queryFn: HomeService.get,
    staleTime: 5 * 60 * 1000,
  });
}
