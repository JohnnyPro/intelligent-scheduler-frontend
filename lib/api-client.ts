import useAuthStore from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation'; // For App Router
import { Mutex } from 'async-mutex'; // npm install async-mutex

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';

const mutex = new Mutex(); // To prevent multiple simultaneous token refreshes

export const apiClient = async <T = any>(
  endpoint: string,
  options?: RequestInit & { isFormData?: boolean; } // Added isFormData option
): Promise<T> => {
  const authStore = useAuthStore.getState();
  const router = typeof window !== 'undefined' ? useRouter() : null; // Get router only on client

  const originalRequest = { endpoint, options }; // Store original request for retry

  // If a request is already refreshing, wait for it
  if (mutex.isLocked() && endpoint !== '/auth/refresh') {
    return mutex.runExclusive(async () => {
      // After mutex is released, retry the request
      // Tokens should be updated by now, so `authStore.accessToken` will be new
      return apiClient(originalRequest.endpoint, originalRequest.options);
    });
  }

  let headers: HeadersInit = {
    ...options?.headers,
  };

  // Add Authorization header if token exists and it's not a login/register endpoint
  if (authStore.accessToken && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    headers = {
      'Authorization': `Bearer ${authStore.accessToken}`,
      ...headers,
    };
  }

  // Set Content-Type for JSON by default, unless it's FormData
  if (!options?.isFormData) {
    headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  } else {
    // If it's FormData, let the browser set 'Content-Type': 'multipart/form-data'
    // Remove 'Content-Type' from headers if you are passing FormData directly as body
    delete headers['Content-Type'];
  }

  const config: RequestInit = {
    ...options,
    headers: headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      // If it's a 401, and not the refresh endpoint itself
      if (!endpoint.includes('/auth/refresh')) {
        return mutex.runExclusive(async () => {
          // Double check if token was refreshed while waiting for mutex
          const newAuthStore = useAuthStore.getState();
          if (newAuthStore.accessToken !== authStore.accessToken) {
            // Token was refreshed, retry original request with new token
            return apiClient(originalRequest.endpoint, originalRequest.options);
          }

          // Token was not refreshed, proceed with refresh
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.refreshToken}`, // Send refresh token here
              },
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              const newTokens = refreshData.data; // Assuming backend sends { data: { accessToken, refreshToken } }

              // Update Zustand store with new tokens
              useAuthStore.getState().setTokens(newTokens.accessToken, newTokens.refreshToken);

              // Retry the original request with the new access token
              return apiClient(originalRequest.endpoint, originalRequest.options);
            } else {
              // Refresh failed
              throw new Error('Refresh token invalid or expired. Please login again.');
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            useAuthStore.getState().logout(); // Clear client state
            router?.push('/login'); // Redirect to login
            throw refreshError;
          }
        });
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    // Handle 204 No Content for successful operations that don't return data
    if (response.status === 204) {
      return {} as T; // Return empty object for void return types
    }

    return response.json();
  } catch (error) {
    console.error(`API Call Error (${endpoint}):`, error);
    throw error;
  }
};