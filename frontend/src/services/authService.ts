import axios from 'axios';

const API_BASE_URL = 'http://localhost:5254';

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
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
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
});

export const authService = {
  setAccessToken(token: string) {
    currentAccessToken = token;
    localStorage.setItem('accessToken', token);
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
  },

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await authApi.post('/auth/login', loginData);
    const { accessToken } = response.data;
    
    if (accessToken) {
      this.setAccessToken(accessToken);
    }
    
    return response.data;
  },

  async register(registerData: RegisterRequest) {
    const response = await authApi.post('/auth/register', registerData);
    return response.data;
  },

  async refreshToken(): Promise<string> {
    try {
      const response = await authApi.post('/auth/refresh-token');
      const { accessToken } = response.data;
      
      if (accessToken) {
        this.setAccessToken(accessToken);
        return accessToken;
      }
      
      throw new Error('No access token received');
    } catch (error) {
      this.clearAccessToken();
      throw error;
    }
  },

  async logout() {
    try {
      await authApi.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAccessToken();
      localStorage.removeItem('user');
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
