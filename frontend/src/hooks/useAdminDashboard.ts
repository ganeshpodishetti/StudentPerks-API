import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { dealService } from '@/services/dealService';
import { Deal } from '@/types/Deal';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminDashboard = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
        toast({
          title: "Authentication Issue",
          description: "You are not logged in or your session has expired. Please log in first.",
          variant: "destructive",
        });
        return;
      }
      
      if (response.ok) {
        toast({
          title: "Connectivity Test",
          description: "✅ Backend connection successful!",
        });
      } else {
        toast({
          title: "Connectivity Test", 
          description: `❌ Backend responded with status ${response.status}`,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Connectivity test failed:', error);
      toast({
        title: "Connectivity Test",
        description: "❌ Cannot connect to backend server",
        variant: "destructive",
      });
    }
  };

  const loadDeals = async () => {
    try {
      setIsLoading(true);
      const dealsData = await dealService.getDeals();
      setDeals(dealsData);
    } catch (error: any) {
      console.error('Error loading deals:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to access admin features",
          variant: "destructive",
        });
        // Optionally redirect to login
        navigate('/login');
        return;
      }
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load deals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
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

    try {
      await dealService.deleteDeal(dealId);
      setDeals(deals.filter(deal => deal.id !== dealId));
      toast({
        title: "Success",
        description: "Deal deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting deal:', error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to delete deals",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete deal",
        variant: "destructive",
      });
    }
  };

  const handleSaveDeal = async (dealData: any) => {
    try {
      console.log('Attempting to save deal:', dealData);
      
      if (editingDeal) {
        const updatedDeal = await dealService.updateDeal(editingDeal.id, dealData);
        setDeals(deals.map(deal => deal.id === editingDeal.id ? updatedDeal : deal));
        toast({
          title: "Success",
          description: "Deal updated successfully",
        });
      } else {
        const newDeal = await dealService.createDeal(dealData);
        setDeals([newDeal, ...deals]);
        toast({
          title: "Success",
          description: "Deal created successfully",
        });
      }
      setIsModalOpen(false);
      setEditingDeal(null);
    } catch (error: any) {
      console.error('Error saving deal:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        // Clear user data and redirect to login
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
      
      const action = editingDeal ? 'update' : 'create';
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.title 
        || error.message 
        || `Failed to ${action} deal`;
        
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  useEffect(() => {
    // Check authentication status
    console.log('Admin Dashboard - Auth Status:', {
      user,
      isAuthenticated: !!user,
      userString: JSON.stringify(user)
    });
    
    debugAuth();
    loadDeals();
  }, []);

  return {
    deals,
    isLoading,
    isModalOpen,
    editingDeal,
    user,
    handleLogout,
    handleCreateDeal,
    handleEditDeal,
    handleDeleteDeal,
    handleSaveDeal,
    closeModal,
    debugAuth,
    testConnectivity,
  };
};
