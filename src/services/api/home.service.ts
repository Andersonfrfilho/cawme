import { apiClient } from './api-client';
import { ScreenComponentData } from '@/types/bff/sdui.types';

export interface HomeResponse {
  layout: ScreenComponentData[];
}

export const HomeService = {
  async get(): Promise<HomeResponse> {
    const response = await apiClient.get('/bff/home');
    return response.data;
  },
};
