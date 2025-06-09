'use client';

import { useEffect } from 'react';
import useAuthStore from '@/lib/stores/auth-store';
import { ApiResponse, User } from '@/lib/types';
import { apiClient } from '@/lib/utils/api-client';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
   const { accessToken, isAuthenticated, isLoading, setLoading, setIsAuthenticated, login, logout, user, setUser } = useAuthStore();

   useEffect(() => {
      const verifySession = async () => {
         setLoading(true);
         if (accessToken) {
            try {
               const response = await apiClient<ApiResponse<User>>(`/users/me`);

               if (response.success && response.data) {
                  const { data } = response;
                  if (!user || user.userId !== data.userId) { // Only update if user data differs or is missing
                     setUser(data);
                     setIsAuthenticated(true);
                  }
               } else if (response.statusCode === 401) {
                  console.warn('Access token expired or invalid during session check.');
                  logout();
               } else {
                  console.error('Session verification failed:', response.statusCode);
                  logout();
               }
            } catch (error) {
               console.error('Error during session verification:', error);
               logout();
            }
         } else {
            logout();
         }
         setLoading(false);
      };

      if (!isAuthenticated && accessToken) {
         verifySession();
      } else if (!accessToken) {
         setLoading(false);
      } else if (isAuthenticated) {
         setLoading(false);
      }


   }, [accessToken, isAuthenticated, login, logout, setLoading, user]);

   if (isLoading) {
      return <div>Loading session...</div>;
   }

   return <>{children}</>;
};

export default AuthInitializer;