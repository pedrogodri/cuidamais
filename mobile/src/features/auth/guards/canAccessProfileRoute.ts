import type { AuthSession } from '@/app-providers/AuthProvider';
import type { ActiveProfile, ProfileType } from '@/features/auth/store/useActiveProfileStore';

export function canAccessProfileRoute(
  session: AuthSession | null,
  activeProfile: ActiveProfile | null,
  requiredType: ProfileType,
): boolean {
  if (!session || !activeProfile) {
    return false;
  }
  return activeProfile.type === requiredType;
}
