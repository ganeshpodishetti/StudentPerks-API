// Base interfaces for common component patterns

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseListProps<T> {
  items: T[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
}

export interface BaseTableProps<T> extends BaseListProps<T> {
  columns?: string[];
  actions?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export interface BaseCardProps<T> extends BaseListProps<T> {
  layout?: 'grid' | 'list';
  cardVariant?: 'default' | 'compact' | 'detailed';
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface BaseFormProps<T> extends BaseModalProps {
  onSave: (data: T) => void | Promise<void>;
  initialData?: Partial<T>;
  isLoading?: boolean;
}

export interface BasePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface BaseSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export interface BaseSortProps<T> {
  sortField?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort: (field: keyof T, direction: 'asc' | 'desc') => void;
  sortOptions?: Array<{
    label: string;
    field: keyof T;
    direction: 'asc' | 'desc';
  }>;
}

export interface BaseFilterProps<T> {
  filters: Partial<T>;
  onFilterChange: (filters: Partial<T>) => void;
  onClearFilters: () => void;
}

// Loading and error states
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
  lastFetched?: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Common component variants
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export type ComponentState = 'idle' | 'loading' | 'success' | 'error';
