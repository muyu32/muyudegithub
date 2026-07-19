import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { getCurrentUser, loginByWechat, loginByAccount, registerByAccount, logout } from '@/services/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginByWechat: () => Promise<User>;
  loginByAccount: (username: string, password: string) => Promise<User>;
  registerByAccount: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      setUser(current);
    } catch (error) {
      console.error('[Auth] Failed to get current user:', error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const handleLoginByWechat = useCallback(async () => {
    const loggedIn = await loginByWechat();
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const handleLoginByAccount = useCallback(async (username: string, password: string) => {
    const loggedIn = await loginByAccount(username, password);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const handleRegisterByAccount = useCallback(async (username: string, password: string) => {
    const registered = await registerByAccount(username, password);
    setUser(registered);
    return registered;
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginByWechat: handleLoginByWechat,
        loginByAccount: handleLoginByAccount,
        registerByAccount: handleRegisterByAccount,
        logout: handleLogout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useCurrentUserId(): string | undefined {
  const { user } = useAuth();
  return user?._id;
}
