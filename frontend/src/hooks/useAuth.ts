import { authService } from '@/services/authService';
import { useEffect, useState } from 'react';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshStatus: {
    isScheduled: boolean;
    timeUntilRefresh: number;
  };
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [refreshStatus, setRefreshStatus] = useState({
    isScheduled: false,
    timeUntilRefresh: 0
  });

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
      await authService.login({ email, password });
      setIsAuthenticated(true);
      
      // Get user data from localStorage since login stores it there
      const userData = authService.getUser();
      setUser(userData);
      
      // Update refresh status after successful login
      updateRefreshStatus();
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
      // Silently handle logout errors
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setRefreshStatus({ isScheduled: false, timeUntilRefresh: 0 });
      setIsLoading(false);
    }
  };

  // Update refresh status
  const updateRefreshStatus = () => {
    const status = authService.getRefreshStatus();
    setRefreshStatus(status);
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Set up token refresh monitoring and handle refresh events
  useEffect(() => {
    if (!isAuthenticated) return;

    // Start proactive refresh for authenticated users
    authService.scheduleProactiveRefresh();
    updateRefreshStatus();

    // Listen for token refresh failure events
    const handleRefreshFailure = () => {
      setIsAuthenticated(false);
      setUser(null);
      setRefreshStatus({ isScheduled: false, timeUntilRefresh: 0 });
    };

    // Add event listener for refresh failures
    window.addEventListener('tokenRefreshFailed', handleRefreshFailure as EventListener);

    // Periodically update refresh status (every 30 seconds)
    const statusInterval = setInterval(updateRefreshStatus, 30000);

    return () => {
      window.removeEventListener('tokenRefreshFailed', handleRefreshFailure as EventListener);
      clearInterval(statusInterval);
    };
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth,
    refreshStatus,
  };
};
