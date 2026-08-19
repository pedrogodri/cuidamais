import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import Buscar from './buscar';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('Buscar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('mostra todos os cuidadores mockados por padrão', async () => {
    await render(<Buscar />);

    expect(screen.getByText('Maria Silva')).toBeTruthy();
    expect(screen.getByText('João Santos')).toBeTruthy();
    expect(screen.getByText('Ana Paula Reis')).toBeTruthy();
  });

  it('filtra por nome ao digitar na busca', async () => {
    await render(<Buscar />);

    await fireEvent.changeText(screen.getByLabelText('Buscar cuidador'), 'joão');

    expect(screen.getByText('João Santos')).toBeTruthy();
    expect(screen.queryByText('Maria Silva')).toBeNull();
  });

  it('filtra por especialidade ao tocar num chip', async () => {
    await render(<Buscar />);

    await fireEvent.press(screen.getByText('Pediatria'));

    expect(screen.getByText('Ana Paula Reis')).toBeTruthy();
    expect(screen.queryByText('Maria Silva')).toBeNull();
  });

  it('mostra estado vazio quando nenhum cuidador bate com o filtro', async () => {
    await render(<Buscar />);

    await fireEvent.changeText(screen.getByLabelText('Buscar cuidador'), 'zzzzz');

    expect(screen.getByText('Nenhum cuidador encontrado.')).toBeTruthy();
  });

  it('navega pro perfil do cuidador certo ao tocar num card', async () => {
    await render(<Buscar />);

    await fireEvent.press(screen.getByText('Maria Silva'));

    expect(router.push).toHaveBeenCalledWith('/(shared)/caregiver/1');
  });
});
