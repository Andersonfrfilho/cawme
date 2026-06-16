import { apiClient } from '@/shared/services/api-client';
import type { ListProvidersServiceResult, ProviderListItem } from '../types/providers.types';

type BffSearchWorkLocation = { city: string; state: string };

type BffSearchProviderItem = {
  id: string;
  businessName: string;
  averageRating: number;
  reviewCount: number;
  workLocations: BffSearchWorkLocation[];
  services: Array<{ name: string; priceBase: number; priceType: string }>;
  isAvailable: boolean;
  nextAvailableDate: string | null;
};

type BffSearchResponse = {
  data: BffSearchProviderItem[];
};

export const ProvidersService = {
  async list(): ListProvidersServiceResult {
    const response = await apiClient.get<BffSearchResponse>('/bff/search', {
      params: { limit: 50 },
    });
    return response.data.data.map((provider): ProviderListItem => {
      const primaryLocation = provider.workLocations[0];
      return {
        id: provider.id,
        businessName: provider.businessName,
        averageRating: provider.averageRating,
        reviewCount: provider.reviewCount,
        city: primaryLocation?.city ?? '',
        state: primaryLocation?.state ?? '',
        isAvailable: provider.isAvailable,
        nextAvailableDate: provider.nextAvailableDate ?? null,
        services: provider.services ?? [],
      };
    });
  },
};
