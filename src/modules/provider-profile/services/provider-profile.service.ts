import { apiClient } from '@/shared/services/api-client';
import type { GetProviderProfileParams, GetProviderProfileResult, ProviderProfile } from '@/modules/provider-profile/types/provider-profile.types';

type BffService = {
  id: string;
  name: string;
  category: { id: string; name: string };
  priceBase: number;
  priceType: string;
};

type BffWorkLocation = { city: string; state: string; isPrimary: boolean };

type BffPaymentMethod = {
  id: string;
  name: string;
  label: string;
  icon: string | null;
  isEnabled: boolean;
};

type BffReview = {
  rating: number;
  comment: string | null;
  contractorName: string;
  serviceName: string;
  createdAt: string;
};

type BffProviderProfileResponse = {
  id: string;
  businessName: string;
  description: string | null;
  averageRating: number;
  reviewCount: number;
  isAvailable: boolean;
  avatarUrl: string | null;
  verificationStatus: string;
  services: BffService[];
  workLocations: BffWorkLocation[];
  paymentMethods: BffPaymentMethod[];
  recentReviews: BffReview[];
};

const PRICE_TYPE_UNIT: Record<string, string> = {
  HOURLY: 'hora',
  HOUR: 'hora',
  DAILY: 'dia',
  DAY: 'dia',
  MONTHLY: 'mês',
  FIXED: 'serviço',
  PER_VISIT: 'visita',
};

function mapBffToProviderProfile(raw: BffProviderProfileResponse): ProviderProfile {
  const primaryLocation =
    raw.workLocations.find((location) => location.isPrimary) ?? raw.workLocations[0];
  const categories = [...new Set(raw.services.map((service) => service.category.name))];
  return {
    id: raw.id,
    name: raw.businessName,
    bio: raw.description ?? '',
    avatarUrl: raw.avatarUrl ?? '',
    rating: raw.averageRating,
    reviewCount: raw.reviewCount,
    verificationStatus: raw.verificationStatus,
    categories,
    location: primaryLocation
      ? { city: primaryLocation.city, state: primaryLocation.state }
      : { city: '', state: '' },
    services: raw.services.map((service) => ({
      id: service.id,
      name: service.name,
      price: service.priceBase,
      unit: PRICE_TYPE_UNIT[service.priceType] ?? service.priceType.toLowerCase(),
    })),
    paymentMethods: (raw.paymentMethods ?? []).filter((m) => m.isEnabled),
    reviews: (raw.recentReviews ?? []).map((review) => ({
      rating: review.rating,
      comment: review.comment,
      contractorName: review.contractorName,
      serviceName: review.serviceName,
      createdAt: review.createdAt,
    })),
  };
}

export const ProviderProfileService = {
  async get({ id }: GetProviderProfileParams): GetProviderProfileResult {
    const response = await apiClient.get<BffProviderProfileResponse>(
      `/bff/providers/${id}/profile`,
    );
    return mapBffToProviderProfile(response.data);
  },
};
