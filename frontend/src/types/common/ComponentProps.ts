// Component-specific prop interfaces

import { ReactNode } from 'react';
import { BaseEntity, BaseFormProps, BaseListProps, ComponentSize, ComponentVariant } from './BaseTypes';

// Admin component props
export interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  navigation?: ReactNode;
}

export interface AdminHeaderProps {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  title?: string;
  onCreateAction?: () => void;
  onLogout?: () => void;
  createButtonText?: string;
  additionalActions?: ReactNode;
}

export interface AdminTableProps<T extends BaseEntity> extends BaseListProps<T> {
  columns: Array<{
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    width?: string;
  }>;
  actions?: Array<{
    label: string;
    icon?: ReactNode;
    onClick: (item: T) => void;
    variant?: ComponentVariant;
    show?: (item: T) => boolean;
  }>;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export interface AdminCardProps<T extends BaseEntity> extends BaseListProps<T> {
  renderCard: (item: T) => ReactNode;
  emptyMessage?: string;
  gridCols?: number;
}

// Deal-specific props
export interface DealListProps {
  initialCategory?: string;
  initialStore?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  pageSize?: number;
}

export interface DealCardProps {
  deal: {
    id: string;
    title: string;
    description: string;
    discount?: string;
    imageUrl?: string;
    storeName: string;
    categoryName: string;
    endDate?: string;
    startDate?: string;
    redeemType: string;
    url: string;
  };
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  onEdit?: (deal: any) => void;
  onDelete?: (id: string) => void;
}

export interface DealFormProps extends BaseFormProps<any> {
  categories?: Array<{ id: string; name: string }>;
  stores?: Array<{ id: string; name: string }>;
}

// Search and filter props
export interface SearchSectionProps {
  onSearch: (searchTerm: string) => void;
  onCategorySelect?: (categoryName: string) => void;
  searchTerm: string;
  categories?: Array<{ id: string; name: string }>;
  showCategories?: boolean;
}

export interface SortSelectProps<T> {
  options: Array<{
    label: string;
    value: keyof T;
    direction: 'asc' | 'desc';
  }>;
  value: {
    label: string;
    value: keyof T;
    direction: 'asc' | 'desc';
  };
  onChange: (option: any) => void;
  size?: ComponentSize;
}

// Navigation props
export interface NavigationProps {
  variant?: 'default' | 'admin';
  showAuth?: boolean;
}

// Auth component props
export interface AuthButtonProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
}

export interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

// Theme props
export interface ThemeToggleProps {
  size?: ComponentSize;
  variant?: ComponentVariant;
}
