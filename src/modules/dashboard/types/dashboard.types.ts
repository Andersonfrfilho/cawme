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
  stats: DashboardStats[];
  recentRequests: ServiceRequestSummary[];
}

export interface ProviderDashboardResponse {
  stats: DashboardStats[];
  activeSchedule: ServiceRequestSummary[];
  pendingRequests: ServiceRequestSummary[];
}

export type GetContractorDashboardResult = Promise<ContractorDashboardResponse>;
export type GetProviderDashboardResult = Promise<ProviderDashboardResponse>;
