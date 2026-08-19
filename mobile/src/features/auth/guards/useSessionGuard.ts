import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/app-providers/AuthProvider';

export function useSessionGuard(): void {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!session) {
      router.replace('/(auth)');
    }
  }, [isLoading, session]);
}
