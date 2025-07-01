import { getTimeUntilExpiration, isTokenExpired } from '@/lib/tokenUtils';
import axios from 'axios';
import { clearGlobalTokenManager, getGlobalTokenManager } from './tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// Token management
let currentAccessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  
  failedQueue = [];
};

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
    'credential': 'include', // Ensure credentials are sent with requests
  },
});

export const authService = {
  setAccessToken(token: string) {
    currentAccessToken = token;
    localStorage.setItem('accessToken', token);
    
    // Schedule proactive refresh when token is set
    this.scheduleProactiveRefresh();
  },

  getAccessToken(): string | null {
    if (!currentAccessToken) {
      currentAccessToken = localStorage.getItem('accessToken');
    }
    return currentAccessToken;
  },

  clearAccessToken() {
    currentAccessToken = null;
    localStorage.removeItem('accessToken');
    
    // Clear any scheduled refresh
    this.clearProactiveRefresh();
  },

  // Schedule proactive token refresh
  scheduleProactiveRefresh() {
    try {
      const tokenManager = getGlobalTokenManager(
        async () => {
          await this.refreshToken();
        },
        () => this.getAccessToken()
      );
      tokenManager.scheduleProactiveRefresh();
    } catch (error) {
      // Silently handle scheduling errors
    }
  },

  // Clear proactive refresh timer
  clearProactiveRefresh() {
    try {
      clearGlobalTokenManager();
    } catch (error) {
      // Silently handle cleanup errors
    }
  },

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await authApi.post('/api/auth/login', loginData);
    const responseData = response.data;
    
    if (responseData.accessToken) {
      this.setAccessToken(responseData.accessToken);
    }
    
    // Extract user data from the flat response structure
    if (responseData.id && responseData.firstName && responseData.lastName && responseData.email) {
      const userData = {
        id: responseData.id,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        email: responseData.email
      };
      this.setUser(userData);
    }
    
    return responseData;
  },

  async register(registerData: RegisterRequest) {
    const response = await authApi.post('/api/auth/register', registerData);
    return response.data;
  },

  async refreshToken(): Promise<string> {
    try {
      const response = await authApi.post('/api/auth/refresh-token');
      const { accessToken } = response.data;
      
      if (accessToken) {
        this.setAccessToken(accessToken);
        return accessToken;
      }
      
      throw new Error('No access token received from refresh endpoint');
    } catch (error: any) {
      // Clear the invalid token
      this.clearAccessToken();
      
      // If it's a 401 or 403, it means refresh token is invalid/expired
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Refresh token invalid or expired');
      }
      
      // If it's a 400, it's likely a validation error
      if (error.response?.status === 400) {
        throw new Error('Refresh token expired or revoked');
      }
      
      throw error;
    }
  },

  // Check if current token is expired or needs refresh
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    return isTokenExpired(token);
  },

  // Get time until current token expires (in milliseconds)
  getTimeUntilTokenExpires(): number {
    const token = this.getAccessToken();
    if (!token) return 0;
    return getTimeUntilExpiration(token);
  },

  // Check if user is authenticated and auto-refresh if needed
  async checkAuthStatus(): Promise<boolean> {
    const token = this.getAccessToken();
    
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    if (this.isTokenExpired()) {
      try {
        await this.refreshToken();
        return true;
      } catch (refreshError: any) {
        // If refresh failed due to invalid/expired refresh token, clear everything
        if (refreshError.message?.includes('invalid') || 
            refreshError.message?.includes('expired') ||
            refreshError.message?.includes('revoked')) {
          this.clearAccessToken();
          localStorage.removeItem('user');
        }
        
        return false;
      }
    }
    
    return true;
  },

  // Get user info if available
  getUser() {
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  },

  // Set user info
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  async logout() {
    try {
      await authApi.post('/api/auth/logout');
    } catch (error) {
      // Silently handle logout errors
    } finally {
      this.clearAccessToken();
      localStorage.removeItem('user');
    }
  },

  // Get refresh status information
  getRefreshStatus() {
    try {
      const tokenManager = getGlobalTokenManager();
      return {
        isScheduled: tokenManager.isRefreshScheduled(),
        timeUntilRefresh: tokenManager.getTimeUntilRefresh()
      };
    } catch {
      return {
        isScheduled: false,
        timeUntilRefresh: 0
      };
    }
  }
};

// Request interceptor to add access token
authApi.interceptors.request.use(
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
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return authApi(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await authService.refreshToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authService.clearAccessToken();
        // Redirect to login or emit event
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
