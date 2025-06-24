export type RedeemType = 'Online' | 'InStore' | 'Both' | 'Unknown';

export interface Deal {
  id: string;
  title: string;
  description: string;
  discount?: string;
  imageUrl?: string;
  promo?: string;
  isActive: boolean;
  url: string;
  redeemType: RedeemType;
  startDate?: string;
  endDate?: string;
  categoryName: string;
  storeName: string;
}