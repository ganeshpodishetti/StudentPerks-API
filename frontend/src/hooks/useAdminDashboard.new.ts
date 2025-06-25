import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/contexts/ErrorContext';
import {
    useCreateDealMutation,
    useDealsQuery,
    useDeleteDealMutation,
    useUpdateDealMutation
} from '@/hooks/queries/useDealsQuery';
import { authService } from '@/services/authService';
import { Deal } from '@/types/Deal';
import { useState } from 'react';

export const useAdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const { user, logout } = useAuth();
  const { showError, showSuccess } = useErrorHandler();

  // React Query hooks
  const { data: deals = [], isLoading } = useDealsQuery();
  const createDealMutation = useCreateDealMutation();
  const updateDealMutation = useUpdateDealMutation();
  const deleteDealMutation = useDeleteDealMutation();

  // Debug function to check authentication state
  const debugAuth = () => {
    console.log('=== Authentication Debug Info ===');
    console.log('User from context:', user);
    console.log('Is authenticated:', !!user);
    console.log('LocalStorage user:', localStorage.getItem('user'));
    console.log('Access token:', authService.getAccessToken());
    console.log('All cookies:', document.cookie);
    console.log('================================');
  };

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
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      
      if (response.status === 401) {
        showError("You need to be logged in to access admin features", "Authentication Issue");
        return;
      }
      
      if (response.status === 200) {
        showSuccess("Successfully connected to backend API", "Connectivity Test Passed");
      } else {
        showError(`Unexpected response status: ${response.status}`, "Connectivity Issue");
      }
    } catch (error: any) {
      console.error('Connectivity test failed:', error);
      showError(error.message || "Could not connect to backend API", "Connection Failed");
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
    if (!window.confirm('Are you sure you want to delete this deal?')) {
      return;
    }

    deleteDealMutation.mutate(dealId);
  };

  const handleSaveDeal = async (dealData: any) => {
    try {
      if (editingDeal) {
        await updateDealMutation.mutateAsync({ 
          id: editingDeal.id, 
          data: dealData 
        });
      } else {
        await createDealMutation.mutateAsync(dealData);
      }
      closeModal();
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Error saving deal:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  return {
    deals,
    isLoading: isLoading || createDealMutation.isPending || updateDealMutation.isPending,
    isModalOpen,
    editingDeal,
    user,
    handleCreateDeal,
    handleEditDeal,
    handleDeleteDeal,
    handleSaveDeal,
    handleLogout,
    debugAuth,
    testConnectivity,
    closeModal,
    isDeleting: deleteDealMutation.isPending,
    isSaving: createDealMutation.isPending || updateDealMutation.isPending,
  };
};
