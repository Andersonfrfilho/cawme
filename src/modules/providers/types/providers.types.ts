export type ProviderListItem = {
  id: string;
  businessName: string;
  averageRating: number;
  reviewCount: number;
  city: string;
  state: string;
  isAvailable: boolean;
  nextAvailableDate: string | null;
};

export type ListProvidersServiceResult = Promise<ProviderListItem[]>;
