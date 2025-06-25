import { useErrorHandler } from '@/contexts/ErrorContext';
import { CreateStoreRequest, storeService, UpdateStoreRequest } from '@/services/storeService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const STORES_QUERY_KEY = 'stores';

// Get all stores
export const useStoresQuery = () => {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: [STORES_QUERY_KEY],
    queryFn: async () => {
      try {
        return await storeService.getStores();
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
  });
};

// Create store mutation
export const useCreateStoreMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: (data: CreateStoreRequest) => storeService.createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] });
      showSuccess('Store created successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Update store mutation
export const useUpdateStoreMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreRequest }) => 
      storeService.updateStore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] });
      showSuccess('Store updated successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Delete store mutation
export const useDeleteStoreMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: (id: string) => storeService.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORES_QUERY_KEY] });
      showSuccess('Store deleted successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};
