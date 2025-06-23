import { authService } from '@/services/authService';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const userData = response.user || response; // Adjust based on your API response structure
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await authService.register({ firstName, lastName, email, password });
    // After registration, you might want to automatically log in the user
    // or redirect them to login page - this depends on your backend behavior
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
