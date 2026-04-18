import { apiClient } from '@/shared/services/api-client';
import { GetProviderProfileParams, GetProviderProfileResult } from '@/modules/provider-profile/types/provider-profile.types';

export const ProviderProfileService = {
  async get({ id }: GetProviderProfileParams): GetProviderProfileResult {
    const response = await apiClient.get(`/bff/providers/${id}/profile`);
    return response.data;
  },
};
