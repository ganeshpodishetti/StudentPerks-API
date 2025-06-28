import { cn } from '@/lib/utils';
import React from 'react';
import { Deal, GetDealsByCategoryResponse, GetDealsByStoreResponse, GetDealsByUniversityResponse } from '../types/Deal';
import DealCard from './DealCard';

type DealType = Deal | GetDealsByCategoryResponse | GetDealsByStoreResponse | GetDealsByUniversityResponse;

interface DealGridProps {
  deals: DealType[];
  className?: string;
  compact?: boolean;
  showUniversityInfo?: boolean;
  emptyStateMessage?: string;
  emptyStateDescription?: string;
}

const DealGrid: React.FC<DealGridProps> = ({
  deals,
  className,
  compact = false,
  showUniversityInfo = false,
  emptyStateMessage = "No deals found",
  emptyStateDescription = "Try adjusting your search criteria or check back later for new deals."
}) => {
  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-neutral-400 dark:text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {emptyStateMessage}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {emptyStateDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        compact 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal as Deal}
          compact={compact}
          showUniversityInfo={showUniversityInfo}
        />
      ))}
    </div>
  );
};

export default DealGrid;
