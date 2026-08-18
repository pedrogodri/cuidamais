import { fireEvent, render, screen } from '@testing-library/react-native';
import { ProfileSwitcherDropdown } from './ProfileSwitcherDropdown';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';

describe('ProfileSwitcherDropdown', () => {
  beforeEach(() => {
    useActiveProfileStore.getState().clearActiveProfile();
  });

  it('mostra um texto de escolher perfil quando nenhum perfil está ativo', async () => {
    await render(<ProfileSwitcherDropdown />);
    expect(screen.getByText('Escolher perfil')).toBeTruthy();
  });

  it('mostra o label do perfil ativo quando fechado', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'family', id: 'preview-family' });
    await render(<ProfileSwitcherDropdown />);
    expect(screen.getByText('Responsável')).toBeTruthy();
  });

  it('ao abrir, lista só os perfis vinculados à conta, não os três', async () => {
    await render(<ProfileSwitcherDropdown />);

    await fireEvent.press(screen.getByRole('button'));

    expect(screen.getByRole('radio', { name: 'Cuidador' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Responsável' })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: 'Pessoa cuidada' })).toBeNull();
  });

  it('ativa o perfil escolhido no store e fecha a lista ao tocar numa opção', async () => {
    await render(<ProfileSwitcherDropdown />);

    await fireEvent.press(screen.getByRole('button'));
    await fireEvent.press(screen.getByRole('radio', { name: 'Cuidador' }));

    expect(useActiveProfileStore.getState().activeProfile?.type).toBe('caregiver');
    expect(screen.queryByRole('radio', { name: 'Cuidador' })).toBeNull();
  });

  it('fecha a lista ao tocar fora, sem trocar o perfil ativo', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'family', id: 'preview-family' });
    await render(<ProfileSwitcherDropdown />);

    await fireEvent.press(screen.getByRole('button'));
    await fireEvent.press(screen.getByLabelText('Fechar seletor de perfil'));

    expect(screen.queryByRole('radio', { name: 'Cuidador' })).toBeNull();
    expect(useActiveProfileStore.getState().activeProfile?.type).toBe('family');
  });
});
