/// <reference types="vite/client" />
import axios from 'axios';
import { Deal } from '../types/Deal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5254';

// Create axios instance with default config
const dealApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export interface CreateDealRequest {
  title: string;
  description: string;
  discount: string;
  imageUrl: string;
  promo?: string;
  isActive: boolean;
  url: string;
  redeemType: string;
  startDate?: string;
  endDate?: string;
  categoryName: string;
  storeName: string;
}

export interface UpdateDealRequest extends CreateDealRequest {}

export const dealService = {
  async getDeals(): Promise<Deal[]> {
    try {
      const response = await dealApi.get('/api/deals');
      return response.data;
    } catch (error) {
      console.error('Error fetching deals:', error);
      throw error;
    }
  },

  async getDeal(id: string): Promise<Deal> {
    try {
      const response = await dealApi.get(`/api/deals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching deal:', error);
      throw error;
    }
  },

  async createDeal(dealData: CreateDealRequest): Promise<Deal> {
    try {
      const response = await dealApi.post('/api/deals', dealData);
      return response.data;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  },

  async updateDeal(id: string, dealData: UpdateDealRequest): Promise<Deal> {
    try {
      const response = await dealApi.put(`/api/deals/${id}`, dealData);
      return response.data;
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  },

  async deleteDeal(id: string): Promise<void> {
    try {
      await dealApi.delete(`/api/deals/${id}`);
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  },

  async getDealsByCategory(categoryName: string): Promise<Deal[]> {
    try {
      const response = await dealApi.get(`/api/deals/category?name=${encodeURIComponent(categoryName)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching deals by category:', error);
      throw error;
    }
  },

  async getDealsByStore(storeName: string): Promise<Deal[]> {
    try {
      const response = await dealApi.get(`/api/deals/store?name=${encodeURIComponent(storeName)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching deals by store:', error);
      throw error;
    }
  }
};

// Keep the legacy function for backward compatibility
export const fetchDeals = dealService.getDeals;