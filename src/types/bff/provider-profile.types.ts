export interface ProviderProfile {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
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
}

export interface GetProviderProfileParams {
  id: string;
}

export type GetProviderProfileResult = Promise<ProviderProfile>;
