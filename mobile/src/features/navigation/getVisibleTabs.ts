import type { ProfileType } from '@/features/auth/store/useActiveProfileStore';

export type TabName = 'home' | 'perfil' | 'buscar' | 'agenda' | 'chat';

export function isTabVisible(tab: TabName, activeType: ProfileType | null): boolean {
  switch (tab) {
    case 'home':
      return true;
    case 'perfil':
      return activeType === 'caregiver';
    case 'buscar':
      return activeType === 'family' || activeType === 'cared_person';
    case 'agenda':
    case 'chat':
      return activeType !== null;
    default:
      return false;
  }
}
