import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { useAuth } from '@/app-providers/AuthProvider';
import Login from './login';

jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/app-providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

describe('Login', () => {
  const signIn = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    signIn.mockResolvedValue(undefined);
    (useAuth as jest.Mock).mockReturnValue({
      session: null,
      isLoading: false,
      signIn,
      signOut: jest.fn(),
    });
  });

  it('signs in and navigates to home when the form is valid', async () => {
    await render(<Login />);

    await fireEvent.changeText(screen.getByPlaceholderText('maria@email.com'), 'maria@email.com');
    await fireEvent.changeText(screen.getByPlaceholderText('Sua senha'), 'secret123');
    await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(signIn).toHaveBeenCalledWith({ token: expect.any(String) });
    expect(router.replace).toHaveBeenCalledWith('/(shared)/home');
  });

  it('does not sign in when the form is invalid', async () => {
    await render(<Login />);

    await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(signIn).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });
});
