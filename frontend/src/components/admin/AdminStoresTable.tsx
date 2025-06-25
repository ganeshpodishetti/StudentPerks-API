import { Button } from '@/components/ui/button';
import { Store } from '@/services/storeService';
import { Edit, Trash2 } from 'lucide-react';

interface AdminStoresTableProps {
  stores: Store[];
  onEditStore: (store: Store) => void;
  onDeleteStore: (storeId: string) => void;
}

export default function AdminStoresTable({ stores, onEditStore, onDeleteStore }: AdminStoresTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Name</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Description</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Website</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <td className="p-2 sm:p-3 md:p-4">
                <div className="font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">{store.name}</div>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
                  {store.description || '-'}
                </div>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                {store.website ? (
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline text-xs sm:text-sm truncate max-w-[150px] block"
                  >
                    {store.website}
                  </a>
                ) : (
                  <span className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm">-</span>
                )}
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditStore(store)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteStore(store.id)}
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
