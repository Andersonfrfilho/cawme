export interface DashboardStats {
  label: string;
  value: string | number;
  icon: string;
}

export interface ServiceRequestSummary {
  id: string;
  title: string;
  status: 'pending' | 'accepted' | 'completed' | 'canceled';
  date: string;
  price?: number;
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
