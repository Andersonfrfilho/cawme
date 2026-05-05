import axios from 'axios';
import { router } from 'expo-router';
import { TokenService } from '@/modules/auth/services/token.service';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useErrorStore } from '@/shared/store/error.store';
import { mobileCallStart, mobileCallEnd, mobileCallError } from '@/shared/utils/logger';
import type { ErrorVariant } from '@/shared/components/error-screen';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _skipGlobalError?: boolean;
    _retry?: boolean;
    _skipLog?: boolean;
    _requestId?: string;
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

// Lazy import to avoid circular dependency
let KeycloakServiceImported: typeof import('@/modules/auth/services/keycloak.service').KeycloakService | null = null;

async function getKeycloakService() {
  if (!KeycloakServiceImported) {
    const mod = await import('@/modules/auth/services/keycloak.service');
    KeycloakServiceImported = mod.KeycloakService;
  }
  return KeycloakServiceImported;
}

// Request logging + token injection
apiClient.interceptors.request.use(async (config) => {
  (config as any)._startTime = Date.now();

  const token = await TokenService.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!config._skipLog) {
    const requestId = mobileCallStart('http.request', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      headers: config.headers as Record<string, string>,
      params: config.params,
      payload: config.data,
    });
    (config as any)._requestId = requestId;
  }

  return config;
});

// Response logging + error handling
apiClient.interceptors.response.use(
  (res) => {
    const duration = Date.now() - ((res.config as any)._startTime ?? 0);
    const requestId = (res.config as any)._requestId;
    
    if (!(res.config as any)._skipLog) {
      mobileCallEnd('http.request', duration, res.status, requestId);
    }
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    const duration = Date.now() - (originalRequest?._startTime ?? 0);
    const requestId = (originalRequest as any)?._requestId;

    if (originalRequest && !originalRequest._skipLog) {
      const status = error.response?.status ?? 'NET';
      if (status === 401 && !originalRequest._retry) {
        mobileCallError('http.request', new Error('Unauthorized - no token'), duration, requestId);
      } else {
        mobileCallError('http.request', error, duration, requestId);
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await TokenService.getRefresh();
      if (refreshToken) {
        try {
          const KeycloakService = await getKeycloakService();
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
