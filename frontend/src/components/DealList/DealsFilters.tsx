import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Deal } from '@/types/Deal';
import { ArrowUpDown } from "lucide-react";

interface SortOption {
  label: string;
  value: keyof Deal | null;
  direction: 'asc' | 'desc';
}

interface DealsFiltersProps {
  sortOptions: SortOption[];
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalDeals: number;
  filteredDeals: number;
  selectedCategory?: string;
  selectedStore?: string;
  searchTerm?: string;
}

export const DealsFilters: React.FC<DealsFiltersProps> = ({
  sortOptions,
  activeSort,
  onSortChange,
  totalDeals,
  filteredDeals,
  selectedCategory,
  selectedStore,
  searchTerm,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Sort Controls */}
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
                onClick={() => onSortChange(option)}
                className={activeSort.label === option.label ? "bg-neutral-100 dark:bg-neutral-800" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Stats */}
      <div className="text-xs text-neutral-500 dark:text-neutral-400">
        Showing {filteredDeals} of {totalDeals} deals
        {selectedCategory && selectedCategory !== 'All' && ` in ${selectedCategory}`}
        {selectedStore && selectedStore !== 'All' && ` from ${selectedStore}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>
    </div>
  );
};
