import { AuthProvider } from '@/contexts/AuthContext';
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock auth service for testing
const mockAuthService = {
  getAccessToken: () => 'mock-token',
  getUser: () => ({ id: '1', firstName: 'Test', lastName: 'User', email: 'test@example.com' }),
  checkAuthStatus: () => Promise.resolve(true),
  login: () => Promise.resolve({}),
  logout: () => Promise.resolve(),
  clearAccessToken: () => {},
  getTimeUntilTokenExpires: () => 3600000,
};

// Mock the auth service module
vi.mock('@/services/authService', () => ({
  authService: mockAuthService,
}));

// Test providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };
