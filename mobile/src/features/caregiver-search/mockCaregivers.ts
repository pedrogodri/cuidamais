import type { MockReview } from '@/features/caregiver-profile/mockCaregiverProfile';

export interface CaregiverSummary {
  id: string;
  name: string;
  initials: string;
  specialties: string[];
  region: string;
  rating: number;
  reviewCount: number;
  rate: { amount: string; unit: string };
  verified: boolean;
  topRated: boolean;
}

export interface CaregiverDetail extends CaregiverSummary {
  bio: string;
  experienceYears: number;
  availability: string;
  reviews: MockReview[];
}

export const MOCK_CAREGIVERS: CaregiverDetail[] = [
  {
    id: '1',
    name: 'Maria Silva',
    initials: 'MS',
    specialties: ['Idosos', 'Pós-operatório', 'Mobilidade reduzida'],
    region: 'Zona Sul, São Paulo',
    rating: 4.8,
    reviewCount: 23,
    rate: { amount: 'R$ 35', unit: '/hora' },
    verified: true,
    topRated: true,
    bio: 'Cuidadora com foco em pacientes idosos e pós-operatório, sempre com atenção e paciência.',
    experienceYears: 6,
    availability: 'Seg a Sex, 08h–18h',
    reviews: [
      {
        id: '1',
        author: 'Ana Beatriz',
        rating: 5,
        comment: 'Muito atenciosa e pontual, minha mãe adorou.',
        date: '10/08',
      },
      {
        id: '2',
        author: 'Roberto Lima',
        rating: 5,
        comment: 'Profissional excelente, super recomendo.',
        date: '02/08',
      },
    ],
  },
  {
    id: '2',
    name: 'João Santos',
    initials: 'JS',
    specialties: ['Pós-operatório', 'Fisioterapia'],
    region: 'Zona Oeste, São Paulo',
    rating: 4.6,
    reviewCount: 15,
    rate: { amount: 'R$ 40', unit: '/hora' },
    verified: true,
    topRated: false,
    bio: 'Fisioterapeuta e cuidador, especializado em recuperação pós-cirúrgica e mobilidade.',
    experienceYears: 4,
    availability: 'Seg a Sáb, 07h–19h',
    reviews: [
      {
        id: '1',
        author: 'Carla Menezes',
        rating: 4,
        comment: 'Muito atencioso com meu pai durante a recuperação.',
        date: '15/08',
      },
    ],
  },
  {
    id: '3',
    name: 'Ana Paula Reis',
    initials: 'AR',
    specialties: ['Mobilidade reduzida', 'Pediatria'],
    region: 'Zona Norte, São Paulo',
    rating: 4.9,
    reviewCount: 31,
    rate: { amount: 'R$ 38', unit: '/hora' },
    verified: true,
    topRated: true,
    bio: 'Cuidadora com experiência em pediatria e mobilidade reduzida, atendimento humanizado.',
    experienceYears: 8,
    availability: 'Seg a Sex, 09h–17h',
    reviews: [
      {
        id: '1',
        author: 'Fernanda Costa',
        rating: 5,
        comment: 'Excelente com crianças, muito paciente.',
        date: '28/07',
      },
      {
        id: '2',
        author: 'Marcos Vinícius',
        rating: 5,
        comment: 'Recomendo demais, muito profissional.',
        date: '20/07',
      },
    ],
  },
];

export function getCaregiverById(id: string): CaregiverDetail | undefined {
  return MOCK_CAREGIVERS.find((caregiver) => caregiver.id === id);
}
