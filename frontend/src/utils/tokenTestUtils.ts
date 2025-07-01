/**
 * Development utilities for testing token refresh functionality
 */

import { authService } from '@/services/authService';

export const tokenTestUtils = {
  // Create a token that will expire in specified seconds
  createShortLivedToken(expirationInSeconds: number = 60): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      sub: 'test-user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expirationInSeconds,
      userId: 'test-user-id',
      email: 'test@example.com'
    };

    // Create a fake JWT (this won't work with the backend, just for testing expiration logic)
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = 'fake-signature';

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  },

  // Set a short-lived token for testing
  setShortLivedToken(expirationInSeconds: number = 60): void {
    const token = this.createShortLivedToken(expirationInSeconds);
    authService.setAccessToken(token);
  },

  // Get current token expiration info
  getTokenInfo(): {
    hasToken: boolean;
    isExpired: boolean;
    timeUntilExpiration: number;
    expirationDate: Date | null;
  } {
    const token = authService.getAccessToken();
    
    if (!token) {
      return {
        hasToken: false,
        isExpired: true,
        timeUntilExpiration: 0,
        expirationDate: null
      };
    }

    const isExpired = authService.isTokenExpired();
    const timeUntilExpiration = authService.getTimeUntilTokenExpires();
    
    let expirationDate: Date | null = null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      expirationDate = new Date(payload.exp * 1000);
    } catch (error) {
      // Silently handle token parsing errors
    }

    return {
      hasToken: true,
      isExpired,
      timeUntilExpiration,
      expirationDate
    };
  }
};

// Make it available globally in development
if (import.meta.env.DEV) {
  (window as any).tokenTestUtils = tokenTestUtils;
}
