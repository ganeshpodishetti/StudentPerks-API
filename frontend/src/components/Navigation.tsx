import { Store, Tag } from 'lucide-react';
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

  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  // Handle store selection
  const handleStoreSelect = (storeName: string) => {
    if (onStoreSelect) {
      onStoreSelect(storeName);
    }
  };

  return (
    <header className="bg-white dark:bg-neutral-950 py-5 sticky top-0 z-10 w-full border-b dark:border-neutral-800">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Link to="/" className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              StudentPerks
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors ${
                location.pathname === '/' ? 'text-black dark:text-white' : ''
              }`}
            >
              Home
            </Link>
            
            {/* Categories Link */}
            <Link 
              to="/categories" 
              className={`flex items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none ${
                location.pathname === '/categories' ? 'text-black dark:text-white' : ''
              }`}
            >
              <Tag className="mr-1.5 h-3.5 w-3.5" />
              Categories
            </Link>
            
            {/* Stores Link */}
            <Link 
              to="/stores" 
              className={`flex items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none ${
                location.pathname === '/stores' ? 'text-black dark:text-white' : ''
              }`}
            >
              <Store className="mr-1.5 h-3.5 w-3.5" />
              Stores
            </Link>
          </nav>
          
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;