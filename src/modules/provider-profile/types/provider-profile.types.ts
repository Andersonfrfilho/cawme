export interface ProviderProfile {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  verificationStatus: string;
  categories: string[];
  location: {
    city: string;
    state: string;
    distance?: number;
  };
  services: Array<{
    id: string;
    name: string;
    price: number;
    unit: string;
  }>;
  paymentMethods: Array<{
    id: string;
    name: string;
    label: string;
    icon: string | null;
    isEnabled: boolean;
  }>;
  reviews: Array<{
    rating: number;
    comment: string | null;
    contractorName: string;
    serviceName: string;
    createdAt: string;
  }>;
}

export interface GetProviderProfileParams {
  id: string;
}

export type GetProviderProfileResult = Promise<ProviderProfile>;
