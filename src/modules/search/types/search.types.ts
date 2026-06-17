export interface SearchParams {
  q?: string;
  categoryId?: string;
  city?: string;
  state?: string;
  ratingMin?: number;
  available?: boolean;
  priceMin?: number;
  priceMax?: number;
  paymentMethodId?: string;
  dayOfWeek?: number;
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
}

export interface SearchProviderItem {
  id: string;
  businessName: string;
  avatarUrl: string | null;
  averageRating: number;
  reviewCount: number;
  city: string;
  state: string;
  isAvailable: boolean;
  nextAvailableDate: string | null;
  services: Array<{ name: string; priceBase: number; priceType: string }>;
  paymentMethods: Array<{ id: string; name: string; label: string; icon: string | null }>;
}

export interface PaymentMethodType {
  id: string;
  name: string;
  label: string;
  icon: string | null;
}

export interface SearchResponse {
  data: SearchProviderItem[];
  layout: any[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    priceRange?: { min: number; max: number };
  };
  paymentMethodTypes?: PaymentMethodType[];
}

export type GetSearchResult = Promise<SearchResponse>;
