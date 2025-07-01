/**
 * Enhanced token management service with proactive refresh
 */

import { getTimeUntilExpiration } from '@/lib/tokenUtils';

export interface TokenManager {
  scheduleProactiveRefresh: () => void;
  clearRefreshTimer: () => void;
  getTimeUntilRefresh: () => number;
  isRefreshScheduled: () => boolean;
}

class TokenManagerImpl implements TokenManager {
  private refreshTimeoutId: number | null = null;
  private refreshCallback: (() => Promise<void>) | null = null;
  private tokenProvider: (() => string | null) | null = null;
  private isActive = false;
  
  // Buffer time before expiration to trigger refresh (in milliseconds)
  private readonly REFRESH_BUFFER_MS = 60000; // 1 minute before expiration
  private readonly MIN_REFRESH_INTERVAL_MS = 10000; // Minimum 10 seconds
  private readonly MAX_REFRESH_INTERVAL_MS = 300000; // Maximum 5 minutes

  constructor(refreshCallback: () => Promise<void>, tokenProvider?: () => string | null) {
    this.refreshCallback = refreshCallback;
    this.tokenProvider = tokenProvider || (() => localStorage.getItem('accessToken'));
  }

  scheduleProactiveRefresh(): void {
    if (!this.refreshCallback) {
      return;
    }

    // Clear any existing timer
    this.clearRefreshTimer();

    const timeUntilExpiration = this.getTimeUntilTokenExpires();
    
    if (timeUntilExpiration <= 0) {
      this.executeRefresh();
      return;
    }

    // Calculate when to refresh (buffer time before expiration)
    const refreshTime = Math.max(
      timeUntilExpiration - this.REFRESH_BUFFER_MS,
      this.MIN_REFRESH_INTERVAL_MS
    );

    // Cap the refresh time to prevent extremely long delays
    const actualRefreshTime = Math.min(refreshTime, this.MAX_REFRESH_INTERVAL_MS);
    
    this.refreshTimeoutId = setTimeout(() => {
      this.executeRefresh();
    }, actualRefreshTime) as unknown as number;
    
    this.isActive = true;
  }

  private async executeRefresh(): Promise<void> {
    if (!this.refreshCallback) return;
    
    try {
      await this.refreshCallback();
      
      // Schedule the next refresh
      this.scheduleProactiveRefresh();
    } catch (error: any) {
      // Check if it's a token expiration/invalid token error
      const isTokenError = error.message?.includes('invalid') || 
                          error.message?.includes('expired') ||
                          error.message?.includes('revoked');
      
      if (isTokenError) {
        this.clearRefreshTimer();
        
        // Emit a custom event that components can listen to
        window.dispatchEvent(new CustomEvent('tokenRefreshFailed', { 
          detail: { error: error.message || 'Token refresh failed' } 
        }));
      } else {
        // For network or other temporary errors, try again in 30 seconds
        this.refreshTimeoutId = setTimeout(() => {
          this.executeRefresh();
        }, 30000) as unknown as number;
      }
    }
  }

  clearRefreshTimer(): void {
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId);
      this.refreshTimeoutId = null;
    }
    this.isActive = false;
  }

  getTimeUntilRefresh(): number {
    if (!this.isActive) return 0;
    
    const timeUntilExpiration = this.getTimeUntilTokenExpires();
    return Math.max(timeUntilExpiration - this.REFRESH_BUFFER_MS, 0);
  }

  isRefreshScheduled(): boolean {
    return this.isActive && this.refreshTimeoutId !== null;
  }

  private getTimeUntilTokenExpires(): number {
    const token = this.getAccessToken();
    if (!token) return 0;
    return getTimeUntilExpiration(token);
  }

  private getAccessToken(): string | null {
    return this.tokenProvider ? this.tokenProvider() : null;
  }
}

// Factory function to create token manager instances
export const createTokenManager = (
  refreshCallback: () => Promise<void>, 
  tokenProvider?: () => string | null
): TokenManager => {
  return new TokenManagerImpl(refreshCallback, tokenProvider);
};

// Singleton instance for global use
let globalTokenManager: TokenManager | null = null;

export const getGlobalTokenManager = (
  refreshCallback?: () => Promise<void>,
  tokenProvider?: () => string | null
): TokenManager => {
  if (!globalTokenManager && refreshCallback) {
    globalTokenManager = createTokenManager(refreshCallback, tokenProvider);
  }
  
  if (!globalTokenManager) {
    throw new Error('TokenManager not initialized. Call with refreshCallback first.');
  }
  
  return globalTokenManager;
};

export const clearGlobalTokenManager = (): void => {
  if (globalTokenManager) {
    globalTokenManager.clearRefreshTimer();
    globalTokenManager = null;
  }
};
