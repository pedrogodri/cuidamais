export interface MockReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export const MOCK_CAREGIVER_PROFILE = {
  name: 'Maria Silva',
  initials: 'MS',
  verified: true,
  topRated: true,
  rating: 4.8,
  reviewCount: 23,
  bio: 'Cuidadora com foco em pacientes idosos e pós-operatório, sempre com atenção e paciência.',
  specialties: ['Idosos', 'Pós-operatório', 'Mobilidade reduzida'],
  experienceYears: 6,
  region: 'Zona Sul, São Paulo — raio de 10km',
  availability: 'Seg a Sex, 08h–18h',
  rate: { amount: 'R$ 35', unit: '/hora' },
};

export const MOCK_REVIEWS: MockReview[] = [
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
  {
    id: '3',
    author: 'Fernanda Costa',
    rating: 4,
    comment: 'Boa comunicação durante todo o atendimento.',
    date: '28/07',
  },
];
