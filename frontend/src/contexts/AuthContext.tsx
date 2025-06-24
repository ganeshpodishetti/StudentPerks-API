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

  // Check authentication status and auto-refresh if needed
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // First check if we have stored token and user data
      const token = authService.getAccessToken();
      const userData = authService.getUser();
      
      if (token && userData) {
        // We have both token and user data, set user as authenticated
        setUser(userData);
      } else {
        setUser(null);
        // Clear any stale data
        localStorage.removeItem('user');
        authService.clearAccessToken();
      }
    } catch (error) {
      console.error('AuthContext: Auth status check failed:', error);
      setUser(null);
      localStorage.removeItem('user');
      authService.clearAccessToken();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial auth check
    checkAuthStatus();
  }, []);

  // Set up smart token refresh based on token expiration
  useEffect(() => {
    if (!user) return;

    const setupTokenRefresh = () => {
      const timeUntilExpiration = authService.getTimeUntilTokenExpires();
      
      if (timeUntilExpiration <= 0) {
        // Token already expired, try to refresh immediately
        console.log('AuthContext: Token appears expired, but keeping user logged in for now');
        // authService.refreshToken().catch(() => {
        //   console.log('AuthContext: Token refresh failed');
        //   setUser(null);
        //   localStorage.removeItem('user');
        //   authService.clearAccessToken();
        // });
        return;
      }

      // Disabled proactive token refresh for now due to backend issues
      // const refreshTime = Math.max(timeUntilExpiration - 30000, 10000); // At least 10 seconds
      
      // console.log(`AuthContext: Token will be refreshed in ${Math.round(refreshTime / 1000)} seconds`);

      // const refreshTimeout = setTimeout(async () => {
      //   try {
      //     await authService.refreshToken();
      //     console.log('AuthContext: Token refreshed proactively');
      //     // Setup next refresh
      //     setupTokenRefresh();
      //   } catch (error) {
      //     console.log('AuthContext: Proactive token refresh failed');
      //     setUser(null);
      //     localStorage.removeItem('user');
      //     authService.clearAccessToken();
      //   }
      // }, refreshTime);

      // return refreshTimeout;
    };

    setupTokenRefresh();

    return () => {
      // Cleanup function (currently no timeout to clear since refresh is disabled)
    };
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      // Extract user data from the flat response structure
      const userData = {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email
      };
      
      setUser(userData);
      
      // Wait a bit to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      // Clear any existing tokens on login failure
      authService.clearAccessToken();
      localStorage.removeItem('user');
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await authService.register({ firstName, lastName, email, password });
    // After registration, you might want to automatically log in the user
    // or redirect them to login page - this depends on your backend behavior
    return response;
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && !!authService.getAccessToken(),
    login,
    register,
    logout,
  };

  // Debug auth state (reduced logging)
  useEffect(() => {
    console.log('AuthContext: Auth state updated', {
      isAuthenticated: !!user && !!authService.getAccessToken(),
      hasUser: !!user,
      hasToken: !!authService.getAccessToken()
    });
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
