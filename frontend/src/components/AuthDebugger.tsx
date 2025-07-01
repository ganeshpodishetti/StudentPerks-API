import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import React, { useEffect, useState } from 'react';

interface AuthDebuggerProps {
  className?: string;
}

interface DebugInfo {
  hasAccessToken: boolean;
  accessTokenExpired: boolean;
  timeUntilExpiration: number;
  hasRefreshCookie: boolean;
  hasUserData: boolean;
  isAuthenticated: boolean;
  refreshScheduled: boolean;
  timeUntilRefresh: number;
  lastError?: string;
}

export const AuthDebugger: React.FC<AuthDebuggerProps> = ({ className = '' }) => {
  const { isAuthenticated, refreshStatus } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const updateDebugInfo = () => {
    const accessToken = authService.getAccessToken();
    const cookies = document.cookie;
    const userData = localStorage.getItem('user');

    const info: DebugInfo = {
      hasAccessToken: !!accessToken,
      accessTokenExpired: authService.isTokenExpired(),
      timeUntilExpiration: authService.getTimeUntilTokenExpires(),
      hasRefreshCookie: cookies.includes('refreshToken'),
      hasUserData: !!userData,
      isAuthenticated,
      refreshScheduled: refreshStatus.isScheduled,
      timeUntilRefresh: refreshStatus.timeUntilRefresh
    };

    setDebugInfo(info);
  };

  const testRefresh = async () => {
    try {
      await authService.refreshToken();
      updateDebugInfo();
    } catch (error: any) {
      setDebugInfo(prev => prev ? { ...prev, lastError: error.message } : null);
    }
  };

  const clearTokens = () => {
    authService.clearAccessToken();
    localStorage.removeItem('user');
    updateDebugInfo();
  };

  useEffect(() => {
    if (isVisible) {
      updateDebugInfo();
      const interval = setInterval(updateDebugInfo, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible, isAuthenticated, refreshStatus]);

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-blue-700"
      >
        🔐 Auth Debug
      </button>

      {isVisible && debugInfo && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Auth Status</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Authenticated:</div>
              <div className={debugInfo.isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.isAuthenticated ? 'Yes' : 'No'}
              </div>

              <div className="font-medium">Access Token:</div>
              <div className={debugInfo.hasAccessToken ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.hasAccessToken ? 'Present' : 'Missing'}
              </div>

              <div className="font-medium">Token Expired:</div>
              <div className={debugInfo.accessTokenExpired ? 'text-red-600' : 'text-green-600'}>
                {debugInfo.accessTokenExpired ? 'Yes' : 'No'}
              </div>

              <div className="font-medium">Expires In:</div>
              <div className="text-gray-600">
                {Math.round(debugInfo.timeUntilExpiration / 1000)}s
              </div>

              <div className="font-medium">Refresh Cookie:</div>
              <div className={debugInfo.hasRefreshCookie ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.hasRefreshCookie ? 'Present' : 'Missing'}
              </div>

              <div className="font-medium">User Data:</div>
              <div className={debugInfo.hasUserData ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.hasUserData ? 'Present' : 'Missing'}
              </div>

              <div className="font-medium">Refresh Scheduled:</div>
              <div className={debugInfo.refreshScheduled ? 'text-green-600' : 'text-yellow-600'}>
                {debugInfo.refreshScheduled ? 'Yes' : 'No'}
              </div>

              <div className="font-medium">Refresh In:</div>
              <div className="text-gray-600">
                {Math.round(debugInfo.timeUntilRefresh / 1000)}s
              </div>
            </div>

            {debugInfo.lastError && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                <div className="font-medium text-red-800 text-xs">Last Error:</div>
                <div className="text-red-600 text-xs">{debugInfo.lastError}</div>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <button
                onClick={testRefresh}
                className="w-full bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
              >
                Test Refresh
              </button>
              <button
                onClick={clearTokens}
                className="w-full bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
              >
                Clear Tokens
              </button>
              <button
                onClick={updateDebugInfo}
                className="w-full bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
              >
                Refresh Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebugger;
