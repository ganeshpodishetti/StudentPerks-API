import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, ExternalLink, Globe, Store } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { Store as StoreType, fetchStores } from '../services/storeService';

const StoresPage: React.FC = () => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadStores = async () => {
      setLoading(true);
      try {
        const storesData = await fetchStores();
        setStores(storesData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading stores:", err);
        setError("Failed to load stores. Please try again later.");
        setLoading(false);
        
        toast({
          title: "Error",
          description: "Failed to load stores. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    loadStores();
  }, [toast]);

  const handleStoreSelect = (storeName: string) => {
    // This will be replaced with actual navigation in a routing system
    window.location.href = `/?store=${encodeURIComponent(storeName)}`;
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Stores</h1>
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
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Stores</h1>
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md">
              {error}
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Stores</h1>
          
          {stores.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-md border border-neutral-100 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400">No stores found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div 
                  key={store.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Store className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{store.name}</h2>
                  </div>
                  
                  {store.description && (
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                      {store.description}
                    </p>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    {store.website && (
                      <a 
                        href={store.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" /> Website <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 flex items-center justify-center gap-1"
                      onClick={() => handleStoreSelect(store.name)}
                    >
                      View Deals <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoresPage;
