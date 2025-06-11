"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/stores/auth-store";
import { ApiResponse } from "@/lib/types";
import { User } from "@/lib/types/users.types";
import { apiClient } from "@/lib/utils/api-client";
import LoadingSpinner from "./loader";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, isLoading, isAuthDelay, setLoading, user, setUser } =
    useAuthStore();

  useEffect(() => {
    const verifySession = async () => {
      try {
        setLoading(true);
        const response = await apiClient<ApiResponse<User>>(`/users/me`);

        if (response.success && response.data) {
          const { data } = response;
          if (!user || user.userId !== data.userId) setUser(data);
        }
      } catch (error) {
        console.error("Error during profile load:", error);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      verifySession();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  if (isLoading || (!children && isAuthDelay)) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default AuthInitializer;
