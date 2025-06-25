# StudentPerks Frontend - Architecture Guide

## Overview

This document provides a comprehensive guide to the StudentPerks frontend architecture after the major refactoring effort. The application now follows modern React patterns with a focus on maintainability, performance, and developer experience.

## 🏗️ Core Architecture

### Architectural Principles

1. **Single Responsibility Principle (SRP)**
   - Each component, hook, and service has one clear responsibility
   - Components focus solely on presentation logic
   - Hooks manage specific business logic
   - Services handle API communication

2. **Separation of Concerns**
   - **Components**: UI presentation and user interactions
   - **Hooks**: Business logic and state management  
   - **Services**: API communication and data transformation
   - **Types**: Type definitions and interfaces
   - **Utils**: Pure utility functions

3. **Composition over Inheritance**
   - Components built using composition patterns
   - Higher-order components for shared functionality
   - Custom hooks for reusable logic

### Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.x
- **Styling**: TailwindCSS 4.x with Shadcn-ui components
- **State Management**: TanStack React Query v5 for server state
- **Routing**: React Router v7
- **Testing**: Vitest + React Testing Library
- **Error Handling**: React Error Boundaries + Context API

## 📁 Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── ui/                    # Base Shadcn-ui components
│   ├── DealList/              # Deal listing feature components
│   │   ├── DealsContainer.tsx # Main container component
│   │   ├── DealsGrid.tsx      # Grid presentation component
│   │   ├── DealsFilters.tsx   # Filter controls
│   │   ├── DealsPagination.tsx# Pagination controls
│   │   └── index.ts           # Clean exports
│   ├── admin/                 # Admin-specific components
│   │   └── shared/            # Shared admin components
│   │       ├── AdminLayout.tsx# Consistent admin layout
│   │       ├── AdminTable.tsx # Reusable data tables
│   │       ├── AdminCards.tsx # Card-based layouts
│   │       └── AdminActions.tsx# Common admin actions
│   └── ErrorBoundary/         # Error handling components
├── contexts/                  # React context providers
│   ├── AuthContext.tsx        # Authentication state
│   └── ErrorContext.tsx       # Centralized error handling
├── hooks/                     # Custom hooks
│   ├── deals/                 # Deal-related business logic
│   │   ├── useDealsData.ts    # Data fetching logic
│   │   ├── useDealsFilter.ts  # Filtering and sorting
│   │   └── useDealsPagination.ts # Pagination logic
│   └── queries/               # React Query hooks
│       ├── useDealsQuery.ts   # Deal CRUD operations
│       ├── useStoresQuery.ts  # Store CRUD operations
│       └── useCategoriesQuery.ts # Category CRUD operations
├── pages/                     # Page components (routes)
├── providers/                 # Global providers wrapper
│   └── AppProviders.tsx       # Centralized provider setup
├── services/                  # API service layer
├── types/                     # TypeScript type definitions
│   └── common/                # Shared type definitions
├── utils/                     # Utility functions
├── styles/                    # Global styles and design tokens
└── __tests__/                 # Test files
    ├── components/            # Component tests
    ├── hooks/                 # Hook tests
    └── utils/                 # Utility tests
