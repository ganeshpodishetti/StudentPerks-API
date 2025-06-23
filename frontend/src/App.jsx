import { Toaster } from "@/components/ui/toaster";
import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import DealList from './components/DealList';
import Navigation from './components/Navigation';
import CategoriesPage from './pages/CategoriesPage';
import StoresPage from './pages/StoresPage';

// Wrapper component to handle navigation state
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen h-full w-full bg-[#FAFAFA] dark:bg-neutral-950 flex flex-col">
      <Navigation 
        onCategorySelect={handleCategorySelect}
      />

      <main className="flex-grow py-14 md:py-16 bg-[#FAFAFA] dark:bg-neutral-950">
        <div className="container mx-auto px-6 md:px-8 bg-[#FAFAFA] dark:bg-neutral-950">
          <Routes>
            <Route 
              path="/" 
              element={
                <DealList 
                  initialCategory={selectedCategory}
                />
              } 
            />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/stores" element={<StoresPage />} />
          </Routes>
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
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;