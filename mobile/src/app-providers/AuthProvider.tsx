import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const TOKEN_KEY = 'auth_token';

export interface AuthSession {
  token: string;
}

interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  signIn: (session: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY)
      .then((token) => {
        setSession(token ? { token } : null);
        setIsLoading(false);
      })
      .catch(() => {
        setSession(null);
        setIsLoading(false);
      });
  }, []);

  async function signIn(newSession: AuthSession) {
    await SecureStore.setItemAsync(TOKEN_KEY, newSession.token);
    setSession(newSession);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
