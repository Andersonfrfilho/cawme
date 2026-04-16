import { apiClient } from './api-client';
import { SearchParams, GetSearchResult } from '@/types/bff/search.types';

export const SearchService = {
  async get(params: SearchParams): GetSearchResult {
    const response = await apiClient.get('/bff/search', { params });
    return response.data;
  },
};
