import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Category } from '@/services/categoryService';
import AdminCategoriesCards from './AdminCategoriesCards';
import AdminCategoriesTable from './AdminCategoriesTable';

interface AdminCategoriesListProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export default function AdminCategoriesList({ categories, onEditCategory, onDeleteCategory }: AdminCategoriesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Categories</CardTitle>
        <CardDescription>
          Manage your categories, edit details, or remove outdated categories.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-3 md:p-6">
        {/* Desktop Table View */}
        <AdminCategoriesTable 
          categories={categories}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
        />

        {/* Mobile Card View */}
        <AdminCategoriesCards 
          categories={categories}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
        />

        {categories.length === 0 && (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No categories found. Create your first category to get started!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
