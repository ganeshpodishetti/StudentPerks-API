import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({ children, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the login page, but save the attempted location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({ children, redirectTo = '/' }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // If user is already authenticated, redirect to home or specified route
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
