import { Deal } from '@/types/Deal';
import React, { memo } from 'react';
import DealCard from '../DealCard';

interface DealsGridProps {
  deals: Deal[];
  loading?: boolean;
  emptyMessage?: string;
}

export const DealsGrid: React.FC<DealsGridProps> = memo(({
  deals,
  loading = false,
  emptyMessage = "No deals available"
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-neutral-200 dark:bg-neutral-700 rounded-2xl h-80"></div>
          </div>
        ))}
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-sm border border-neutral-100 dark:border-neutral-800">
        <p className="text-neutral-500 dark:text-neutral-400 mb-4 text-sm">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
});
