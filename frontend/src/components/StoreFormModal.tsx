import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreateStoreRequest, Store } from '@/services/storeService';
import { useEffect, useState } from 'react';

interface FormData {
  name: string;
  description: string;
  website: string;
}

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (storeData: CreateStoreRequest) => Promise<void>;
  store?: Store | null;
}

export default function StoreFormModal({ isOpen, onClose, onSave, store }: StoreFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    website: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (store) {
        setFormData({
          name: store.name,
          description: store.description || '',
          website: store.website || '',
        });
      } else {
        // Reset form for new store
        setFormData({
          name: '',
          description: '',
          website: '',
        });
      }
    }
  }, [isOpen, store]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create store data object, filtering out empty strings for optional fields
      const storeData: CreateStoreRequest = {
        name: formData.name,
        ...(formData.description && { description: formData.description }),
        ...(formData.website && { website: formData.website }),
      };

      await onSave(storeData);
      onClose();
    } catch (error) {
      console.error('Error saving store:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{store ? 'Edit Store' : 'Create New Store'}</DialogTitle>
          <DialogDescription>
            {store ? 'Update the store information below.' : 'Add a new store to the platform.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter store name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter store description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : store ? 'Update Store' : 'Create Store'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
