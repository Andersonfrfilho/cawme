import axios from 'axios';
import { router } from 'expo-router';
import { TokenService } from '@/modules/auth/services/token.service';
import { KeycloakService } from '@/modules/auth/services/keycloak.service';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useErrorStore } from '@/shared/store/error.store';
import type { ErrorVariant } from '@/shared/components/error-screen';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _skipGlobalError?: boolean;
    _retry?: boolean;
    _skipLog?: boolean;
  }
}

function mapStatusToVariant(status?: number): ErrorVariant {
  if (!status) return 'network';
  if (status === 404) return '404';
  if (status === 409) return '409';
  if (status >= 500) return '500';
  return 'generic';
}

function formatDuration(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BFF_URL,
  timeout: 10_000,
});

// Request logging + token injection
apiClient.interceptors.request.use(async (config) => {
  (config as any)._startTime = Date.now();

  const token = await TokenService.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!config._skipLog) {
    console.log(
      `[API] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      config.params ? `params: ${JSON.stringify(config.params)}` : '',
    );
  }

  return config;
});

// Response logging + error handling
apiClient.interceptors.response.use(
  (res) => {
    const duration = Date.now() - ((res.config as any)._startTime ?? 0);
    if (!(res.config as any)._skipLog) {
      console.log(
        `[API] ← ${res.status} ${res.config.method?.toUpperCase()} ${res.config.url} (${formatDuration(duration)})`,
      );
    }
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    const duration = Date.now() - (originalRequest?._startTime ?? 0);

    if (originalRequest && !originalRequest._skipLog) {
      const status = error.response?.status ?? 'NET';
      if (status === 401 && !originalRequest._retry) {
        console.log(
          `[API] ~ ${status} ${originalRequest.method?.toUpperCase()} ${originalRequest.url} (${formatDuration(duration)}) — no token`,
        );
      } else {
        console.error(
          `[API] ✗ ${status} ${originalRequest.method?.toUpperCase()} ${originalRequest.url} (${formatDuration(duration)})`,
          error.response?.data ? JSON.stringify(error.response.data).slice(0, 200) : error.message,
        );
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await TokenService.getRefresh();
      if (refreshToken) {
        try {
          await KeycloakService.refresh();
          const newToken = await TokenService.getAccess();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient.request(originalRequest);
          }
        } catch (refreshError) {
          await TokenService.clear();
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    if (!originalRequest._skipGlobalError && error.response?.status !== 401) {
      const variant = mapStatusToVariant(error.response?.status);
      useErrorStore.getState().setError({ variant });
      router.navigate('/error');
    }

    return Promise.reject(error);
  },
);
