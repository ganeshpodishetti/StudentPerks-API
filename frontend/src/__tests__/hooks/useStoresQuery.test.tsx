import { ErrorProvider } from '@/contexts/ErrorContext';
import { useCreateStoreMutation, useStoresQuery } from '@/hooks/queries/useStoresQuery';
import { storeService } from '@/services/storeService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the store service
vi.mock('@/services/storeService');
const mockStoreService = vi.mocked(storeService);

// Mock the error context to avoid toast dependency
vi.mock('@/contexts/ErrorContext', () => ({
  ErrorProvider: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  useErrorHandler: () => ({
    handleApiError: vi.fn(),
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));

// Test wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ErrorProvider>
          {children}
        </ErrorProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('useStoresQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch stores successfully', async () => {
    const mockStores = [
      { id: '1', name: 'Store 1', description: 'Test store 1' },
      { id: '2', name: 'Store 2', description: 'Test store 2' },
    ];

    mockStoreService.getStores.mockResolvedValue(mockStores);

    const { result } = renderHook(() => useStoresQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockStores);
    expect(mockStoreService.getStores).toHaveBeenCalledTimes(1);
  });

  it('should handle error when fetching stores fails', async () => {
    const error = new Error('Failed to fetch stores');
    mockStoreService.getStores.mockRejectedValue(error);

    const { result } = renderHook(() => useStoresQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useCreateStoreMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create store successfully', async () => {
    const newStore = { id: '3', name: 'New Store', description: 'New test store' };
    const storeData = { name: 'New Store', description: 'New test store' };

    mockStoreService.createStore.mockResolvedValue(newStore);

    const { result } = renderHook(() => useCreateStoreMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(storeData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockStoreService.createStore).toHaveBeenCalledWith(storeData);
  });

  it('should handle error when creating store fails', async () => {
    const error = new Error('Failed to create store');
    const storeData = { name: 'New Store', description: 'New test store' };

    mockStoreService.createStore.mockRejectedValue(error);

    const { result } = renderHook(() => useCreateStoreMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(storeData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});
