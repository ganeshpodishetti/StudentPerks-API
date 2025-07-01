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
    console.log(`Token set to expire in ${expirationInSeconds} seconds`);
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
      console.error('Error parsing token:', error);
    }

    return {
      hasToken: true,
      isExpired,
      timeUntilExpiration,
      expirationDate
    };
  },

  // Log current refresh status
  logRefreshStatus(): void {
    const tokenInfo = this.getTokenInfo();
    const refreshStatus = authService.getRefreshStatus();
    
    console.group('🔐 Token Status');
    console.log('Has Token:', tokenInfo.hasToken);
    console.log('Is Expired:', tokenInfo.isExpired);
    console.log('Time Until Expiration:', Math.round(tokenInfo.timeUntilExpiration / 1000), 'seconds');
    console.log('Expiration Date:', tokenInfo.expirationDate?.toLocaleString());
    console.log('Refresh Scheduled:', refreshStatus.isScheduled);
    console.log('Time Until Refresh:', Math.round(refreshStatus.timeUntilRefresh / 1000), 'seconds');
    console.groupEnd();
  },

  // Diagnose authentication issues
  diagnoseProblem(): void {
    console.group('🔍 Authentication Diagnosis');
    
    // Check access token
    const accessToken = authService.getAccessToken();
    console.log('Access Token Present:', !!accessToken);
    
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const exp = new Date(payload.exp * 1000);
        const now = new Date();
        console.log('Access Token Expires:', exp.toLocaleString());
        console.log('Current Time:', now.toLocaleString());
        console.log('Token Expired:', exp <= now);
      } catch (e) {
        console.log('Access Token Parse Error:', e);
      }
    }
    
    // Check cookies
    const cookies = document.cookie;
    console.log('All Cookies:', cookies || 'None');
    
    const hasRefreshCookie = cookies.includes('refreshToken');
    console.log('Refresh Token Cookie Present:', hasRefreshCookie);
    
    // Check localStorage
    const user = localStorage.getItem('user');
    console.log('User Data in localStorage:', user ? 'Present' : 'None');
    
    // Check current URL and potential CORS issues
    console.log('Current Origin:', window.location.origin);
    console.log('API Base URL:', import.meta.env.VITE_API_URL || 'Not set');
    
    console.groupEnd();
  }
};

// Make it available globally in development
if (import.meta.env.DEV) {
  (window as any).tokenTestUtils = tokenTestUtils;
  console.log('🔧 Token test utilities available at window.tokenTestUtils');
}
