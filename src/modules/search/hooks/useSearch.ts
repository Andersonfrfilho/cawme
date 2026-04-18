import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchService } from '@/modules/search/services/search.service';
import { SearchParams } from '@/modules/search/types/search.types';

export function useSearch(params: Omit<SearchParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['search', params],
    queryFn: ({ pageParam = 1 }) => SearchService.get({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 2 * 60 * 1000, // 2min conforme SPEC
  });
}
