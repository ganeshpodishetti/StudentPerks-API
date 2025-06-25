import { Button } from '@/components/ui/button';
import { BaseEntity } from '@/types/common/BaseTypes';
import { AdminTableProps } from '@/types/common/ComponentProps';

export function AdminTable<T extends BaseEntity>({
  items,
  columns,
  actions = [],
  loading = false,
  error,
  onEdit,
  onDelete,
  selectable = false,
  onSelectionChange,
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
        <p>No items found.</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            {selectable && (
              <th className="text-left p-3 font-medium text-neutral-500 dark:text-neutral-400">
                <input
                  type="checkbox"
                  className="rounded border-neutral-300 dark:border-neutral-600"
                  onChange={(e) => {
                    if (onSelectionChange) {
                      onSelectionChange(e.target.checked ? items.map(item => item.id) : []);
                    }
                  }}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                className="text-left p-3 font-medium text-neutral-500 dark:text-neutral-400"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
            {(actions.length > 0 || onEdit || onDelete) && (
              <th className="text-right p-3 font-medium text-neutral-500 dark:text-neutral-400">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
            >
              {selectable && (
                <td className="p-3">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 dark:border-neutral-600"
                    onChange={(_e) => {
                      if (onSelectionChange) {
                        // Handle individual selection
                        // This would need more complex logic for proper implementation
                      }
                    }}
                  />
                </td>
              )}
              {columns.map((column, index) => (
                <td key={index} className="p-3 text-neutral-900 dark:text-neutral-100">
                  {column.render ? (
                    column.render(item)
                  ) : (
                    <span>
                      {String(item[column.key as keyof T] || '')}
                    </span>
                  )}
                </td>
              ))}
              {(actions.length > 0 || onEdit || onDelete) && (
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Custom actions */}
                    {actions.map((action, index) => {
                      if (action.show && !action.show(item)) return null;
                      return (
                        <Button
                          key={index}
                          variant={action.variant === 'primary' ? 'default' : action.variant || 'outline'}
                          size="sm"
                          onClick={() => action.onClick(item)}
                          className="h-8 w-8 p-0"
                        >
                          {action.icon}
                        </Button>
                      );
                    })}
                    
                    {/* Default edit/delete actions */}
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 p-0"
                      >
                        ✏️
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
