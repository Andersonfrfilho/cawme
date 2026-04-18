import { apiClient } from '@/shared/services/api-client';
import { SearchParams, GetSearchResult } from '@/modules/search/types/search.types';

export const SearchService = {
  async get(params: SearchParams): GetSearchResult {
    const response = await apiClient.get('/bff/search', { params });
    return response.data;
  },
};
