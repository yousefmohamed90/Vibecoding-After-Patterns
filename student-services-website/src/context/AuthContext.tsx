import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthToken {
  token: string;
  userId: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthToken | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'STUDENT' | 'ADMIN') => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthToken | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Fetch existing users from localStorage
      const usersData = localStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Find user by email
      const foundUser = users.find((u: any) => u.email === email);
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Simple password check (in real app would use bcrypt verification)
      if (foundUser.passwordHash !== password) {
        throw new Error('Invalid email or password');
      }

      const authToken: AuthToken = {
        token: `token_${Date.now()}`,
        userId: foundUser.studentID || foundUser.adminID,
        email: foundUser.email,
        role: foundUser.role
      };

      setUser(authToken);
      localStorage.setItem('auth_token', authToken.token);
      localStorage.setItem('auth_user', JSON.stringify(authToken));
      
      console.log('✅ Auth: User logged in successfully');
    } catch (error) {
      console.error('❌ Auth: Login failed', error);
      throw error;
    }
  };

  const logout = (): void => {
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
      // Fetch existing users
      const usersData = localStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser = {
        [role === 'STUDENT' ? 'studentID' : 'adminID']: `${role.toLowerCase()}_${Date.now()}`,
        name,
        email,
        passwordHash: password,
        role,
        registrationDate: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
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
