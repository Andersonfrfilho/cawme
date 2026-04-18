import { apiClient } from '@/shared/services/api-client';
import { ScreenComponentData } from '@/modules/sdui/types/sdui.types';

export interface HomeResponse {
  layout: ScreenComponentData[];
}

export const HomeService = {
  async get(): Promise<HomeResponse> {
    const response = await apiClient.get('/bff/home');
    return response.data;
  },
};
