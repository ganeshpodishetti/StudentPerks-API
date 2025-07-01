import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/contexts/ErrorContext';
import {
    useCreateDealMutation,
    useDealsQuery,
    useDeleteDealMutation,
    useUpdateDealMutation
} from '@/hooks/queries/useDealsQuery';
import { Deal } from '@/types/Deal';
import { useState } from 'react';

export const useAdminDeals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const { user, logout } = useAuth();
  const { showError, showSuccess } = useErrorHandler();

  // React Query hooks
  const { data: deals = [], isLoading } = useDealsQuery();
  const createDealMutation = useCreateDealMutation();
  const updateDealMutation = useUpdateDealMutation();
  const deleteDealMutation = useDeleteDealMutation();

  // Test connectivity function
  const testConnectivity = async () => {
    try {
      console.log('Testing backend connectivity...');
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5254';
      
      // Test 1: Basic API connection
      const response = await fetch(API_BASE_URL + '/api/deals', {
        credentials: 'include',
        method: 'GET'
      });
      
      console.log('API Response:', {
        status: response.status,
        ok: response.ok,
        headers: response.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched deals:', data);
      
      showSuccess('Backend connectivity test successful!');
    } catch (error) {
      console.error('Connectivity test failed:', error);
      showError(`Connectivity test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCreateDeal = () => {
    setEditingDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) {
      return;
    }

    try {
      await deleteDealMutation.mutateAsync(dealId);
      showSuccess('Deal deleted successfully');
    } catch (error) {
      console.error('Error deleting deal:', error);
      showError('Failed to delete deal');
    }
  };

  const handleSaveDeal = async (dealData: any) => {
    try {
      if (editingDeal) {
        // Update existing deal
        await updateDealMutation.mutateAsync({
          id: editingDeal.id,
          data: dealData
        });
        showSuccess('Deal updated successfully');
      } else {
        // Create new deal
        await createDealMutation.mutateAsync(dealData);
        showSuccess('Deal created successfully');
      }
      setIsModalOpen(false);
      setEditingDeal(null);
    } catch (error) {
      console.error('Error saving deal:', error);
      showError(editingDeal ? 'Failed to update deal' : 'Failed to create deal');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  return {
    deals,
    isLoading,
    isModalOpen,
    editingDeal,
    user,
    handleCreateDeal,
    handleEditDeal,
    handleDeleteDeal,
    handleSaveDeal,
    handleLogout,
    testConnectivity,
    closeModal
  };
};
