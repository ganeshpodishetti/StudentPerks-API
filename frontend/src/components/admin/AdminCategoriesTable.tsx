import { Button } from '@/components/ui/button';
import { Category } from '@/services/categoryService';
import { Edit, Trash2 } from 'lucide-react';

interface AdminCategoriesTableProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export default function AdminCategoriesTable({ categories, onEditCategory, onDeleteCategory }: AdminCategoriesTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Image</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Name</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Description</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <td className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center">
                  {category.imageUrl ? (
                    <img 
                      src={category.imageUrl} 
                      alt={category.name || 'Category'} 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <img 
                        src="/no-image.svg" 
                        alt="No image available" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">{category.name}</div>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-[300px]">
                  {category.description || '-'}
                </div>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditCategory(category)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteCategory(category.id)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
