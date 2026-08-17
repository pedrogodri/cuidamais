import type { ProfileType } from '@/features/auth/store/useActiveProfileStore';

export interface ProfileTheme {
  type: ProfileType;
  label: string;
  description: string;
  icon: 'briefcase-outline' | 'heart-outline' | 'people-outline';
  colorClass500: string;
  colorClass700: string;
  colorClass100: string;
  bgClass500: string;
  bgClass700: string;
  bgClass100: string;
  borderClass500: string;
  textClass700: string;
  textClass900OnAmber: string;
}

const PROFILE_THEMES: Record<ProfileType, ProfileTheme> = {
  caregiver: {
    type: 'caregiver',
    label: 'Cuidador',
    description: 'Vou oferecer cuidado profissional',
    icon: 'briefcase-outline',
    colorClass500: 'petrol-500',
    colorClass700: 'petrol-700',
    colorClass100: 'petrol-100',
    bgClass500: 'bg-petrol-500',
    bgClass700: 'bg-petrol-700',
    bgClass100: 'bg-petrol-100',
    borderClass500: 'border-petrol-500',
    textClass700: 'text-petrol-700',
    textClass900OnAmber: 'text-petrol-700',
  },
  cared_person: {
    type: 'cared_person',
    label: 'Pessoa cuidada',
    description: 'Vou receber cuidado',
    icon: 'heart-outline',
    colorClass500: 'amber-500',
    colorClass700: 'amber-700',
    colorClass100: 'amber-100',
    bgClass500: 'bg-amber-500',
    bgClass700: 'bg-amber-700',
    bgClass100: 'bg-amber-100',
    borderClass500: 'border-amber-500',
    textClass700: 'text-amber-700',
    textClass900OnAmber: 'text-neutral-900',
  },
  family: {
    type: 'family',
    label: 'Responsável',
    description: 'Vou gerenciar o cuidado de alguém',
    icon: 'people-outline',
    colorClass500: 'vinculo-500',
    colorClass700: 'vinculo-700',
    colorClass100: 'vinculo-100',
    bgClass500: 'bg-vinculo-500',
    bgClass700: 'bg-vinculo-700',
    bgClass100: 'bg-vinculo-100',
    borderClass500: 'border-vinculo-500',
    textClass700: 'text-vinculo-700',
    textClass900OnAmber: 'text-white',
  },
};

export const PROFILE_ORDER: ProfileType[] = ['caregiver', 'cared_person', 'family'];

export function getProfileTheme(type: ProfileType): ProfileTheme {
  return PROFILE_THEMES[type];
}

const BUTTON_TONE: Record<ProfileType, 'petrol' | 'amber' | 'vinculo'> = {
  caregiver: 'petrol',
  cared_person: 'amber',
  family: 'vinculo',
};

export function getProfileButtonTone(type: ProfileType) {
  return BUTTON_TONE[type];
}

export function parseProfileType(value: string | string[] | undefined): ProfileType {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate === 'caregiver' || candidate === 'cared_person' || candidate === 'family') {
    return candidate;
  }
  return 'caregiver';
}
