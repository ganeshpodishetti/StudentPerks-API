import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Store, Tag } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  const [showStoresDialog, setShowStoresDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  
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
    setShowCategoriesDialog(false);
  };

  // Handle store selection
  const handleStoreSelect = (storeName: string) => {
    if (onStoreSelect) {
      onStoreSelect(storeName);
    }
    setShowStoresDialog(false);
  };

  return (
    <header className="bg-white dark:bg-neutral-950 py-5 sticky top-0 z-10 w-full border-b dark:border-neutral-800">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">StudentPerks</span>
          </div>
          
          <nav className="flex space-x-8">
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors">Home</a>
            
            {/* Categories Link */}
            <button 
              onClick={() => setShowCategoriesDialog(true)}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none"
            >
              <Tag className="mr-1.5 h-3.5 w-3.5" />
              Categories
            </button>
            
            {/* Stores Link */}
            <button 
              onClick={() => setShowStoresDialog(true)}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none"
            >
              <Store className="mr-1.5 h-3.5 w-3.5" />
              Stores
            </button>
          </nav>
          
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Categories Dialog */}
      <Dialog open={showCategoriesDialog} onOpenChange={setShowCategoriesDialog}>
        <DialogContent className="sm:max-w-md dark:bg-neutral-900 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag size={16} />
              <span>Categories</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handleCategorySelect('All')} 
                className="w-full text-left px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
              >
                All Categories
              </button>
              {loading ? (
                <div className="col-span-2 flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800 dark:border-neutral-200"></div>
                </div>
              ) : (
                categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.name)}
                    className="w-full text-left px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {category.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stores Dialog */}
      <Dialog open={showStoresDialog} onOpenChange={setShowStoresDialog}>
        <DialogContent className="sm:max-w-md dark:bg-neutral-900 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store size={16} />
              <span>Stores</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handleStoreSelect('All')} 
                className="w-full text-left px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
              >
                All Stores
              </button>
              {loading ? (
                <div className="col-span-2 flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800 dark:border-neutral-200"></div>
                </div>
              ) : (
                stores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => handleStoreSelect(store.name)}
                    className="w-full text-left px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {store.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navigation;