import { apiClient } from './api-client';
import { GetContractorDashboardResult, GetProviderDashboardResult } from '@/types/bff/dashboard.types';

export const DashboardService = {
  async getContractor(): GetContractorDashboardResult {
    const response = await apiClient.get('/bff/dashboard/contractor');
    return response.data;
  },
  async getProvider(): GetProviderDashboardResult {
    const response = await apiClient.get('/bff/dashboard/provider');
    return response.data;
  },
};
