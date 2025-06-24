/**
 * Token utility functions for JWT handling
 */

// Decode JWT payload without verification (for client-side use only)
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Check if token is expired (with 30 second buffer)
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 30; // 30 second buffer
    
    return decoded.exp <= (currentTime + bufferTime);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Get token expiration time
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

// Calculate time until token expires (in milliseconds)
export const getTimeUntilExpiration = (token: string): number => {
  try {
    const expiration = getTokenExpiration(token);
    if (!expiration) {
      return 0;
    }
    
    const now = new Date();
    return Math.max(0, expiration.getTime() - now.getTime());
  } catch (error) {
    console.error('Error calculating time until expiration:', error);
    return 0;
  }
};
