import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserData {
  name: string;
  email: string;
  profleImg: string | null;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean; // True while checking session
  setTokens: (access: string, refresh: string) => void;
  login: (access: string, refresh: string, userData: UserData) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setUser: (user: UserData | null) => void;
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
      login: (access, refresh, userData) => {
        set({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true,
          user: userData,
          isLoading: false,
        });
      },
      logout: async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/logout`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${get().accessToken}`
          }
        });
        set({ accessToken: null, refreshToken: null, isAuthenticated: false, user: null, isLoading: false });
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