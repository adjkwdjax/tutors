'use client';

import { createContext, memo, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProviderComponent({ children }: any) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const contextValue = useMemo(() => ({ user, loading }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const AuthProvider = memo(AuthProviderComponent);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};