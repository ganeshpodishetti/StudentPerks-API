import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/services/categoryService';
import { Edit, Trash2 } from 'lucide-react';

interface AdminCategoriesCardsProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export default function AdminCategoriesCards({ categories, onEditCategory, onDeleteCategory }: AdminCategoriesCardsProps) {
  return (
    <div className="md:hidden space-y-3">
      {categories.map((category) => (
        <Card key={category.id} className="p-3">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0">
                  {category.imageUrl ? (
                    <img 
                      src={category.imageUrl} 
                      alt={category.name || 'Category'} 
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <img 
                        src="/no-image.svg" 
                        alt="No image available" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">{category.name}</h3>
                  {category.description && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditCategory(category)}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteCategory(category.id)}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
