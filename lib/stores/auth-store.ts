import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authRepository } from '../repositories/auth-repository';
import { redirect } from 'next/navigation';
import { User } from '../types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean; // True while checking session
  setTokens: (access: string, refresh: string) => void;
  login: (email: string, password: string) => Promise<{ success: boolean, error?: string }>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  clearTokens: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
      isLoading: true,

      setTokens: (access, refresh) => {
        set({ accessToken: access, refreshToken: refresh });
      },
      setIsAuthenticated: (isAuthenticated) => {
        set({ isAuthenticated })
      },
      login: async (email, password) => {
        const { success, accessToken, refreshToken, error } = await authRepository.login(email, password);

        if (success) {
          set({
            accessToken: accessToken,
            refreshToken: refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        }
        else {
          set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
        return { success, error }
      },
      logout: async () => {
        const token = get().accessToken;
        if (token)
          await authRepository.logout(token);

        set({ accessToken: null, refreshToken: null, isAuthenticated: false, user: null, isLoading: false });
        redirect('/');
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setUser: (user) => set({ user }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;