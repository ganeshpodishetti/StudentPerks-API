import { authService } from '@/services/authService';
import { useEffect, useState } from 'react';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  // Check authentication status on mount and periodically
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const isAuth = await authService.checkAuthStatus();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const userData = authService.getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Set up smart token refresh based on token expiration
  useEffect(() => {
    if (!isAuthenticated) return;

    const setupTokenRefresh = () => {
      const timeUntilExpiration = authService.getTimeUntilTokenExpires();
      
      if (timeUntilExpiration <= 0) {
        // Token already expired, check auth status
        checkAuth();
        return;
      }

      // Set refresh to happen 30 seconds before expiration
      const refreshTime = Math.max(timeUntilExpiration - 30000, 10000);
      
      console.log(`useAuth: Token will be refreshed in ${Math.round(refreshTime / 1000)} seconds`);

      const refreshTimeout = setTimeout(async () => {
        try {
          await authService.refreshToken();
          console.log('useAuth: Token refreshed proactively');
          setupTokenRefresh(); // Setup next refresh
        } catch (error) {
          console.log('useAuth: Proactive token refresh failed');
          setIsAuthenticated(false);
          setUser(null);
        }
      }, refreshTime);

      return refreshTimeout;
    };

    const refreshTimeout = setupTokenRefresh();

    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth,
  };
};
