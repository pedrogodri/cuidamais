import { create } from 'zustand';

export type ProfileType = 'caregiver' | 'family' | 'cared_person';

export interface ActiveProfile {
  type: ProfileType;
  id: string;
}

interface ActiveProfileState {
  activeProfile: ActiveProfile | null;
  setActiveProfile: (profile: ActiveProfile) => void;
  clearActiveProfile: () => void;
}

export const useActiveProfileStore = create<ActiveProfileState>((set) => ({
  activeProfile: null,
  setActiveProfile: (profile) => set({ activeProfile: profile }),
  clearActiveProfile: () => set({ activeProfile: null }),
}));
