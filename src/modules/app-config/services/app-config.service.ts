import { apiClient } from '@/shared/services/api-client';
import { GetAppConfigResult } from '@/modules/app-config/types/app-config.types';

export const AppConfigService = {
  async get(): GetAppConfigResult {
    const response = await apiClient.get('/bff/app-config');
    return response.data;
  },
};
