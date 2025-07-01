import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Deal } from '@/types/Deal';
import { Edit, Trash2 } from 'lucide-react';

interface AdminDealsCardsProps {
  deals: Deal[];
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (dealId: string) => void;
}

export default function AdminDealsCards({ deals, onEditDeal, onDeleteDeal }: AdminDealsCardsProps) {
  return (
    <div className="md2:hidden space-y-3">
      {deals.map((deal) => (
        <Card key={deal.id} className="p-3">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0">
                  {deal.imageUrl ? (
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.title} 
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
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">{deal.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {deal.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded text-xs">
                      {deal.discount}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      deal.isActive 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {deal.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {deal.storeName} • {deal.categoryName}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditDeal(deal)}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteDeal(deal.id)}
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
