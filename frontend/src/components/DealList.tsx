import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { ArrowUpDown, ChevronDown, FilterX } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { fetchDeals } from '../services/dealService';
import { Deal } from '../types/Deal';
import DealCard from './DealCard';
import DealSkeleton from './DealSkeleton';

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

const DealList: React.FC<DealListProps> = ({ initialCategory = 'All', initialStore = 'All' }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [displayedDeals, setDisplayedDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSort, setActiveSort] = useState<SortOption>(sortOptions[0]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dealsPerPage = 9; // 3x3 grid on desktop

  // Additional filters
  const [activeStore, setActiveStore] = useState<string>(initialStore);
  const [filterExpired, setFilterExpired] = useState<boolean>(false);
  
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

  // Update active filters when props change
  useEffect(() => {
    if (initialCategory !== activeCategory) {
      setActiveCategory(initialCategory);
    }
    if (initialStore !== activeStore) {
      setActiveStore(initialStore);
    }
  }, [initialCategory, initialStore, activeCategory, activeStore]);

  // Extract unique categories and stores
  const categories = ['All', ...Array.from(new Set(deals.map(deal => deal.categoryName)))];
  const stores = ['All', ...Array.from(new Set(deals.map(deal => deal.storeName)))];

  // Apply filters
  useEffect(() => {
    // Filter deals based on category, store, search term, and expired status
    let result = deals;
    
    // Filter by category
    if (activeCategory !== 'All') {
      result = result.filter(deal => deal.categoryName === activeCategory);
    }
    
    // Filter by store
    if (activeStore !== 'All') {
      result = result.filter(deal => deal.storeName === activeStore);
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
    
    // Filter out expired deals if filterExpired is true
    if (filterExpired) {
      const now = new Date();
      result = result.filter(deal => {
        const endDate = new Date(deal.endDate);
        return endDate >= now;
      });
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
  }, [activeCategory, activeStore, searchTerm, filterExpired, activeSort, deals]);

  // Paginate the filtered deals
  useEffect(() => {
    const startIndex = (currentPage - 1) * dealsPerPage;
    const endIndex = startIndex + dealsPerPage;
    setDisplayedDeals(filteredDeals.slice(startIndex, endIndex));
  }, [currentPage, filteredDeals, dealsPerPage]);

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory('All');
    setActiveStore('All');
    setSearchTerm('');
    setFilterExpired(false);
    setActiveSort(sortOptions[0]);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        {/* Centered Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Student Deals</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Exclusive offers for students</p>
        </div>
        
        {/* Search and Sort */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            {/* Search */}
            <div className="w-full md:w-64">
              <Input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>
            
            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
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
              
              {/* Toggle advanced filters */}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="hidden sm:inline">Filters</span>
                <span className="inline sm:hidden">Filter</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              {/* Clear filters */}
              {(activeCategory !== 'All' || activeStore !== 'All' || searchTerm || filterExpired || activeSort !== sortOptions[0]) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 flex items-center gap-2 text-neutral-500 dark:text-neutral-400"
                  onClick={clearFilters}
                >
                  <FilterX className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-md border border-neutral-100 dark:border-neutral-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`cursor-pointer px-3 py-1 text-xs ${activeCategory === category 
                        ? 'bg-neutral-900 text-white hover:bg-neutral-900 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'}`}
                      variant={activeCategory === category ? "default" : "secondary"}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Stores */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Stores</h3>
                <div className="flex flex-wrap gap-2">
                  {stores.map(store => (
                    <Badge
                      key={store}
                      onClick={() => setActiveStore(store)}
                      className={`cursor-pointer px-3 py-1 text-xs ${activeStore === store 
                        ? 'bg-neutral-900 text-white hover:bg-neutral-900 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'}`}
                      variant={activeStore === store ? "default" : "secondary"}
                    >
                      {store}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Additional filters */}
            <div className="mt-4 flex items-center">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filterExpired} 
                  onChange={() => setFilterExpired(!filterExpired)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:ring-offset-neutral-900 h-4 w-4 mr-2"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Hide expired deals</span>
              </label>
            </div>
          </div>
        )}
        
        {/* Categories Quick Filter - shown when advanced filters are hidden */}
        {!showFilters && (
          <div className="mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-grow">
              {categories.map(category => (
                <Badge
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`cursor-pointer px-3 py-1 text-xs ${activeCategory === category 
                    ? 'bg-neutral-900 text-white hover:bg-neutral-900 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'}`}
                  variant={activeCategory === category ? "default" : "secondary"}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Filter Stats */}
        <div className="mb-6 text-xs text-neutral-500 dark:text-neutral-400">
          Showing {displayedDeals.length} of {filteredDeals.length} deals
          {activeCategory !== 'All' && ` in ${activeCategory}`}
          {activeStore !== 'All' && ` from ${activeStore}`}
          {searchTerm && ` matching "${searchTerm}"`}
          {filterExpired && ' (hiding expired)'}
        </div>
        
        {/* Deals Grid */}
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-sm border border-neutral-100 dark:border-neutral-800">
            <p className="text-neutral-500 dark:text-neutral-400 mb-4 text-sm">No deals found matching your criteria</p>
            <Button 
              onClick={clearFilters}
              className="bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Clear Filters
            </Button>
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