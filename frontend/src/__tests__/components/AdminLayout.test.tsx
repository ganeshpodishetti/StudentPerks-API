import { AdminLayout } from '@/components/admin/shared/AdminLayout';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('AdminLayout', () => {
  it('should render children content', () => {
    render(
      <AdminLayout>
        <div>Test content</div>
      </AdminLayout>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render navigation when provided', () => {
    const mockNavigation = <nav data-testid="navigation">Navigation</nav>;
    
    render(
      <AdminLayout navigation={mockNavigation}>
        <div>Content</div>
      </AdminLayout>
    );

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('should render title when provided', () => {
    render(
      <AdminLayout title="Test Title">
        <div>Content</div>
      </AdminLayout>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title');
  });

  it('should render actions when provided', () => {
    const mockActions = <button data-testid="action-button">Action</button>;
    
    render(
      <AdminLayout title="Test" actions={mockActions}>
        <div>Content</div>
      </AdminLayout>
    );

    expect(screen.getByTestId('action-button')).toBeInTheDocument();
  });

  it('should apply correct CSS classes for layout', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    const layout = screen.getByText('Content').closest('.min-h-screen');
    expect(layout).toHaveClass('bg-gray-50', 'dark:bg-neutral-950');
  });

  it('should render without title or actions when not provided', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
