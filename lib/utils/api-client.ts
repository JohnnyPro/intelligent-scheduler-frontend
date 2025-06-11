import useAuthStore from '@/lib/stores/auth-store';
import { Mutex } from 'async-mutex';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001';

const mutex = new Mutex();

export const apiClient = async <T = unknown>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const authStore = useAuthStore.getState();

  const originalRequest = { endpoint, options };

  if (mutex.isLocked() && endpoint !== '/auth/refresh') {
    return mutex.runExclusive(async () => {
      return apiClient(originalRequest.endpoint, originalRequest.options);
    });
  }

  let headers: HeadersInit = {
    ...options?.headers,
  };

  if (authStore.accessToken && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    headers = {
      'Authorization': `Bearer ${authStore.accessToken}`,
      ...headers,
    };
  }

  headers = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const config: RequestInit = {
    ...options,
    headers: headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401 && !endpoint.includes('/auth/refresh')) {
      return mutex.runExclusive(async () => {
        const newAuthStore = useAuthStore.getState();
        if (newAuthStore.accessToken !== authStore.accessToken) {
          return apiClient(originalRequest.endpoint, originalRequest.options);
        }

        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authStore.refreshToken}`,
            },
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const newTokens = refreshData.data;

            useAuthStore.getState().setTokens(newTokens.accessToken, newTokens.refreshToken);

            return apiClient(originalRequest.endpoint, originalRequest.options);
          } else {
            throw new Error('Refresh token invalid or expired. Please login again.');
          }
        } catch (refreshError) {
          useAuthStore.getState().logout();
          throw refreshError;
        }
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    console.error(`API Call Error (${endpoint}):`, error);
    throw error;
  }
};