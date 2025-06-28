import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, Filter, MapPin, School, Search, Store, Tag, X } from 'lucide-react';
import React from 'react';

export interface DealFilters {
  search: string;
  category: string;
  store: string;
  university: string;
  redeemType: string;
  isActive: boolean;
  hasPromo: boolean;
  isExpiringSoon: boolean;
  isUniversitySpecific: boolean;
  sortBy: 'title' | 'discount' | 'endDate' | 'created';
  sortOrder: 'asc' | 'desc';
}

interface DealFilterBarProps {
  filters: DealFilters;
  onFiltersChange: (filters: DealFilters) => void;
  categories: Array<{ name: string; count?: number }>;
  stores: Array<{ name: string; count?: number }>;
  universities: Array<{ name: string; count?: number }>;
  className?: string;
  showAdvanced?: boolean;
  dealCount?: number;
}

const DealFilterBar: React.FC<DealFilterBarProps> = ({
  filters,
  onFiltersChange,
  categories = [],
  stores = [],
  universities = [],
  className,
  showAdvanced = false,
  dealCount
}) => {
  const updateFilter = (key: keyof DealFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      store: '',
      university: '',
      redeemType: '',
      isActive: true,
      hasPromo: false,
      isExpiringSoon: false,
      isUniversitySpecific: false,
      sortBy: 'title',
      sortOrder: 'asc',
    });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'isActive' || key === 'sortBy' || key === 'sortOrder') return false;
    if (typeof value === 'string') return value !== '';
    if (typeof value === 'boolean') return value === true;
    return false;
  }).length;

  return (
    <Card className={`p-6 space-y-4 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Filter Deals
          </h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {dealCount !== undefined && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {dealCount} deals
            </span>
          )}
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Search deals..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger>
            <Tag className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.name} value={cat.name}>
                {cat.name} {cat.count && `(${cat.count})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.store} onValueChange={(value) => updateFilter('store', value)}>
          <SelectTrigger>
            <Store className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Stores</SelectItem>
            {stores.map((store) => (
              <SelectItem key={store.name} value={store.name}>
                {store.name} {store.count && `(${store.count})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.redeemType} onValueChange={(value) => updateFilter('redeemType', value)}>
          <SelectTrigger>
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Redeem Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="InStore">In-Store</SelectItem>
            <SelectItem value="Both">Both</SelectItem>
          </SelectContent>
        </Select>

        <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={(value) => {
          const [sortBy, sortOrder] = value.split('-') as [DealFilters['sortBy'], DealFilters['sortOrder']];
          updateFilter('sortBy', sortBy);
          updateFilter('sortOrder', sortOrder);
        }}>
          <SelectTrigger>
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
            <SelectItem value="endDate-asc">Ending Soon</SelectItem>
            <SelectItem value="endDate-desc">Ending Last</SelectItem>
            <SelectItem value="created-desc">Newest First</SelectItem>
            <SelectItem value="created-asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Advanced Filters</h4>
          
          <Select value={filters.university} onValueChange={(value) => updateFilter('university', value)}>
            <SelectTrigger>
              <School className="h-4 w-4 mr-2" />
              <SelectValue placeholder="University" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Universities</SelectItem>
              {universities.map((uni) => (
                <SelectItem key={uni.name} value={uni.name}>
                  {uni.name} {uni.count && `(${uni.count})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasPromo"
                checked={filters.hasPromo}
                onCheckedChange={(checked) => updateFilter('hasPromo', checked)}
              />
              <Label htmlFor="hasPromo" className="text-sm">Has Promo Code</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isExpiringSoon"
                checked={filters.isExpiringSoon}
                onCheckedChange={(checked) => updateFilter('isExpiringSoon', checked)}
              />
              <Label htmlFor="isExpiringSoon" className="text-sm">Expiring Soon</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isUniversitySpecific"
                checked={filters.isUniversitySpecific}
                onCheckedChange={(checked) => updateFilter('isUniversitySpecific', checked)}
              />
              <Label htmlFor="isUniversitySpecific" className="text-sm">University Exclusive</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={filters.isActive}
                onCheckedChange={(checked) => updateFilter('isActive', checked)}
              />
              <Label htmlFor="isActive" className="text-sm">Active Only</Label>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DealFilterBar;
