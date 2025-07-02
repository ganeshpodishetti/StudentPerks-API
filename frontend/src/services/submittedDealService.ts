import { MarkAsReadDealRequest, SubmitDealRequest, SubmittedDeal } from '../types/SubmittedDeal';
import apiClient, { publicApiClient } from './apiClient';

export const submittedDealService = {
  // Public endpoint - no authentication required
  async submitDeal(dealData: SubmitDealRequest): Promise<{ message: string }> {
    try {
      console.log('Submitting deal:', dealData);
      const response = await publicApiClient.post('/api/submit-deal', dealData);
      console.log('Deal submission response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting deal:', error);
      throw error;
    }
  },

  // Admin endpoints - authentication required
  async getSubmittedDeals(): Promise<SubmittedDeal[]> {
    try {
      const response = await apiClient.get('/api/get-submitted-deals');
      console.log('Submitted deals API Response:', {
        status: response.status,
        dataLength: response.data?.length || 0,
      });
      return response.data || [];
    } catch (error: any) {
      console.error('Error fetching submitted deals:', error);
      // If we get 204 No Content, return empty array
      if (error.response?.status === 204) {
        return [];
      }
      throw error;
    }
  },

  async markAsRead(id: string, markedAsRead: boolean): Promise<{ message: string }> {
    try {
      const requestData: MarkAsReadDealRequest = { markedAsRead };
      const response = await apiClient.put(`/api/mark-as-read/${id}`, requestData);
      console.log('Mark as read response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error marking deal as read:', error);
      throw error;
    }
  },

  async deleteSubmittedDeal(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/api/delete-submitted-deal/${id}`);
      console.log('Delete submitted deal response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting submitted deal:', error);
      throw error;
    }
  },
};
