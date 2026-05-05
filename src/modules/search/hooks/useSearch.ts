import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchService } from '@/modules/search/services/search.service';
import { SearchParams } from '@/modules/search/types/search.types';

export function useSearch(params: Omit<SearchParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['search', params],
    queryFn: async ({ pageParam = 1 }) => {
      // Logging é feito automaticamente pelo api-client interceptor
      const result = await SearchService.get({ ...params, page: pageParam });
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 2 * 60 * 1000,
  });
}
