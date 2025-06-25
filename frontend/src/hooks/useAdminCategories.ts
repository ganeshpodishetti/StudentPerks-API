import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Category, categoryService } from '@/services/categoryService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData);
    } catch (error: any) {
      console.error('Error loading categories:', error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to access admin features",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      setCategories(categories.filter(category => category.id !== categoryId));
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting category:', error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to delete categories",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleSaveCategory = async (categoryData: any) => {
    try {
      console.log('Attempting to save category:', categoryData);
      
      if (editingCategory) {
        const updatedCategory = await categoryService.updateCategory(editingCategory.id, categoryData);
        setCategories(categories.map(category => category.id === editingCategory.id ? updatedCategory : category));
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        const newCategory = await categoryService.createCategory(categoryData);
        setCategories([newCategory, ...categories]);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      console.error('Error saving category:', error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      
      if (error.response?.status === 403) {
        toast({
          title: "Permission Denied", 
          description: "You don't have permission to perform this action.",
          variant: "destructive",
        });
        return;
      }
      
      const action = editingCategory ? 'update' : 'create';
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.title 
        || error.message 
        || `Failed to ${action} category`;
        
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    isLoading,
    isModalOpen,
    editingCategory,
    user,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory,
    closeModal,
  };
};
