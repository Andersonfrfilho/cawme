import { apiClient } from './api-client';
import { GetAppConfigResult } from '@/types/bff/app-config.types';

export const AppConfigService = {
  async get(): GetAppConfigResult {
    const response = await apiClient.get('/bff/app-config');
    return response.data;
  },
};
