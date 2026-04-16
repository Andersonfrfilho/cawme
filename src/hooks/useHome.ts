import { useQuery } from '@tanstack/react-query';
import { HomeService } from '@/services/api/home.service';

export function useHome() {
  return useQuery({
    queryKey: ['home'],
    queryFn: HomeService.get,
    staleTime: 5 * 60 * 1000,
  });
}
