import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Store } from '@/services/storeService';
import { Edit, Trash2 } from 'lucide-react';

interface AdminStoresCardsProps {
  stores: Store[];
  onEditStore: (store: Store) => void;
  onDeleteStore: (storeId: string) => void;
}

export default function AdminStoresCards({ stores, onEditStore, onDeleteStore }: AdminStoresCardsProps) {
  return (
    <div className="md:hidden space-y-3">
      {stores.map((store) => (
        <Card key={store.id} className="p-3">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">{store.name}</h3>
                {store.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {store.description}
                  </p>
                )}
                {store.website && (
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline text-xs mt-1 block"
                  >
                    {store.website}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditStore(store)}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteStore(store.id)}
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
