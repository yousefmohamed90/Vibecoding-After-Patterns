import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthToken } from '../services/security/TokenManager';
import { useServices } from './ServiceContext';

interface AuthContextType {
  user: AuthToken | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'STUDENT' | 'ADMIN') => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { authService } = useServices();
  const [user, setUser] = useState<AuthToken | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      const userData = JSON.parse(storedUser);
      if (authService.validateToken(storedToken)) {
        setUser(userData);
      } else {
        // Token expired
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, [authService]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const authToken = authService.authenticate(email, password);
      setUser(authToken);

      // Store in localStorage
      localStorage.setItem('auth_token', authToken.token);
      localStorage.setItem('auth_user', JSON.stringify(authToken));

      console.log('✅ Auth: User logged in successfully');
    } catch (error) {
      console.error('❌ Auth: Login failed', error);
      throw error;
    }
  };

  const logout = (): void => {
    if (user) {
      authService.logout(user.token);
    }

    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    console.log('✅ Auth: User logged out');
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'STUDENT' | 'ADMIN'
  ): Promise<void> => {
    try {
      authService.register({ name, email, password, role });
      console.log('✅ Auth: User registered successfully');

      // Auto-login after registration
      await login(email, password);
    } catch (error) {
      console.error('❌ Auth: Registration failed', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
