import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Store, storeService } from '@/services/storeService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadStores = async () => {
    try {
      setIsLoading(true);
      const storesData = await storeService.getStores();
      setStores(storesData);
    } catch (error: any) {
      console.error('Error loading stores:', error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to access admin features",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load stores",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

    try {
      await storeService.deleteStore(storeId);
      setStores(stores.filter(store => store.id !== storeId));
      toast({
        title: "Success",
        description: "Store deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting store:', error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to delete stores",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete store",
        variant: "destructive",
      });
    }
  };

  const handleSaveStore = async (storeData: any) => {
    try {
      console.log('Attempting to save store:', storeData);
      
      if (editingStore) {
        const updatedStore = await storeService.updateStore(editingStore.id, storeData);
        setStores(stores.map(store => store.id === editingStore.id ? updatedStore : store));
        toast({
          title: "Success",
          description: "Store updated successfully",
        });
      } else {
        const newStore = await storeService.createStore(storeData);
        setStores([newStore, ...stores]);
        toast({
          title: "Success",
          description: "Store created successfully",
        });
      }
      setIsModalOpen(false);
      setEditingStore(null);
    } catch (error: any) {
      console.error('Error saving store:', error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      
      if (error.response?.status === 403) {
        toast({
          title: "Permission Denied", 
          description: "You don't have permission to perform this action.",
          variant: "destructive",
        });
        return;
      }
      
      const action = editingStore ? 'update' : 'create';
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.title 
        || error.message 
        || `Failed to ${action} store`;
        
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
  };

  useEffect(() => {
    loadStores();
  }, []);

  return {
    stores,
    isLoading,
    isModalOpen,
    editingStore,
    user,
    handleCreateStore,
    handleEditStore,
    handleDeleteStore,
    handleSaveStore,
    closeModal,
  };
};
