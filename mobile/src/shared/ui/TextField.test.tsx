import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders the label as visible text, not only a placeholder', async () => {
    await render(<TextField label="E-mail" placeholder="seu@email.com" />);
    expect(screen.getByText('E-mail')).toBeTruthy();
  });

  it('shows the error message alongside the field when present', async () => {
    await render(<TextField label="Senha" error="Senha muito curta" />);
    expect(screen.getByText('Senha muito curta')).toBeTruthy();
  });

  it('masks password input by default and reveals it on toggle', async () => {
    await render(<TextField label="Senha" isPassword />);
    expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(true);

    await fireEvent.press(screen.getByLabelText('Mostrar senha'));
    expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(false);
  });
});
