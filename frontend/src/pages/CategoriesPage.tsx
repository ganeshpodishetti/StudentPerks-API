import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from 'react';
import { Category, fetchCategories } from '../services/categoryService';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories. Please try again later.");
        setLoading(false);
        
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    loadCategories();
  }, [toast]);

  const handleCategorySelect = (categoryName: string) => {
    // This will be replaced with actual navigation in a routing system
    window.location.href = `/?category=${encodeURIComponent(categoryName)}`;
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Categories</h1>
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md">
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">Categories</h1>
          </div>
        
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-md border border-neutral-100 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400">No categories found</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.name)}
                  className="px-6 py-3 bg-neutral-800 dark:bg-neutral-700 text-white dark:text-neutral-200 rounded-full text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950 whitespace-nowrap"
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
