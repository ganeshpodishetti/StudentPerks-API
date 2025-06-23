import { Menu, Store, Tag, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Category, fetchCategories } from '../services/categoryService';
import { Store as StoreType, fetchStores } from '../services/storeService';
import ThemeToggle from './ThemeToggle';

interface NavigationProps {
  onCategorySelect?: (category: string) => void;
  onStoreSelect?: (store: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onCategorySelect, onStoreSelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Load categories and stores from API
  useEffect(() => {
    const loadCategoriesAndStores = async () => {
      setLoading(true);
      try {
        // Fetch categories and stores in parallel
        const [categoriesData, storesData] = await Promise.all([
          fetchCategories(),
          fetchStores()
        ]);
        
        setCategories(categoriesData);
        setStores(storesData);
      } catch (err) {
        console.error("Error loading categories and stores:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategoriesAndStores();
  }, []);

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

  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  // Handle store selection
  const handleStoreSelect = (storeName: string) => {
    if (onStoreSelect) {
      onStoreSelect(storeName);
    }
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
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
                to="/" 
                className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors ${
                  location.pathname === '/' ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : ''
                }`}
              >
                Home
              </Link>
              
              <Link 
                to="/categories" 
                className={`flex items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none ${
                  location.pathname === '/categories' ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : ''
                }`}
              >
                <Tag className="mr-1.5 h-3.5 w-3.5" />
                Categories
              </Link>
              
              <Link 
                to="/stores" 
                className={`flex items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none ${
                  location.pathname === '/stores' ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : ''
                }`}
              >
                <Store className="mr-1.5 h-3.5 w-3.5" />
                Stores
              </Link>
            </nav>

            {/* Desktop Theme Toggle */}
            <div className="hidden md:flex items-center">
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-500 transition-colors"
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
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
                <Link 
                  to="/" 
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-gray-200 dark:bg-neutral-800 text-black dark:text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
                  }`}
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                
                <Link 
                  to="/categories" 
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === '/categories' 
                      ? 'bg-gray-200 dark:bg-neutral-800 text-black dark:text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
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
                      ? 'bg-gray-200 dark:bg-neutral-800 text-black dark:text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Store className="mr-2 h-4 w-4" />
                  Stores
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;