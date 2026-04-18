import { ScreenComponentData } from '@/modules/sdui/types/sdui.types';

export interface SearchParams {
  q?: string;
  category?: string;
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  layout: ScreenComponentData[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    hasNextPage: boolean;
  };
}

export type GetSearchResult = Promise<SearchResponse>;
