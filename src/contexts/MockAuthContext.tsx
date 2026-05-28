import React, { createContext, useContext } from 'react';

export type AppRole = 'Super Admin' | 'Engineer';

interface MockAuthContextType {
  role: AppRole;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

/*
 * TODO: Real API binding
 * import { apiService } from '@/lib/api';
 * const response = await apiService.get({ endpoint: '/auth/me' });
 * Replace MOCK_ROLE with response.data.role from the authenticated user's profile.
 */
const MOCK_ROLE: AppRole = 'Super Admin';

export const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <MockAuthContext.Provider value={{ role: MOCK_ROLE }}>
    {children}
  </MockAuthContext.Provider>
);

export const useMockAuth = (): MockAuthContextType => {
  const ctx = useContext(MockAuthContext);
  if (!ctx) throw new Error('useMockAuth must be used within MockAuthProvider');
  return ctx;
};

export default MockAuthContext;
