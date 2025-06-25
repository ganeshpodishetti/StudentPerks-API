import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { fetchDeals } from '../services/dealService';
import { Deal } from '../types/Deal';
import DealCard from './DealCard';
import DealSkeleton from './DealSkeleton';
import HeroSearchSection from './HeroSearchSection';

// Sorting options
type SortOption = {
  label: string;
  value: keyof Deal | null;
  direction: 'asc' | 'desc';
};

const sortOptions: SortOption[] = [
  { label: 'Newest First', value: 'startDate', direction: 'desc' },
  { label: 'Oldest First', value: 'startDate', direction: 'asc' },
  { label: 'Alphabetical (A-Z)', value: 'title', direction: 'asc' },
  { label: 'Alphabetical (Z-A)', value: 'title', direction: 'desc' },
  { label: 'Store Name (A-Z)', value: 'storeName', direction: 'asc' },
  { label: 'Store Name (Z-A)', value: 'storeName', direction: 'desc' },
];

interface DealListProps {
  initialCategory?: string;
  initialStore?: string;
}

const DealList: React.FC<DealListProps> = ({ initialCategory, initialStore }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [displayedDeals, setDisplayedDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedStore, setSelectedStore] = useState<string>(initialStore || 'All');
  const [activeSort, setActiveSort] = useState<SortOption>(sortOptions[0]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dealsPerPage = 9; // 3x3 grid on desktop
  
  // Load deals from API
  const loadDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const dealsData = await fetchDeals();
      console.log('Deals loaded successfully:', dealsData);
      setDeals(dealsData || []);
      setFilteredDeals(dealsData || []);
      setTotalPages(Math.ceil((dealsData || []).length / dealsPerPage));
      setLoading(false);
    } catch (err) {
      console.error("Error loading deals:", err);
      setError('Failed to load deals. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  // Apply search and sort
  useEffect(() => {
    let result = deals;
    
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
    
    setFilteredDeals(result);
    setTotalPages(Math.ceil(result.length / dealsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, selectedStore, activeSort, deals]);

  // Paginate the filtered deals
  useEffect(() => {
    const startIndex = (currentPage - 1) * dealsPerPage;
    const endIndex = startIndex + dealsPerPage;
    setDisplayedDeals(filteredDeals.slice(startIndex, endIndex));
  }, [currentPage, filteredDeals, dealsPerPage]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 md:px-8 bg-[#FAFAFA] dark:bg-neutral-950">
        <div className="max-w-5xl mx-auto bg-[#FAFAFA] dark:bg-neutral-950">
          {/* Centered header */}
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Student Deals</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Loading the best offers for students...</p>
          </div>
          <DealSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 md:px-8 bg-[#FAFAFA] dark:bg-neutral-950">
        <div className="max-w-5xl mx-auto bg-[#FAFAFA] dark:bg-neutral-950">
          {/* Centered header */}
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Student Deals</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Exclusive offers for students</p>
          </div>
          <div className="text-center py-16">
            <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-4">{error}</p>
            <Button 
              onClick={loadDeals} 
              className="bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-8 bg-[#FAFAFA] dark:bg-neutral-950">
      <div className="max-w-5xl mx-auto bg-[#FAFAFA] dark:bg-neutral-950">
        {/* Centered Header - only show if no initial category or store */}
        {!initialCategory && !initialStore && (
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Student Deals</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Exclusive offers for students</p>
          </div>
        )}
        
        {/* Hero Search Section - only show if no initial category or store */}
        {!initialCategory && !initialStore && (
          <HeroSearchSection 
            onSearch={handleSearch}
            onCategorySelect={handleCategorySelect}
            searchTerm={searchTerm}
          />
        )}
        
        {/* Sort Only */}
        <div className="mb-6">
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 flex items-center gap-2">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{activeSort.label}</span>
                  <span className="inline sm:hidden">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.label}
                    onClick={() => setActiveSort(option)}
                    className={activeSort.label === option.label ? "bg-neutral-100 dark:bg-neutral-800" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Results Stats */}
        <div className="mb-6 text-xs text-neutral-500 dark:text-neutral-400">
          Showing {displayedDeals.length} of {filteredDeals.length} deals
          {selectedCategory && selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {selectedStore && selectedStore !== 'All' && ` from ${selectedStore}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
        
        {/* Deals Grid */}
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-sm border border-neutral-100 dark:border-neutral-800">
            <p className="text-neutral-500 dark:text-neutral-400 mb-4 text-sm">
              {searchTerm || (selectedCategory && selectedCategory !== 'All') || (selectedStore && selectedStore !== 'All')
                ? `No deals found${selectedCategory && selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}${selectedStore && selectedStore !== 'All' ? ` from ${selectedStore}` : ''}${searchTerm ? ` matching "${searchTerm}"` : ''}`
                : 'No deals available'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="my-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      size="default"
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    
                    // Display first page, current page, last page, and one page before and after current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      pageNumber === currentPage ||
                      pageNumber === currentPage - 1 ||
                      pageNumber === currentPage + 1
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            size="icon"
                            isActive={pageNumber === currentPage}
                            onClick={() => handlePageChange(pageNumber)}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    // Add ellipsis where pages are skipped
                    if (
                      pageNumber === 2 ||
                      pageNumber === totalPages - 1
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      size="default"
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
        
      </div>
    </div>
  );
};

export default DealList;