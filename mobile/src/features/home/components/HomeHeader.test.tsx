import { render, screen } from '@testing-library/react-native';
import { HomeHeader } from './HomeHeader';

describe('HomeHeader', () => {
  it('renderiza o nome recebido', async () => {
    await render(<HomeHeader name="Maria Silva" />);
    expect(screen.getByText('Maria Silva')).toBeTruthy();
  });

  it('renderiza as iniciais do nome no avatar', async () => {
    await render(<HomeHeader name="Maria Silva" />);
    expect(screen.getByText('MS')).toBeTruthy();
  });

  it('expõe o sino de notificação como botão acessível', async () => {
    await render(<HomeHeader name="Maria Silva" />);
    expect(screen.getByLabelText('Notificações')).toBeTruthy();
  });
});
