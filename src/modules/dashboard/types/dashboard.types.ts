export interface DashboardStats {
  label: string;
  value: string | number;
  icon: string;
}

export interface ServiceRequestSummary {
  id: string;
  title: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  date: string;
  priceFinal?: number;
  priceType?: string;
  priceBase?: number;
  description?: string | null;
  serviceName?: string;
  providerName?: string;
  providerAvatar?: string;
  contractorName?: string;
  paymentMethod?: string;
  scheduledAt?: string | null;
  createdAt?: string;
  address?: {
    street: string;
    number: string;
    city: string;
    state: string;
    neighborhood: string;
    latitude?: string;
    longitude?: string;
  };
}

export interface ContractorDashboardResponse {
  activeRequests: ServiceRequestSummary[];
  pendingRequests: ServiceRequestSummary[];
  recentHistory: ServiceRequestSummary[];
  unreadNotifications: number;
}

export interface ProviderDashboardResponse {
  incomingRequests: ServiceRequestSummary[];
  activeRequests: ServiceRequestSummary[];
  averageRating: number;
  reviewCount: number;
  verificationStatus: string;
  unreadNotifications: number;
}

export type GetContractorDashboardResult = Promise<ContractorDashboardResponse>;
export type GetProviderDashboardResult = Promise<ProviderDashboardResponse>;
