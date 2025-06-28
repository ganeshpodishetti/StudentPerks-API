import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import DealFilterBar, { DealFilters } from '../components/DealFilterBar';
import DealFormModal from '../components/DealFormModal';
import DealGrid from '../components/DealGrid';
import DealStats from '../components/DealStats';
import { Deal } from '../types/Deal';

// Mock data - replace with actual API calls
const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Student Spotify Premium - 50% Off',
    description: 'Get 6 months of Spotify Premium at half price with student verification.',
    discount: '50% OFF',
    imageUrl: '/spotify-logo.png',
    promo: 'STUDENT50',
    isActive: true,
    url: 'https://spotify.com/student',
    redeemType: 'Online',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    categoryName: 'Music & Entertainment',
    storeName: 'Spotify'
  },
  {
    id: '2',
    title: 'Adobe Creative Cloud Student Discount',
    description: 'Save 60% on Adobe Creative Cloud with valid student ID.',
    discount: '60% OFF',
    imageUrl: '/adobe-logo.png',
    promo: 'ADOBESTUDENT',
    isActive: true,
    url: 'https://adobe.com/students',
    redeemType: 'Online',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    categoryName: 'Software & Tools',
    storeName: 'Adobe'
  }
];

const mockCategories = [
  { name: 'Software & Tools', count: 15 },
  { name: 'Music & Entertainment', count: 8 },
  { name: 'Food & Dining', count: 12 },
  { name: 'Clothing & Fashion', count: 6 }
];

const mockStores = [
  { name: 'Spotify', count: 3 },
  { name: 'Adobe', count: 5 },
  { name: 'Nike', count: 4 },
  { name: 'McDonald\'s', count: 7 }
];

const mockUniversities = [
  { name: 'Harvard University', count: 2 },
  { name: 'Stanford University', count: 3 },
  { name: 'MIT', count: 1 }
];

const DealsManagementPage: React.FC = () => {
  const [deals] = useState<Deal[]>(mockDeals);
  const [filters, setFilters] = useState<DealFilters>({
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');

  // Filter and sort deals
  const filteredDeals = useMemo(() => {
    let filtered = deals.filter(deal => {
      // Search filter
      if (filters.search && !deal.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !deal.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category && deal.categoryName !== filters.category) {
        return false;
      }

      // Store filter
      if (filters.store && deal.storeName !== filters.store) {
        return false;
      }

      // Redeem type filter
      if (filters.redeemType && deal.redeemType !== filters.redeemType) {
        return false;
      }

      // Active filter
      if (!filters.isActive && deal.isActive) {
        return false;
      }

      // Has promo filter
      if (filters.hasPromo && !deal.promo) {
        return false;
      }

      // Expiring soon filter (7 days)
      if (filters.isExpiringSoon && deal.endDate) {
        const endDate = new Date(deal.endDate);
        const now = new Date();
        const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 7 || diffDays <= 0) {
          return false;
        }
      }

      return true;
    });

    // Sort deals
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'endDate':
          const aDate = a.endDate ? new Date(a.endDate).getTime() : 0;
          const bDate = b.endDate ? new Date(b.endDate).getTime() : 0;
          comparison = aDate - bDate;
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [deals, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalDeals = deals.length;
    const activeDeals = deals.filter(d => d.isActive).length;
    const expiredDeals = deals.filter(d => {
      if (!d.endDate) return false;
      return new Date(d.endDate) < new Date();
    }).length;
    const expiringSoon = deals.filter(d => {
      if (!d.endDate) return false;
      const endDate = new Date(d.endDate);
      const now = new Date();
      const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    }).length;

    const categoryCount = deals.reduce((acc, deal) => {
      acc[deal.categoryName] = (acc[deal.categoryName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]?.[0];

    const storeCount = deals.reduce((acc, deal) => {
      acc[deal.storeName] = (acc[deal.storeName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topStore = Object.entries(storeCount).sort(([,a], [,b]) => b - a)[0]?.[0];

    return {
      totalDeals,
      activeDeals,
      expiredDeals,
      expiringSoon,
      topCategory,
      topStore,
    };
  }, [deals]);

  const handleCreateDeal = async (dealData: any) => {
    console.log('Creating deal:', dealData);
    // Implement API call here
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Student Deals
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Discover exclusive student discounts and offers
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Filters
            </Button>
            
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </div>
        </div>

        {/* Stats */}
        <DealStats {...stats} />

        {/* Filters */}
        <DealFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          categories={mockCategories}
          stores={mockStores}
          universities={mockUniversities}
          showAdvanced={showAdvancedFilters}
          dealCount={filteredDeals.length}
        />

        {/* Content Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {[
              { key: 'all', label: `All Deals (${filteredDeals.length})` },
              { key: 'active', label: `Active (${stats.activeDeals})` },
              { key: 'expiring', label: `Expiring Soon (${stats.expiringSoon})` },
              { key: 'expired', label: `Expired (${stats.expiredDeals})` }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Deal Content */}
        <div className="space-y-6">
          {activeTab === 'all' && (
            <DealGrid
              deals={filteredDeals}
              compact={viewMode === 'list'}
              emptyStateMessage="No deals found"
              emptyStateDescription="Try adjusting your filters or check back later for new deals."
            />
          )}

          {activeTab === 'active' && (
            <DealGrid
              deals={filteredDeals.filter(d => d.isActive)}
              compact={viewMode === 'list'}
              emptyStateMessage="No active deals"
              emptyStateDescription="All deals are currently inactive or expired."
            />
          )}

          {activeTab === 'expiring' && (
            <DealGrid
              deals={filteredDeals.filter(d => {
                if (!d.endDate) return false;
                const endDate = new Date(d.endDate);
                const now = new Date();
                const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays <= 7 && diffDays > 0;
              })}
              compact={viewMode === 'list'}
              emptyStateMessage="No deals expiring soon"
              emptyStateDescription="No deals are set to expire in the next 7 days."
            />
          )}

          {activeTab === 'expired' && (
            <DealGrid
              deals={filteredDeals.filter(d => {
                if (!d.endDate) return false;
                return new Date(d.endDate) < new Date();
              })}
              compact={viewMode === 'list'}
              emptyStateMessage="No expired deals"
              emptyStateDescription="No deals have expired yet."
            />
          )}
        </div>

        {/* Create Deal Modal */}
        <DealFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateDeal}
        />
      </div>
    </div>
  );
};

export default DealsManagementPage;
