import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CreateUniversityRequest, University, UpdateUniversityRequest } from '@/types/University';
import { useEffect, useState } from 'react';

interface FormData {
  name: string;
  code: string;
  country: string;
  state: string;
  city: string;
  isActive: boolean;
  image?: File | null;
}

interface UniversityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (universityData: CreateUniversityRequest | UpdateUniversityRequest) => Promise<void>;
  university?: University | null;
}

export default function UniversityFormModal({ isOpen, onClose, onSave, university }: UniversityFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    code: '',
    country: '',
    state: '',
    city: '',
    isActive: true,
    image: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (university) {
        setFormData({
          name: university.name || '',
          code: university.code || '',
          country: university.country || '',
          state: university.state || '',
          city: university.city || '',
          isActive: university.isActive ?? true,
          image: null,
        });
      } else {
        // Reset form for new university
        setFormData({
          name: '',
          code: '',
          country: '',
          state: '',
          city: '',
          isActive: true,
          image: null,
        });
      }
    }
  }, [isOpen, university]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (university) {
        // Update existing university
        const universityData: UpdateUniversityRequest = {
          name: formData.name,
          code: formData.code,
          isActive: formData.isActive,
          ...(formData.country && { country: formData.country }),
          ...(formData.state && { state: formData.state }),
          ...(formData.city && { city: formData.city }),
          ...(formData.image && { image: formData.image }),
        };
        await onSave(universityData);
      } else {
        // Create new university
        const universityData: CreateUniversityRequest = {
          name: formData.name,
          code: formData.code,
          ...(formData.country && { country: formData.country }),
          ...(formData.state && { state: formData.state }),
          ...(formData.city && { city: formData.city }),
          ...(formData.image && { image: formData.image }),
        };
        await onSave(universityData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving university:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{university ? 'Edit University' : 'Create New University'}</DialogTitle>
          <DialogDescription>
            {university ? 'Update the university information below.' : 'Add a new university to the platform.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">University Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter university name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">University Code *</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Enter university code"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
            </div>
          </div>

          {university && (
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active University</Label>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image">University Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.image && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Selected: {formData.image.name}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : university ? 'Update University' : 'Create University'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
