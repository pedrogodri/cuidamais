import { render, screen } from '@testing-library/react-native';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';
import Agenda from './agenda';

describe('Agenda', () => {
  beforeEach(() => {
    useActiveProfileStore.getState().clearActiveProfile();
  });

  it('mostra "Agenda" no modo Cuidador', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'caregiver', id: 'preview' });
    await render(<Agenda />);

    expect(screen.getByText('Agenda (placeholder)')).toBeTruthy();
  });

  it('mostra "Remédios e agenda" no modo Responsável', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'family', id: 'preview' });
    await render(<Agenda />);

    expect(screen.getByText('Remédios e agenda (placeholder)')).toBeTruthy();
  });

  it('mostra "Remédios e agenda" no modo Pessoa cuidada', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'cared_person', id: 'preview' });
    await render(<Agenda />);

    expect(screen.getByText('Remédios e agenda (placeholder)')).toBeTruthy();
  });
});
