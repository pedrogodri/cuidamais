import type { ActiveProfile } from '@/features/auth/store/useActiveProfileStore';

// No backend yet — a real account would have its own linked-profile list.
// This mock intentionally links only 2 of the 3 profile types, so the
// switcher can prove it filters by what's linked instead of always
// offering all three (unlike the old ProfileModeSwitcher).
export const MOCK_LINKED_PROFILES: ActiveProfile[] = [
  { type: 'family', id: 'preview-family' },
  { type: 'caregiver', id: 'preview-caregiver' },
];
