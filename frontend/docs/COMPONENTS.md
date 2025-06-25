# Component Documentation

## Overview

This document provides detailed information about the components in the StudentPerks frontend application.

## Component Categories

### UI Components (`/components/ui/`)

Base UI components built on top of Radix UI primitives and styled with Tailwind CSS.

#### Button
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="md" onClick={handleClick}>
  Click me
</Button>
```

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `disabled`: boolean
- `onClick`: Function

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

### Deal Components (`/components/DealList/`)

Components related to displaying and managing deals.

#### DealsContainer
The main container component that orchestrates deal display with filtering, sorting, and pagination.

```tsx
import { DealsContainer } from '@/components/DealList';

<DealsContainer
  initialCategory="Technology"
  initialStore="Apple"
  showHeroSection={false}
/>
```

**Props:**
- `initialCategory`: string (optional) - Initial category filter
- `initialStore`: string (optional) - Initial store filter
- `showHeroSection`: boolean (optional) - Whether to show hero search section

**Features:**
- Automatic data fetching using React Query
- Real-time filtering and search
- Pagination support
- Loading and error states
- Responsive design

#### DealsGrid
Displays deals in a responsive grid layout.

```tsx
import { DealsGrid } from '@/components/DealList';

<DealsGrid
  deals={deals}
  loading={false}
  emptyMessage="No deals found"
/>
```

**Props:**
- `deals`: Deal[] - Array of deals to display
- `loading`: boolean (optional) - Loading state
- `emptyMessage`: string (optional) - Message when no deals found

#### DealCard
Individual deal card component.

```tsx
import DealCard from '@/components/DealCard';

<DealCard deal={deal} />
```

**Props:**
- `deal`: Deal - Deal object containing all deal information

**Features:**
- Responsive design
- Deal expiration indicators
- Store and category badges
- External link handling
- Image fallback support

### Admin Components (`/components/admin/`)

Components for the administrative interface.

#### AdminLayout
Layout wrapper for admin pages.

```tsx
import { AdminLayout } from '@/components/admin/shared';

<AdminLayout
  title="Dashboard"
  actions={<Button>Create New</Button>}
  navigation={<AdminNavigation />}
>
  <AdminContent />
</AdminLayout>
```

#### AdminTable
Generic table component for admin data.

```tsx
import { AdminTable } from '@/components/admin/shared';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
];

<AdminTable
  items={users}
  columns={columns}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Navigation Components

#### Navigation
Main application navigation.

```tsx
import Navigation from '@/components/Navigation';

<Navigation />
```

**Features:**
- Responsive mobile menu
- Theme toggle integration
- Authentication state awareness
- Active route highlighting

#### ThemeToggle
Theme switching component.

```tsx
import ThemeToggle from '@/components/ThemeToggle';

<ThemeToggle />
```

## Component Patterns

### Container/Presentation Pattern

We follow the container/presentation pattern where:

- **Container components** handle state, data fetching, and business logic
- **Presentation components** are pure functions that render UI based on props

Example:
```tsx
// Container component
const DealsContainer = () => {
  const { deals, loading } = useDealsQuery();
  return <DealsGrid deals={deals} loading={loading} />;
};

// Presentation component
const DealsGrid = ({ deals, loading }) => {
  if (loading) return <LoadingSpinner />;
  return <div>{deals.map(deal => <DealCard key={deal.id} deal={deal} />)}</div>;
};
```

### Compound Components

Some components use the compound component pattern for flexibility:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Render Props

For complex reusable logic, we use custom hooks instead of render props:

```tsx
const MyComponent = () => {
  const { data, loading, error } = useDealsQuery();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <DealsGrid deals={data} />;
};
```

## Styling Conventions

### Class Naming

We use Tailwind CSS utility classes with consistent patterns:

```tsx
// Container styles
className="container mx-auto px-6 md:px-8"

// Layout styles
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Interactive elements
className="hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
```

### Responsive Design

Mobile-first approach with breakpoints:

```tsx
className="text-sm md:text-base lg:text-lg"
className="hidden md:block"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Dark Mode

All components support dark mode:

```tsx
className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
```

## Accessibility

### ARIA Labels

```tsx
<button aria-label="Close modal" onClick={onClose}>
  <X className="h-4 w-4" />
</button>
```

### Keyboard Navigation

All interactive elements support keyboard navigation:

```tsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && onClick()}
  onClick={onClick}
>
  Interactive element
</div>
```

### Focus Management

```tsx
const Modal = ({ isOpen }) => {
  const firstFocusableRef = useRef();
  
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);
  
  // ...
};
```

## Testing Components

### Unit Testing

```tsx
import { render, screen } from '@testing-library/react';
import { DealCard } from '@/components/DealCard';

test('renders deal card with title', () => {
  const deal = { id: '1', title: 'Test Deal', /* ... */ };
  render(<DealCard deal={deal} />);
  
  expect(screen.getByText('Test Deal')).toBeInTheDocument();
});
```

### Integration Testing

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DealsContainer } from '@/components/DealList';

test('filters deals by category', async () => {
  const user = userEvent.setup();
  render(<DealsContainer />);
  
  const categoryButton = screen.getByText('Technology');
  await user.click(categoryButton);
  
  await waitFor(() => {
    expect(screen.getByText('Showing 5 of 10 deals in Technology')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Single Responsibility**: Each component should have one clear responsibility
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Error Boundaries**: Wrap components that might error with error boundaries
4. **Loading States**: Always handle loading and error states
5. **Accessibility**: Ensure all components are accessible
6. **Performance**: Use React.memo for expensive components
7. **Testing**: Write tests for all component behavior
