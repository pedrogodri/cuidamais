import * as SecureStore from 'expo-secure-store';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from './AuthProvider';

jest.mock('expo-secure-store');

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
  });

  it('starts with no session and isLoading true, then false once checked', async () => {
    let resolveGetItem: (value: string | null) => void;
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(
      () =>
        new Promise<string | null>((resolve) => {
          resolveGetItem = resolve;
        }),
    );

    const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveGetItem(null);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.session).toBeNull();
  });

  it('treats a SecureStore read failure as logged out instead of hanging', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('keychain error'));

    const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.session).toBeNull();
  });

  it('signIn stores the token and updates session', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
    const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signIn({ token: 'tok-123' });
    });

    expect(result.current.session).toEqual({ token: 'tok-123' });
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', 'tok-123');
  });

  it('signOut clears the stored token and session', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
    const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signIn({ token: 'tok-123' });
    });
    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.session).toBeNull();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
  });
});
