import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/contexts/ErrorContext';
import { submittedDealService } from '@/services/submittedDealService';
import { SubmittedDeal } from '@/types/SubmittedDeal';
import { useEffect, useState } from 'react';

export const useAdminSubmittedDeals = () => {
  const [deals, setDeals] = useState<SubmittedDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const { showError } = useErrorHandler();

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setIsLoading(true);
      const data = await submittedDealService.getSubmittedDeals();
      setDeals(data);
    } catch (error) {
      console.error('Error loading submitted deals:', error);
      showError('Failed to load submitted deals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      await submittedDealService.markAsRead(id, isRead);
      
      // Update the local state
      setDeals(prev => prev.map(deal => 
        deal.id === id ? { ...deal, markedAsRead: isRead } : deal
      ));
    } catch (error) {
      console.error('Error marking deal as read:', error);
      showError('Failed to update deal status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submitted deal?')) {
      return;
    }

    try {
      await submittedDealService.deleteSubmittedDeal(id);
      
      // Remove from local state
      setDeals(prev => prev.filter(deal => deal.id !== id));
    } catch (error) {
      console.error('Error deleting submitted deal:', error);
      showError('Failed to delete submitted deal');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const testConnectivity = async () => {
    try {
      await submittedDealService.getSubmittedDeals();
      alert('API connection successful!');
    } catch (error) {
      console.error('API connection test failed:', error);
      alert('API connection failed. Check console for details.');
    }
  };

  // Get stats
  const stats = {
    total: deals.length,
    unread: deals.filter(deal => !deal.markedAsRead).length,
    read: deals.filter(deal => deal.markedAsRead).length,
  };

  return {
    deals,
    isLoading,
    user,
    stats,
    handleMarkAsRead,
    handleDelete,
    handleLogout,
    testConnectivity,
    refreshDeals: loadDeals,
  };
};