```

## 🔄 Data Flow Architecture

### Request Flow

1. **User Interaction** → Component event handler
2. **Component** → Custom hook (business logic)
3. **Hook** → React Query mutation/query
4. **React Query** → Service function
5. **Service** → API call with proper error handling
6. **Response** flows back through the chain with proper transformations

### State Management Strategy

#### Server State (React Query)
```typescript
// Centralized query key management
export const dealKeys = {
  all: ['deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  list: (filters: string) => [...dealKeys.lists(), { filters }] as const,
  details: () => [...dealKeys.all, 'detail'] as const,
  detail: (id: string) => [...dealKeys.details(), id] as const,
};

// Query hook with error handling
export const useDealsQuery = () => {
  const { handleApiError } = useErrorHandler();
  
  return useQuery({
    queryKey: dealKeys.lists(),
    queryFn: async () => {
      try {
        return await dealService.getDeals();
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
  });
};
```

#### Client State (Context + Hooks)
- Authentication state via `AuthContext`
- Error handling via `ErrorContext`
- Local component state via `useState`/`useReducer`

## 🧩 Component Architecture

### Component Categories

#### 1. Container Components
Handle business logic and state management:
```typescript
export const DealsContainer: React.FC<Props> = ({ initialFilters }) => {
  const { data: deals, isLoading } = useDealsData(initialFilters);
  const { filteredDeals, setFilters } = useDealsFilter(deals, initialFilters);
  const { paginatedDeals, pagination } = useDealsPagination(filteredDeals);
  
  return (
    <div>
      <DealsFilters onFiltersChange={setFilters} />
      <DealsGrid deals={paginatedDeals} loading={isLoading} />
      <DealsPagination {...pagination} />
    </div>
  );
};
```

#### 2. Presentation Components
Focus purely on UI rendering:
```typescript
export const DealsGrid = memo<DealsGridProps>(({ deals, loading }) => {
  if (loading) return <DealsSkeleton />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deals.map(deal => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
});
```

#### 3. Shared/Layout Components
Provide consistent structure across pages:
```typescript
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  actions,
  navigation,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
        {/* Header, Navigation, Content */}
      </div>
    </div>
  );
};
```

## 🔧 Custom Hooks Pattern

### Business Logic Hooks
Encapsulate specific business logic:
```typescript
export const useDealsFilter = (deals: Deal[], initialFilters: Filters) => {
  const [filters, setFilters] = useState(initialFilters);
  
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Complex filtering logic
    }).sort((a, b) => {
      // Complex sorting logic
    });
  }, [deals, filters]);
  
  return { filteredDeals, filters, setFilters };
};
```

### React Query Hooks
Handle server state with proper error handling:
```typescript
export const useCreateDealMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, handleApiError } = useErrorHandler();
  
  return useMutation({
    mutationFn: dealService.createDeal,
    onSuccess: (newDeal: Deal) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all });
      showSuccess('Deal created successfully');
    },
    onError: handleApiError,
  });
};
```

## 🚨 Error Handling

### Global Error Boundary
```typescript
export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logErrorToService}
    >
      {children}
    </ReactErrorBoundary>
  );
};
```

### Centralized Error Context
```typescript
export const useErrorHandler = () => {
  const { toast } = useToast();
  
  const handleApiError = (error: any) => {
    // Handle different error types
    if (error.response?.status === 401) {
      showError("Please log in again", "Authentication Error");
    } else if (error.response?.status === 403) {
      showError("Access denied", "Permission Error");
    }
    // ... other error types
  };
  
  return { handleApiError, showError, showSuccess };
};
```

## ⚡ Performance Optimizations

### Code Splitting
```typescript
// Lazy loading of admin pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminStoresPage = lazy(() => import('./pages/AdminStoresPage'));

// Route-based splitting
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/stores" element={<AdminStoresPage />} />
  </Routes>
</Suspense>
```

### Component Memoization
```typescript
// Memoize expensive components
export const DealsGrid = memo<DealsGridProps>(({ deals, loading }) => {
  // Component implementation
});

// Memoize expensive computations
const sortedDeals = useMemo(() => {
  return deals.sort((a, b) => /* expensive sorting logic */);
}, [deals, sortOrder]);
```

### React Query Optimization
```typescript
// Intelligent caching configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});
```

## 🧪 Testing Strategy

### Test Organization
```typescript
// Hook testing with React Query
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>{children}</ErrorProvider>
    </QueryClientProvider>
  );
};

// Component testing
test('DealsGrid renders deals correctly', () => {
  render(<DealsGrid deals={mockDeals} loading={false} />);
  expect(screen.getByText('Deal Title')).toBeInTheDocument();
});
```

### Test Categories
1. **Unit Tests**: Custom hooks, utility functions
2. **Component Tests**: Rendering, interactions, accessibility
3. **Integration Tests**: Component + hook interactions
4. **E2E Tests**: Critical user journeys (future)

## 🎨 Design System

### Design Tokens
```typescript
// Centralized design tokens
export const designTokens = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
  },
};
```

### Component Variants
```typescript
// Consistent styling with CVA
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
  }
);
```

## 🚀 Deployment & Performance

### Build Optimization
- Tree shaking for unused code elimination
- Dynamic imports for code splitting
- Asset optimization and compression
- Bundle analysis and monitoring

### Performance Monitoring
- Core Web Vitals tracking
- React DevTools Profiler integration
- Bundle size monitoring
- Query performance analysis

## 📋 Migration Guide

This refactoring transformed the application from a basic component structure to a sophisticated, scalable architecture. Key improvements include:

1. **State Management**: Migrated from local state to React Query
2. **Component Structure**: Split large components into focused, testable units
3. **Error Handling**: Centralized error management with user-friendly messages
4. **Performance**: Added memoization, code splitting, and query optimization
5. **Testing**: Comprehensive test coverage with proper mocking
6. **Type Safety**: Enhanced TypeScript integration throughout

The new architecture provides a solid foundation for future feature development while maintaining excellent developer experience and application performance.
