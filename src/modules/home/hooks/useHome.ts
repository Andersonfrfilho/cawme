import { useQuery } from '@tanstack/react-query';
import { HomeService } from '@/modules/home/services/home.service';
import { screenRender } from '@/shared/utils/logger';
import { useEffect } from 'react';

export function useHome() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['home'],
    queryFn: async () => {
      // Logging é feito automaticamente pelo api-client interceptor
      try {
        const result = await HomeService.get();
        return result;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data && !isLoading) {
      screenRender('HomeScreen');
    }
  }, [data, isLoading]);

  return { data, isLoading, error, refetch };
}
