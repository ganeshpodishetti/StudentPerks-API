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

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for HTTP-only cookies
});

export const authService = {
  async login(loginData: LoginRequest) {
    const response = await authApi.post('/auth/login', loginData);
    return response.data;
  },

  async register(registerData: RegisterRequest) {
    const response = await authApi.post('/auth/register', registerData);
    return response.data;
  },

  async refreshToken(refreshTokenData: RefreshTokenRequest) {
    const response = await authApi.post('/auth/refresh-token', refreshTokenData);
    return response.data;
  },

  async logout() {
    // Since the refresh token is stored in HTTP-only cookie,
    // we can clear it by making a request to logout endpoint
    // (you might need to implement this on your backend)
    // For now, we'll just clear any local storage if needed
    localStorage.removeItem('user');
  }
};
