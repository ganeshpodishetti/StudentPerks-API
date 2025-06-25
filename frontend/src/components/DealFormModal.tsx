import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { categoryService } from '@/services/categoryService';
import { CreateDealRequest } from '@/services/dealService';
import { storeService } from '@/services/storeService';
import { Deal, RedeemType } from '@/types/Deal';
import { useEffect, useState } from 'react';

// Form data interface that allows optional fields to be empty strings
interface FormData {
  title: string;
  description: string;
  discount: string;
  imageUrl?: string;
  promo?: string;
  isActive: boolean;
  url?: string;
  redeemType: RedeemType;
  startDate?: string;
  endDate?: string;
  categoryName: string;
  storeName: string;
}

// Helper function to format date for backend as UTC ISO string
const formatDateForBackend = (date: string): string | null => {
  if (!date) return null;
  
  // Create a Date object from the input (assumes local date input like "2024-12-25")
  const dateObj = new Date(date + 'T00:00:00.000Z'); // Force UTC interpretation
  if (isNaN(dateObj.getTime())) return null; // Invalid date
  
  // Return as UTC ISO string
  return dateObj.toISOString();
};

// Helper function to format date for input field (YYYY-MM-DD)
const formatDateForInput = (date: string): string => {
  if (!date) return '';
  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  // Otherwise, convert from ISO string
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return ''; // Invalid date
  return dateObj.toISOString().split('T')[0];
};

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dealData: CreateDealRequest) => Promise<void>;
  deal?: Deal | null;
}

export default function DealFormModal({ isOpen, onClose, onSave, deal }: DealFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    discount: '',
    imageUrl: '',
    promo: '',
    isActive: true,
    url: '',
    redeemType: 'Online',
    startDate: '',
    endDate: '',
    categoryName: '',
    storeName: '',
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadStores();
      
      if (deal) {
        setFormData({
          title: deal.title,
          description: deal.description,
          discount: deal.discount || '',
          imageUrl: deal.imageUrl || '',
          promo: deal.promo || '',
          isActive: deal.isActive,
          url: deal.url || '',
          redeemType: deal.redeemType || 'Online',
          startDate: formatDateForInput(deal.startDate || '') || '',
          endDate: formatDateForInput(deal.endDate || '') || '',
          categoryName: deal.categoryName,
          storeName: deal.storeName,
        });
      } else {
        // Reset form for new deal
        setFormData({
          title: '',
          description: '',
          discount: '',
          imageUrl: '',
          promo: '',
          isActive: true,
          url: '',
          redeemType: 'Online',
          startDate: '',
          endDate: '',
          categoryName: '',
          storeName: '',
        });
      }
    }
  }, [isOpen, deal]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadStores = async () => {
    try {
      const storesData = await storeService.getStores();
      setStores(storesData);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create clean deal data
      const dealData: CreateDealRequest = {
        title: formData.title,
        description: formData.description,
        discount: formData.discount,
        isActive: formData.isActive,
        redeemType: formData.redeemType,
        categoryName: formData.categoryName,
        storeName: formData.storeName,
      };

      // Add optional fields only if they have values
      if (formData.imageUrl?.trim()) {
        dealData.imageUrl = formData.imageUrl.trim();
      }
      
      if (formData.promo?.trim()) {
        dealData.promo = formData.promo.trim();
      }
      
      if (formData.url?.trim()) {
        dealData.url = formData.url.trim();
      }
      
      if (formData.startDate?.trim()) {
        const formattedStartDate = formatDateForBackend(formData.startDate);
        if (formattedStartDate) {
          dealData.startDate = formattedStartDate;
        }
      }
      
      if (formData.endDate?.trim()) {
        const formattedEndDate = formatDateForBackend(formData.endDate);
        if (formattedEndDate) {
          dealData.endDate = formattedEndDate;
        }
      }
      
      console.log('Sending deal data:', dealData);
      
      await onSave(dealData);
      onClose();
    } catch (error) {
      console.error('Error saving deal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{deal ? 'Edit Deal' : 'Create New Deal'}</DialogTitle>
          <DialogDescription>
            {deal ? 'Update the deal information below.' : 'Fill in the details to create a new deal.'} 
            You can select existing categories/stores or type new names to create them.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Deal title"
              />
            </div>

            <div>
              <Label htmlFor="discount">Discount *</Label>
              <Input
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                required
                placeholder="e.g., 50% OFF"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Deal description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryName">Category *</Label>
              <Combobox
                options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
                value={formData.categoryName}
                onValueChange={(value) => handleSelectChange('categoryName', value)}
                placeholder="Select or create category"
                searchPlaceholder="Search categories..."
                emptyText="No categories found. Type to create new."
                customText="Create category"
                allowCustom={true}
              />
              <p className="text-xs text-gray-500 mt-1">Select existing or type new category name</p>
            </div>

            <div>
              <Label htmlFor="storeName">Store *</Label>
              <Combobox
                options={stores.map(store => ({ value: store.name, label: store.name }))}
                value={formData.storeName}
                onValueChange={(value) => handleSelectChange('storeName', value)}
                placeholder="Select or create store"
                searchPlaceholder="Search stores..."
                emptyText="No stores found. Type to create new."
                customText="Create store"
                allowCustom={true}
              />
              <p className="text-xs text-gray-500 mt-1">Select existing or type new store name</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="url">Deal URL</Label>
              <Input
                id="url"
                name="url"
                value={formData.url || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/deal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo">Promo Code</Label>
              <Input
                id="promo"
                name="promo"
                value={formData.promo || ''}
                onChange={handleInputChange}
                placeholder="e.g., SAVE50"
              />
            </div>

            <div>
              <Label htmlFor="redeemType">Redeem Type *</Label>
              <Select value={formData.redeemType} onValueChange={(value: string) => handleSelectChange('redeemType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select redeem type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="InStore">In-Store</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isActive">Active Deal</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (deal ? 'Update Deal' : 'Create Deal')}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
}
