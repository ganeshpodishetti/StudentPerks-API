import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { categoryService } from '@/services/categoryService';
import { CreateDealRequest } from '@/services/dealService';
import { storeService } from '@/services/storeService';
import { Deal } from '@/types/Deal';
import { useEffect, useState } from 'react';

// Helper function to format date for DateOnly backend (YYYY-MM-DD)
const formatDateForBackend = (date: string): string => {
  if (!date) return '';
  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  // Otherwise, convert from ISO string to YYYY-MM-DD
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return ''; // Invalid date
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  const [formData, setFormData] = useState<CreateDealRequest>({
    title: '',
    description: '',
    discount: '',
    imageUrl: '',
    promo: '',
    isActive: true,
    url: '',
    redeemType: 'code',
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
          redeemType: deal.redeemType || 'code',
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
          redeemType: 'code',
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
      // Format dates properly for backend DateOnly type
      const dealData = {
        ...formData,
        startDate: formatDateForBackend(formData.startDate || ''),
        endDate: formatDateForBackend(formData.endDate || ''),
      };
      
      console.log('Sending deal data with formatted dates:', {
        startDate: dealData.startDate,
        endDate: dealData.endDate,
        originalStartDate: formData.startDate,
        originalEndDate: formData.endDate
      });
      
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
              <Select value={formData.categoryName} onValueChange={(value: string) => handleSelectChange('categoryName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="storeName">Store *</Label>
              <Select value={formData.storeName} onValueChange={(value: string) => handleSelectChange('storeName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.name}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="url">Deal URL</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://store.com/deal"
              />
            </div>

            <div>
              <Label htmlFor="promo">Promo Code</Label>
              <Input
                id="promo"
                name="promo"
                value={formData.promo}
                onChange={handleInputChange}
                placeholder="SAVE50"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="redeemType">Redeem Type</Label>
            <Select value={formData.redeemType} onValueChange={(value: string) => handleSelectChange('redeemType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select redeem type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code">Promo Code</SelectItem>
                <SelectItem value="link">Direct Link</SelectItem>
                <SelectItem value="instore">In Store</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
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
              {isLoading ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
