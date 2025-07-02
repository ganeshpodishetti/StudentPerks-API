import { GraduationCap, Menu, Plus, Store, Tag, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SubmittedDealFormModal from './SubmittedDealFormModal';
import ThemeToggle from './ThemeToggle';
import { useToast } from './ui/use-toast';

interface NavigationProps {
  // Props removed as admin/user functionality is hidden
}

// Auth buttons component
const AuthButtons: React.FC = () => {
  // Hide admin and user info from navigation
  return null;
};

// Mobile auth buttons component
const AuthButtonsMobile: React.FC = () => {
  // Hide admin and user info from mobile navigation
  return null;
};

const Navigation: React.FC<NavigationProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitDealModalOpen, setIsSubmitDealModalOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('header')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-neutral-950 py-4 sticky top-0 z-50 w-full border-b dark:border-neutral-800">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              onClick={closeMobileMenu}
            >
              StudentPerks
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <Link 
              to="/categories" 
              className={`flex items-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none ${
                location.pathname === '/categories' ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : ''
              }`}
            >
              <Tag className="mr-1.5 h-3.5 w-3.5" />
              Categories
            </Link>
            
            <Link 
              to="/stores" 
              className={`flex items-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none ${
                location.pathname === '/stores' ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : ''
              }`}
            >
              <Store className="mr-1.5 h-3.5 w-3.5" />
              Stores
            </Link>
            
            <Link 
              to="/universities" 
              className={`flex items-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none ${
                location.pathname === '/universities' ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : ''
              }`}
            >
              <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
              Universities
            </Link>
          </nav>

          {/* Desktop Theme Toggle and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setIsSubmitDealModalOpen(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Submit Deal
            </button>
            <ThemeToggle />
            <AuthButtons />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-500 transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <Link 
                to="/categories" 
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === '/categories' 
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
                }`}
                onClick={closeMobileMenu}
              >
                <Tag className="mr-2 h-4 w-4" />
                Categories
              </Link>
              
              <Link 
                to="/stores" 
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === '/stores' 
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
                }`}
                onClick={closeMobileMenu}
              >
                <Store className="mr-2 h-4 w-4" />
                Stores
              </Link>
              
              <Link 
                to="/universities" 
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === '/universities' 
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
                }`}
                onClick={closeMobileMenu}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Universities
              </Link>
              
              {/* Submit Deal Button */}
              <button
                onClick={() => {
                  setIsSubmitDealModalOpen(true);
                  closeMobileMenu();
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Submit Deal
              </button>
              
              {/* Mobile Auth Links */}
              <AuthButtonsMobile />
            </div>
          </div>
        )}
      </div>
      
      {/* Submit Deal Modal */}
      <SubmittedDealFormModal
        isOpen={isSubmitDealModalOpen}
        onClose={() => setIsSubmitDealModalOpen(false)}
        onSuccess={() => {
          toast({
            title: "Deal Submitted!",
            description: "Thanks for sharing! We'll review your deal and add it to the platform soon.",
          });
        }}
      />
    </header>
  );
};

export default Navigation;