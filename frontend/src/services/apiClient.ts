import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5254';

// Create a shared API client for authenticated requests
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add access token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('API Client: Attempting to refresh token due to 401 error...');
        const newToken = await authService.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        console.log('API Client: Token refreshed successfully, retrying request...');
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('API Client: Token refresh failed:', refreshError);
        authService.clearAccessToken();
        
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Create a public API client for requests that don't need authentication
export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Still include cookies for refresh token
});

export default apiClient;
