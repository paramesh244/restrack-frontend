import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/constants/Storagekey';

interface AuthUser {
  user_id: string;
  email: string;
  name: string;
  is_email_verified: number;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    setUser(updated);
  };

  // hasPermission is a hook point for role-based access; defaults to true for any authenticated user
  const hasPermission = (_permission: string): boolean => {
    return !!token && !!user;
  };

  const isAuthenticated = !!token && !!user;

  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, updateUser, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
