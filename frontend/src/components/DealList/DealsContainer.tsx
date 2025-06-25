import { Button } from "@/components/ui/button";
import { useDealsData } from '@/hooks/deals/useDealsData';
import { sortOptions, useDealsFilter } from '@/hooks/deals/useDealsFilter';
import { useDealsPagination } from '@/hooks/deals/useDealsPagination';
import DealSkeleton from '../DealSkeleton';
import HeroSearchSection from '../HeroSearchSection';
import { DealsFilters } from './DealsFilters';
import { DealsGrid } from './DealsGrid';
import { DealsPagination } from './DealsPagination';

interface DealsContainerProps {
  initialCategory?: string;
  initialStore?: string;
  showHeroSection?: boolean;
}

export const DealsContainer: React.FC<DealsContainerProps> = ({
  initialCategory,
  initialStore,
  showHeroSection = true,
}) => {
  const { deals, loading, error, refetch } = useDealsData();

  const {
    filteredDeals,
    searchTerm,
    selectedCategory,
    selectedStore,
    activeSort,
    setSearchTerm,
    setSelectedCategory,
    setActiveSort,
  } = useDealsFilter({
    deals,
    initialCategory,
    initialStore,
  });

  const {
    currentPage,
    totalPages,
    displayedDeals,
    handlePageChange,
  } = useDealsPagination({
    deals: filteredDeals,
    pageSize: 12,
  });

  const generateEmptyMessage = () => {
    if (searchTerm || (selectedCategory && selectedCategory !== 'All') || (selectedStore && selectedStore !== 'All')) {
      return `No deals found${selectedCategory && selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}${selectedStore && selectedStore !== 'All' ? ` from ${selectedStore}` : ''}${searchTerm ? ` matching "${searchTerm}"` : ''}`;
    }
    return 'No deals available';
  };

  if (loading) {
    return (
      <div className="bg-[#FAFAFA] dark:bg-neutral-950">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Student Deals</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Loading the best offers for students...</p>
        </div>
        <DealSkeleton count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FAFAFA] dark:bg-neutral-950">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Student Deals</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Exclusive offers for students</p>
        </div>
        <div className="text-center py-16">
          <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-4">{error}</p>
          <Button 
            onClick={refetch} 
            className="bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] dark:bg-neutral-950">
        {/* Header - only show if showHeroSection is true */}
        {showHeroSection && (
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Student Deals</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Exclusive offers for students</p>
          </div>
        )}
        
        {/* Hero Search Section - only show if showHeroSection is true */}
        {showHeroSection && (
          <HeroSearchSection 
            onSearch={setSearchTerm}
            onCategorySelect={setSelectedCategory}
            searchTerm={searchTerm}
          />
        )}
        
        {/* Filters and Sort */}
        <DealsFilters
          sortOptions={sortOptions}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          totalDeals={deals.length}
          filteredDeals={filteredDeals.length}
          selectedCategory={selectedCategory}
          selectedStore={selectedStore}
          searchTerm={searchTerm}
        />
        
        {/* Deals Grid */}
        <DealsGrid
          deals={displayedDeals}
          loading={false}
          emptyMessage={generateEmptyMessage()}
        />
        
        {/* Pagination */}
        <DealsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
  );
};
