import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/app-providers/AuthProvider';
import {
  useActiveProfileStore,
  type ProfileType,
} from '@/features/auth/store/useActiveProfileStore';
import { canAccessProfileRoute } from './canAccessProfileRoute';

export function useProfileGuard(requiredType: ProfileType): void {
  const { session, isLoading } = useAuth();
  const activeProfile = useActiveProfileStore((state) => state.activeProfile);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!canAccessProfileRoute(session, activeProfile, requiredType)) {
      router.replace('/(auth)');
    }
  }, [isLoading, session, activeProfile, requiredType]);
}
