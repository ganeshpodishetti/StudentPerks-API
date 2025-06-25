import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category, CreateCategoryRequest } from '@/services/categoryService';
import { useEffect, useState } from 'react';

interface FormData {
  name: string;
  description: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: CreateCategoryRequest) => Promise<void>;
  category?: Category | null;
}

export default function CategoryFormModal({ isOpen, onClose, onSave, category }: CategoryFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name,
          description: category.description || '',
        });
      } else {
        // Reset form for new category
        setFormData({
          name: '',
          description: '',
        });
      }
    }
  }, [isOpen, category]);

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
      // Create category data object, filtering out empty strings for optional fields
      const categoryData: CreateCategoryRequest = {
        name: formData.name,
        ...(formData.description && { description: formData.description }),
      };

      await onSave(categoryData);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogDescription>
            {category ? 'Update the category information below.' : 'Add a new category to the platform.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
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
              placeholder="Enter category description"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
