import { render, screen } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders the given label', async () => {
    await render(<Button label="Entrar" onPress={() => {}} />);
    expect(screen.getByText('Entrar')).toBeTruthy();
  });
});
