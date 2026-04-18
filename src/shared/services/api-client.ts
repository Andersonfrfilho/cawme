import axios from 'axios';
import { TokenService } from '@/modules/auth/services/token.service';
import { KeycloakService } from '@/modules/auth/services/keycloak.service';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BFF_URL,
  timeout: 10_000,
});

// Injeta Bearer token em todas as requests
apiClient.interceptors.request.use(async (config) => {
  const token = await TokenService.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh automático no 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await KeycloakService.refresh();
        const newToken = await TokenService.getAccess();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient.request(originalRequest);
        }
      } catch (refreshError) {
        // Se falhar o refresh, desloga
        await TokenService.clear();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
