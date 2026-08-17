import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders the given label', async () => {
    await render(<Button label="Entrar" onPress={() => {}} />);
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    await render(<Button label="Continuar" onPress={onPress} />);
    await fireEvent.press(screen.getByText('Continuar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button label="Continuar" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByText('Continuar'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('marks the accessibility state as disabled', async () => {
    await render(<Button label="Continuar" onPress={() => {}} disabled />);
    expect(screen.getByRole('button')).toHaveProp('accessibilityState', { disabled: true });
  });
});
