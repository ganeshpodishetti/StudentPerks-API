import { Card, CardContent } from '@/components/ui/card';
import { BaseEntity } from '@/types/common/BaseTypes';
import { AdminCardProps } from '@/types/common/ComponentProps';

export function AdminCards<T extends BaseEntity>({
  items,
  renderCard,
  loading = false,
  error,
  emptyMessage = "No items found.",
  gridCols = 1,
}: AdminCardProps<T>) {
  if (loading) {
    return (
      <div className="md:hidden space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-3">
            <CardContent className="p-0 space-y-2">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:hidden text-center py-8 text-red-500 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="md:hidden text-center py-8 text-neutral-500 dark:text-neutral-400">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const gridClass = gridCols === 1 
    ? "md:hidden space-y-3" 
    : `grid grid-cols-1 sm:grid-cols-${Math.min(gridCols, 2)} md:grid-cols-${Math.min(gridCols, 3)} gap-3`;

  return (
    <div className={gridClass}>
      {items.map((item) => renderCard(item))}
    </div>
  );
}
