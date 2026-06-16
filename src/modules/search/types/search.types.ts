export interface SearchParams {
  q?: string;
  categoryId?: string;
  city?: string;
  state?: string;
  ratingMin?: number;
  available?: boolean;
  priceMin?: number;
  priceMax?: number;
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
}

export interface SearchProviderItem {
  id: string;
  businessName: string;
  averageRating: number;
  reviewCount: number;
  city: string;
  state: string;
  isAvailable: boolean;
  nextAvailableDate: string | null;
  services: Array<{ name: string; priceBase: number; priceType: string }>;
}

export interface SearchResponse {
  data: SearchProviderItem[];
  layout: any[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    hasNextPage: boolean;
  };
}

export type GetSearchResult = Promise<SearchResponse>;
