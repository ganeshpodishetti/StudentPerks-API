import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import DealList from './components/DealList';
import Navigation from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';

// Development utilities
if (import.meta.env.DEV) {
  import('./utils/tokenTestUtils');
}

// Lazy load admin components
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminDealsPage = lazy(() => import('./pages/AdminDealsPage'));
const AdminSubmittedDealsPage = lazy(() => import('./pages/AdminSubmittedDealsPage'));
const AdminStoresPage = lazy(() => import('./pages/AdminStoresPage'));
const AdminCategoriesPage = lazy(() => import('./pages/AdminCategoriesPage'));
const AdminUniversitiesPage = lazy(() => import('./pages/AdminUniversitiesPage'));

// Lazy load auth components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// Lazy load other pages
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const StoresPage = lazy(() => import('./pages/StoresPage'));
const UniversitiesPage = lazy(() => import('./pages/UniversitiesPage'));
const UniversityDealsPage = lazy(() => import('./pages/UniversityDealsPage'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-neutral-100"></div>
  </div>
);

// Wrapper component to handle navigation state
const AppContent = () => {
  const location = useLocation();

  // Check if current path is auth-related
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');

  // If it's an auth page, render without navigation and footer
  if (isAuthPage) {
    return (
      <div className="min-h-screen">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    );
  }

  // If it's an admin page, render with minimal layout
  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/deals" 
              element={
                <ProtectedRoute>
                  <AdminDealsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/submitted-deals" 
              element={
                <ProtectedRoute>
                  <AdminSubmittedDealsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/stores" 
              element={
                <ProtectedRoute>
                  <AdminStoresPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedRoute>
                  <AdminCategoriesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/universities" 
              element={
                <ProtectedRoute>
                  <AdminUniversitiesPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full w-full bg-[#FAFAFA] dark:bg-neutral-950 flex flex-col">
      <Navigation />

      <main className="flex-grow py-14 md:py-16 bg-[#FAFAFA] dark:bg-neutral-950">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 bg-[#FAFAFA] dark:bg-neutral-950">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <DealList />
                } 
              />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/universities" element={<UniversitiesPage />} />
              <Route path="/universities/:universityId/deals" element={<UniversityDealsPage />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      <footer className="bg-gray-100 text-neutral-600 dark:bg-neutral-950 dark:text-neutral-400 py-12 border-t dark:border-neutral-800">
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <h3 className="text-neutral-800 dark:text-white font-semibold mb-4">Connect</h3>
              <p className="text-sm mb-4">Stay updated with the latest deals and offers</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-neutral-800 mt-8 pt-8 text-center text-xs">
            <span>&copy; {new Date().getFullYear()} StudentPerks · All rights reserved</span>
          </div>
        </div>
      </footer>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

function App() {
  return <AppContent />;
}

export default App;