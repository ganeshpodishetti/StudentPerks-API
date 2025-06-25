import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

interface DealsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DealsPagination: React.FC<DealsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="my-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            size="default"
            onClick={() => onPageChange(currentPage - 1)}
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
                  onClick={() => onPageChange(pageNumber)}
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
            onClick={() => onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
