'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  role: 'field_officer' | 'farmer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    // Mock: any email logs in as field_officer
    setUser({ email, role: 'field_officer' });
  };

  const register = (email: string, _password: string) => {
    setUser({ email, role: 'field_officer' });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}