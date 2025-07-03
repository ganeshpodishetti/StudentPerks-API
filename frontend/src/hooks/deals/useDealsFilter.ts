import { Deal } from '@/types/Deal';
import { useEffect, useMemo, useState } from 'react';

interface SortOption {
  label: string;
  value: keyof Deal | null;
  direction: 'asc' | 'desc';
}

interface UseDealsFilterReturn {
  filteredDeals: Deal[];
  searchTerm: string;
  selectedCategory: string;
  selectedStore: string;
  activeSort: SortOption;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedStore: (store: string) => void;
  setActiveSort: (sort: SortOption) => void;
}

const sortOptions: SortOption[] = [
  { label: 'Newest First', value: 'startDate', direction: 'desc' },
  { label: 'Oldest First', value: 'startDate', direction: 'asc' },
  { label: 'Alphabetical (A-Z)', value: 'title', direction: 'asc' },
  { label: 'Alphabetical (Z-A)', value: 'title', direction: 'desc' },
  { label: 'Store Name (A-Z)', value: 'storeName', direction: 'asc' },
  { label: 'Store Name (Z-A)', value: 'storeName', direction: 'desc' },
];

interface UseDealsFilterProps {
  deals: Deal[];
  initialCategory?: string;
  initialStore?: string;
}

export const useDealsFilter = ({
  deals,
  initialCategory,
  initialStore,
}: UseDealsFilterProps): UseDealsFilterReturn => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedStore, setSelectedStore] = useState<string>(initialStore || 'All');
  const [activeSort, setActiveSort] = useState<SortOption>(sortOptions[0]);

  // Update selectedCategory when initialCategory prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Update selectedStore when initialStore prop changes
  useEffect(() => {
    if (initialStore) {
      setSelectedStore(initialStore);
    }
  }, [initialStore]);

  const filteredDeals = useMemo(() => {
    // Ensure deals is an array, default to empty array if not
    if (!Array.isArray(deals)) {
      console.warn('useDealsFilter: deals is not an array:', deals);
      return [];
    }

    let result = deals;

    // Filter out inactive deals for home page experience
    result = result.filter(deal => deal.isActive);

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(deal => 
        deal.categoryName.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by store
    if (selectedStore && selectedStore !== 'All') {
      result = result.filter(deal => 
        deal.storeName.toLowerCase() === selectedStore.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(deal => 
        deal.title.toLowerCase().includes(term) || 
        deal.description.toLowerCase().includes(term) ||
        deal.storeName.toLowerCase().includes(term) ||
        deal.categoryName.toLowerCase().includes(term) ||
        (deal.promo && deal.promo.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    if (activeSort.value) {
      result = [...result].sort((a, b) => {
        const valueA = a[activeSort.value as keyof Deal];
        const valueB = b[activeSort.value as keyof Deal];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return activeSort.direction === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        }
        
        return 0;
      });
    }

    return result;
  }, [deals, searchTerm, selectedCategory, selectedStore, activeSort]);

  return {
    filteredDeals,
    searchTerm,
    selectedCategory,
    selectedStore,
    activeSort,
    setSearchTerm,
    setSelectedCategory,
    setSelectedStore,
    setActiveSort,
  };
};

export { sortOptions };
