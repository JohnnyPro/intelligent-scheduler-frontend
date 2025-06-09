'use client';

import { useEffect } from 'react';
import useAuthStore from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}