import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({ children, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Auth state check', { 
    isAuthenticated, 
    isLoading, 
    hasUser: !!user,
    currentPath: location.pathname 
  });

  if (isLoading) {
    console.log('ProtectedRoute: Still loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    // Redirect them to the login page, but save the attempted location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: User authenticated, rendering protected content');
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
