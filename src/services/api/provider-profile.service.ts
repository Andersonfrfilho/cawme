import { apiClient } from './api-client';
import { GetProviderProfileParams, GetProviderProfileResult } from '@/types/bff/provider-profile.types';

export const ProviderProfileService = {
  async get({ id }: GetProviderProfileParams): GetProviderProfileResult {
    const response = await apiClient.get(`/bff/providers/${id}/profile`);
    return response.data;
  },
};
