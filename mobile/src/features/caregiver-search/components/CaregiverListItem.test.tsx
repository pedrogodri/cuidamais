import { fireEvent, render, screen } from '@testing-library/react-native';
import { CaregiverListItem } from './CaregiverListItem';
import type { CaregiverSummary } from '@/features/caregiver-search/mockCaregivers';

const CAREGIVER: CaregiverSummary = {
  id: '1',
  name: 'Maria Silva',
  initials: 'MS',
  specialties: ['Idosos', 'Pós-operatório'],
  region: 'Zona Sul, São Paulo',
  rating: 4.8,
  reviewCount: 23,
  rate: { amount: 'R$ 35', unit: '/hora' },
  verified: true,
  topRated: true,
};

describe('CaregiverListItem', () => {
  it('mostra nome, nota, especialidades, região e valor', async () => {
    await render(<CaregiverListItem caregiver={CAREGIVER} onPress={jest.fn()} />);

    expect(screen.getByText('Maria Silva')).toBeTruthy();
    expect(screen.getByText('4.8')).toBeTruthy();
    expect(screen.getByText('Idosos, Pós-operatório')).toBeTruthy();
    expect(screen.getByText('Zona Sul, São Paulo')).toBeTruthy();
    expect(screen.getByText('R$ 35/hora')).toBeTruthy();
  });

  it('chama onPress ao tocar no card', async () => {
    const onPress = jest.fn();
    await render(<CaregiverListItem caregiver={CAREGIVER} onPress={onPress} />);

    await fireEvent.press(screen.getByText('Maria Silva'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
