import { useAuth } from '@/hooks/useAuth';
import React from 'react';

interface TokenStatusProps {
  className?: string;
}

export const TokenStatus: React.FC<TokenStatusProps> = ({ className = '' }) => {
  const { isAuthenticated, refreshStatus } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const { isScheduled, timeUntilRefresh } = refreshStatus;
  const minutesUntilRefresh = Math.floor(timeUntilRefresh / 60000);
  const secondsUntilRefresh = Math.floor((timeUntilRefresh % 60000) / 1000);

  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isScheduled ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span>
          Token refresh: {isScheduled ? 'Active' : 'Inactive'}
          {isScheduled && timeUntilRefresh > 0 && (
            <span className="ml-1">
              ({minutesUntilRefresh}m {secondsUntilRefresh}s)
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default TokenStatus;
