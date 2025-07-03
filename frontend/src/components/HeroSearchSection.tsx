import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { Category, fetchCategories } from '../services/categoryService';

interface HeroSearchSectionProps {
  onSearch: (searchTerm: string) => void;
  onCategorySelect: (categoryName: string) => void;
  searchTerm: string;
}

const HeroSearchSection: React.FC<HeroSearchSectionProps> = ({
  onSearch,
  onCategorySelect,
  searchTerm
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await fetchCategories();
        // Ensure categoriesData is always an array
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading categories:", err);
        setCategories([]); // Set empty array on error
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  return (
    <div className="mb-8">
      {/* Search Section */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <Input
            type="text"
            placeholder="Search for deals, stores, or categories..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 h-12 text-base border-neutral-300 dark:border-neutral-600 focus:border-neutral-500 dark:focus:border-neutral-400"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="text-center">
        {/* <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-4">
          Browse by Category
        </h3> */}
        
        {loading ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(8)].map((_, index) => (
              <div 
                key={index} 
                className="h-8 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
            <button
              onClick={() => onCategorySelect('All')}
              className="px-4 py-2 bg-neutral-800 text-white rounded-full text-sm font-medium hover:bg-neutral-900 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-neutral-700 focus:ring-offset-1 whitespace-nowrap"
            >
              All Categories
            </button>
            {Array.isArray(categories) && categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.name || '')}
                className="px-4 py-2 bg-neutral-800 text-white rounded-full text-sm font-medium hover:bg-neutral-900 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-neutral-700 focus:ring-offset-1 whitespace-nowrap"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSearchSection;
