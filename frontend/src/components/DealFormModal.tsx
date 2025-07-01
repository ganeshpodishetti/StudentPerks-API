import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { categoryService } from '@/services/categoryService';
import { storeService } from '@/services/storeService';
import { universityService, type University } from '@/services/universityService';
import { CreateDealRequest, Deal, RedeemType } from '@/types/Deal';
import { useEffect, useState } from 'react';

// Form data interface that allows optional fields to be empty strings
interface FormData {
  title: string;
  description: string;
  discount: string;
  image?: File | null;
  promo?: string;
  isActive: boolean;
  url: string;
  redeemType: RedeemType;
  howToRedeem?: string;
  startDate?: string;
  endDate?: string;
  categoryName: string;
  storeName: string;
  universityName?: string;
  isUniversitySpecific?: boolean;
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
    image: null,
    promo: '',
    isActive: true,
    url: '',
    redeemType: 'Online',
    howToRedeem: '',
    startDate: '',
    endDate: '',
    categoryName: '',
    storeName: '',
    universityName: '',
    isUniversitySpecific: false,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadStores();
      loadUniversities();
      
      if (deal) {
        setFormData({
          title: deal.title,
          description: deal.description,
          discount: deal.discount || '',
          image: null, // Can't restore file from deal data
          promo: deal.promo || '',
          isActive: deal.isActive,
          url: deal.url || '',
          redeemType: deal.redeemType || 'Online',
          howToRedeem: (deal as any).howToRedeem || '',
          startDate: formatDateForInput(deal.startDate || '') || '',
          endDate: formatDateForInput(deal.endDate || '') || '',
          categoryName: deal.categoryName,
          storeName: deal.storeName,
          universityName: (deal as any).universityName || '',
          isUniversitySpecific: (deal as any).isUniversitySpecific || false,
        });
      } else {
        // Reset form for new deal
        setFormData({
          title: '',
          description: '',
          discount: '',
          image: null,
          promo: '',
          isActive: true,
          url: '',
          redeemType: 'Online',
          howToRedeem: '',
          startDate: '',
          endDate: '',
          categoryName: '',
          storeName: '',
          universityName: '',
          isUniversitySpecific: false,
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

  const loadUniversities = async () => {
    try {
      const universitiesData = await universityService.getUniversities();
      setUniversities(universitiesData);
    } catch (error) {
      console.error('Error loading universities:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      image: file
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
      console.log('Form submitted with data:', formData);
      
      // Create clean deal data
      const dealData: CreateDealRequest = {
        title: formData.title,
        description: formData.description,
        discount: formData.discount,
        isActive: formData.isActive,
        url: formData.url,
        redeemType: formData.redeemType,
        isUniversitySpecific: formData.isUniversitySpecific || false,
        categoryName: formData.categoryName,
        storeName: formData.storeName,
      };

      // Add optional fields only if they have values
      if (formData.image) {
        dealData.image = formData.image;
        console.log('Adding image file:', formData.image.name, formData.image.type, formData.image.size);
      }

      if (formData.promo?.trim()) {
        dealData.promo = formData.promo.trim();
      }

      if (formData.howToRedeem?.trim()) {
        dealData.howToRedeem = formData.howToRedeem.trim();
      }

      if (formData.universityName?.trim()) {
        dealData.universityName = formData.universityName.trim();
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
      console.log('University specific flag:', dealData.isUniversitySpecific);
      console.log('University name:', dealData.universityName);
      
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
            {deal 
              ? 'Update the deal information below. Select from existing categories and stores.' 
              : 'Fill in the details to create a new deal. You can select existing categories/stores or type new names to create them.'
            }
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

          <div>
            <Label htmlFor="howToRedeem">How to Redeem (Optional)</Label>
            <Textarea
              id="howToRedeem"
              name="howToRedeem"
              value={formData.howToRedeem || ''}
              onChange={handleInputChange}
              placeholder="Instructions on how to redeem this deal..."
              rows={2}
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide step-by-step instructions for redeeming this deal
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryName">Category *</Label>
              <Combobox
                options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
                value={formData.categoryName}
                onValueChange={(value) => handleSelectChange('categoryName', value)}
                placeholder={deal ? "Select category" : "Select or create category"}
                searchPlaceholder="Search categories..."
                emptyText={deal ? "No categories found." : "No categories found. Type to create new."}
                customText="Create category"
                allowCustom={!deal}
              />
              <p className="text-xs text-gray-500 mt-1">
                {deal ? "Select from existing categories" : "Select existing or type new category name"}
              </p>
            </div>

            <div>
              <Label htmlFor="storeName">Store *</Label>
              <Combobox
                options={stores.map(store => ({ value: store.name, label: store.name }))}
                value={formData.storeName}
                onValueChange={(value) => handleSelectChange('storeName', value)}
                placeholder={deal ? "Select store" : "Select or create store"}
                searchPlaceholder="Search stores..."
                emptyText={deal ? "No stores found." : "No stores found. Type to create new."}
                customText="Create store"
                allowCustom={!deal}
              />
              <p className="text-xs text-gray-500 mt-1">
                {deal ? "Select from existing stores" : "Select existing or type new store name"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="image">Image (PNG/SVG)</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept=".png,.svg,image/png,image/svg+xml"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-50 file:text-neutral-700 hover:file:bg-neutral-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a PNG or SVG image (max 5MB)
              </p>
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

          <div>
            <Label htmlFor="universityName">University (Optional)</Label>
            <Combobox
              options={universities.map(uni => ({ value: uni.name, label: uni.name }))}
              value={formData.universityName || ''}
              onValueChange={(value) => handleSelectChange('universityName', value)}
              placeholder={deal ? "Select university" : "Select or create university"}
              searchPlaceholder="Search universities..."
              emptyText={deal ? "No universities found." : "No universities found. Type to create new."}
              customText="Create university"
              allowCustom={!deal}
            />
            <p className="text-xs text-gray-500 mt-1">
              {deal ? "Select from existing universities" : "Select existing or type new university name"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isUniversitySpecific"
                checked={formData.isUniversitySpecific || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isUniversitySpecific: checked }))}
              />
              <Label htmlFor="isUniversitySpecific">University Exclusive Deal</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active Deal</Label>
            </div>
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
