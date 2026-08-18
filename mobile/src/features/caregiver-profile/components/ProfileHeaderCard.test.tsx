import { render, screen } from '@testing-library/react-native';
import { ProfileHeaderCard } from './ProfileHeaderCard';

describe('ProfileHeaderCard', () => {
  it('mostra nome, nota e número de avaliações', async () => {
    await render(
      <ProfileHeaderCard
        name="Maria Silva"
        initials="MS"
        verified
        topRated
        rating={4.8}
        reviewCount={23}
      />,
    );

    expect(screen.getByText('Maria Silva')).toBeTruthy();
    expect(screen.getByText('4.8')).toBeTruthy();
    expect(screen.getByText('(23 avaliações)')).toBeTruthy();
  });

  it('mostra os selos de verificado e mais bem avaliado quando true', async () => {
    await render(
      <ProfileHeaderCard
        name="Maria Silva"
        initials="MS"
        verified
        topRated
        rating={4.8}
        reviewCount={23}
      />,
    );

    expect(screen.getByText('Verificado')).toBeTruthy();
    expect(screen.getByText('Mais bem avaliado')).toBeTruthy();
  });

  it('esconde os selos quando false', async () => {
    await render(
      <ProfileHeaderCard
        name="Maria Silva"
        initials="MS"
        verified={false}
        topRated={false}
        rating={4.8}
        reviewCount={23}
      />,
    );

    expect(screen.queryByText('Verificado')).toBeNull();
    expect(screen.queryByText('Mais bem avaliado')).toBeNull();
  });
});
