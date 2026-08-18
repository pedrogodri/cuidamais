import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';
import Home from './home';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('Home', () => {
  beforeEach(() => {
    useActiveProfileStore.getState().clearActiveProfile();
  });

  it('mostra o atendimento em andamento e esconde o CTA de cuidador no modo Cuidador', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'caregiver', id: 'preview' });
    await render(<Home />);

    expect(screen.getByText('Atendimento em andamento')).toBeTruthy();
    expect(screen.queryByText('Quero ser cuidador')).toBeNull();
  });

  it('mostra o link do perfil público só no modo Cuidador, e navega ao tocar', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'caregiver', id: 'preview' });
    await render(<Home />);

    await fireEvent.press(screen.getByText('Ver meu perfil público'));
    expect(router.push).toHaveBeenCalledWith('/(caregiver)');
  });

  it('esconde o link do perfil público fora do modo Cuidador', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'family', id: 'preview' });
    await render(<Home />);

    expect(screen.queryByText('Ver meu perfil público')).toBeNull();
  });

  it('mostra os remédios de hoje sem a legenda "Cuidando de" no modo Pessoa cuidada', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'cared_person', id: 'preview' });
    await render(<Home />);

    expect(screen.getByText('Remédios de hoje')).toBeTruthy();
    expect(screen.queryByText(/Cuidando de:/)).toBeNull();
  });

  it('mostra a legenda "Cuidando de" no modo Responsável', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'family', id: 'preview' });
    await render(<Home />);

    expect(screen.getByText(/Cuidando de:/)).toBeTruthy();
  });

  it('mostra o estado vazio quando nenhum perfil está ativo', async () => {
    await render(<Home />);

    expect(screen.getByText('Escolha um modo acima para ver sua Home.')).toBeTruthy();
  });
});
