import axios from 'axios';
import { router } from 'expo-router';
import { TokenService } from '@/modules/auth/services/token.service';
import { KeycloakService } from '@/modules/auth/services/keycloak.service';
import { useErrorStore } from '@/shared/store/error.store';
import type { ErrorVariant } from '@/shared/components/error-screen';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _skipGlobalError?: boolean;
    _retry?: boolean;
  }
}

function mapStatusToVariant(status?: number): ErrorVariant {
  if (!status) return 'network';
  if (status === 404) return '404';
  if (status === 409) return '409';
  if (status >= 500) return '500';
  return 'generic';
}

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

// Refresh automático no 401 + redirect global para erros de API
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
        await TokenService.clear();
        return Promise.reject(refreshError);
      }
    }

    if (!originalRequest._skipGlobalError && error.response?.status !== 401) {
      const variant = mapStatusToVariant(error.response?.status);
      useErrorStore.getState().setError({ variant });
      router.navigate('/error');
    }

    return Promise.reject(error);
  }
);
