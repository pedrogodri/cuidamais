import { fireEvent, render, screen } from '@testing-library/react-native';
import { ProfileModeSwitcher } from './ProfileModeSwitcher';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';

describe('ProfileModeSwitcher', () => {
  beforeEach(() => {
    useActiveProfileStore.getState().clearActiveProfile();
  });

  it('renderiza os três modos de perfil', async () => {
    await render(<ProfileModeSwitcher />);
    expect(screen.getByText('Cuidador')).toBeTruthy();
    expect(screen.getByText('Pessoa cuidada')).toBeTruthy();
    expect(screen.getByText('Responsável')).toBeTruthy();
  });

  it('ativa o perfil Cuidador no store ao tocar no chip', async () => {
    await render(<ProfileModeSwitcher />);
    await fireEvent.press(screen.getByText('Cuidador'));
    expect(useActiveProfileStore.getState().activeProfile?.type).toBe('caregiver');
  });

  it('marca o chip do perfil ativo como selecionado', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'family', id: 'preview' });
    await render(<ProfileModeSwitcher />);
    expect(screen.getByRole('radio', { name: /Responsável/ })).toHaveProp('accessibilityState', {
      selected: true,
    });
  });
});
