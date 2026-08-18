import { render, screen } from '@testing-library/react-native';
import { AboutSection } from './AboutSection';

describe('AboutSection', () => {
  it('mostra bio, especialidades e informações práticas', async () => {
    await render(
      <AboutSection
        bio="Cuidadora com foco em pacientes idosos."
        specialties={['Idosos', 'Pós-operatório']}
        experienceYears={6}
        region="Zona Sul, São Paulo"
        availability="Seg a Sex, 08h–18h"
        rate={{ amount: 'R$ 35', unit: '/hora' }}
      />,
    );

    expect(screen.getByText('Cuidadora com foco em pacientes idosos.')).toBeTruthy();
    expect(screen.getByText('Idosos')).toBeTruthy();
    expect(screen.getByText('Pós-operatório')).toBeTruthy();
    expect(screen.getByText('6 anos de experiência')).toBeTruthy();
    expect(screen.getByText('Zona Sul, São Paulo')).toBeTruthy();
    expect(screen.getByText('Seg a Sex, 08h–18h')).toBeTruthy();
    expect(screen.getByText('R$ 35/hora')).toBeTruthy();
  });
});
