import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/contexts/ErrorContext';
import {
    useCreateStoreMutation,
    useDeleteStoreMutation,
    useStoresQuery,
    useUpdateStoreMutation
} from '@/hooks/queries/useStoresQuery';
import { CreateStoreRequest, Store, UpdateStoreRequest } from '@/services/storeService';
import { useState } from 'react';

export const useAdminStores = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const { user } = useAuth();
  const { showSuccess } = useErrorHandler();

  // React Query hooks
  const { data: stores = [], isLoading } = useStoresQuery();
  const createStoreMutation = useCreateStoreMutation();
  const updateStoreMutation = useUpdateStoreMutation();
  const deleteStoreMutation = useDeleteStoreMutation();

  const handleCreateStore = () => {
    setEditingStore(null);
    setIsModalOpen(true);
  };

  const handleEditStore = (store: Store) => {
    setEditingStore(store);
    setIsModalOpen(true);
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!window.confirm('Are you sure you want to delete this store?')) {
      return;
    }

    deleteStoreMutation.mutate(storeId);
  };

  const handleSaveStore = async (storeData: CreateStoreRequest | UpdateStoreRequest) => {
    try {
      if (editingStore) {
        await updateStoreMutation.mutateAsync({ 
          id: editingStore.id, 
          data: storeData as UpdateStoreRequest 
        });
      } else {
        await createStoreMutation.mutateAsync(storeData as CreateStoreRequest);
      }
      closeModal();
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Error saving store:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
  };

  return {
    stores,
    isLoading: isLoading || createStoreMutation.isPending || updateStoreMutation.isPending,
    isModalOpen,
    editingStore,
    user,
    handleCreateStore,
    handleEditStore,
    handleDeleteStore,
    handleSaveStore,
    closeModal,
    isDeleting: deleteStoreMutation.isPending,
    isSaving: createStoreMutation.isPending || updateStoreMutation.isPending,
  };
};
