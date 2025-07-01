import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/contexts/ErrorContext';
import { useDealsQuery } from '@/hooks/queries/useDealsQuery';

export const useAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { showError, showSuccess } = useErrorHandler();

  // React Query hooks
  const { data: deals = [], isLoading } = useDealsQuery();

  // Test connectivity function
  const testConnectivity = async () => {
    try {
      console.log('Testing backend connectivity...');
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5254';
      
      // Test 1: Basic API connection
      const response = await fetch(API_BASE_URL + '/api/deals', {
        credentials: 'include',
        method: 'GET'
      });
      
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      
      if (response.status === 401) {
        showError("You need to be logged in to access admin features", "Authentication Issue");
        return;
      }
      
      if (response.status === 200) {
        showSuccess("Successfully connected to backend API", "Connectivity Test Passed");
      } else {
        showError(`Unexpected response status: ${response.status}`, "Connectivity Issue");
      }
    } catch (error: any) {
      console.error('Connectivity test failed:', error);
      showError(error.message || "Could not connect to backend API", "Connection Failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    deals,
    isLoading,
    user,
    handleLogout,
    testConnectivity
  };
};
