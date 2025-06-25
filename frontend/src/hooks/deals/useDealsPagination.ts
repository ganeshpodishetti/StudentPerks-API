import { Deal } from '@/types/Deal';
import { useEffect, useMemo, useState } from 'react';

interface UseDealsPaginationReturn {
  currentPage: number;
  totalPages: number;
  displayedDeals: Deal[];
  handlePageChange: (page: number) => void;
}

interface UseDealsPaginationProps {
  deals: Deal[];
  pageSize?: number;
}

export const useDealsPagination = ({
  deals,
  pageSize = 9,
}: UseDealsPaginationProps): UseDealsPaginationReturn => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(deals.length / pageSize);
  }, [deals.length, pageSize]);

  const displayedDeals = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return deals.slice(startIndex, endIndex);
  }, [deals, currentPage, pageSize]);

  // Reset to first page when deals change
  useEffect(() => {
    setCurrentPage(1);
  }, [deals]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    currentPage,
    totalPages,
    displayedDeals,
    handlePageChange,
  };
};
