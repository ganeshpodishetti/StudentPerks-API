import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from 'react';
import DealList from '../components/DealList';
import { Store as StoreType, fetchStores } from '../services/storeService';

const StoresPage: React.FC = () => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
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
    setSelectedStore(storeName);
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
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">Stores</h1>
          </div>
          
          {/* Stores Section - Always visible */}
          {stores.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-md border border-neutral-100 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400">No stores found</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => handleStoreSelect(store.name)}
                  className="flex py-2 items-center gap-2 px-5 rounded-full bg-neutral-800 dark:bg-neutral-800/90 hover:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-1 focus:ring-primary/40 text-white font-semibold text-lg mb-2 shadow-sm border border-neutral-800/40 min-w-[120px] max-w-full w-auto"
                  style={{ minHeight: 42 }}
                >
                  <span className="truncate px-1">{store.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Deals Section - Show when store is selected */}
          {selectedStore && (
            <div className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {selectedStore} Deals
                </h2>
              </div>
              <DealList initialStore={selectedStore} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoresPage;
