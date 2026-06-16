export type ProviderListItem = {
  id: string;
  businessName: string;
  averageRating: number;
  reviewCount: number;
  city: string;
  state: string;
  isAvailable: boolean;
  nextAvailableDate: string | null;
  services: Array<{ name: string; priceBase: number; priceType: string }>;
};

export type ListProvidersServiceResult = Promise<ProviderListItem[]>;
