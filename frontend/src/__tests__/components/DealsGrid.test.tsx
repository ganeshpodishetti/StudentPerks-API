import { DealsGrid } from '@/components/DealList/DealsGrid';
import { Deal } from '@/types/Deal';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock the DealCard component
vi.mock('@/components/DealCard', () => ({
  default: ({ deal }: { deal: Deal }) => (
    <div data-testid={`deal-card-${deal.id}`}>
      {deal.title}
    </div>
  )
}));

const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Test Deal 1',
    description: 'Test description 1',
    storeName: 'Test Store',
    categoryName: 'Technology',
    isActive: true,
    url: 'https://example.com',
    redeemType: 'Online',
  },
  {
    id: '2',
    title: 'Test Deal 2', 
    description: 'Test description 2',
    storeName: 'Test Store 2',
    categoryName: 'Fashion',
    isActive: true,
    url: 'https://example.com',
    redeemType: 'InStore',
  },
];

describe('DealsGrid', () => {
  it('renders deals when provided', () => {
    render(<DealsGrid deals={mockDeals} />);
    
    expect(screen.getByTestId('deal-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('deal-card-2')).toBeInTheDocument();
    expect(screen.getByText('Test Deal 1')).toBeInTheDocument();
    expect(screen.getByText('Test Deal 2')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    render(<DealsGrid deals={[]} loading={true} />);
    
    // Should show loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty message when no deals', () => {
    const emptyMessage = 'No deals available';
    render(<DealsGrid deals={[]} emptyMessage={emptyMessage} />);
    
    expect(screen.getByText(emptyMessage)).toBeInTheDocument();
  });

  it('uses default empty message when none provided', () => {
    render(<DealsGrid deals={[]} />);
    
    expect(screen.getByText('No deals available')).toBeInTheDocument();
  });

  it('renders deals in a grid layout', () => {
    render(<DealsGrid deals={mockDeals} />);
    
    const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    expect(gridContainer).toBeInTheDocument();
  });
});
