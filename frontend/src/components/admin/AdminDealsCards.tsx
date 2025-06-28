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
    <div className="md2:hidden space-y-3 sm:space-y-4 p-3 sm:p-4">
      {deals.map((deal) => (
        <Card key={deal.id} className="border border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col space-y-2 sm:space-y-3">
              {/* Header with title and actions */}
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-medium text-neutral-700 dark:text-neutral-300 truncate text-sm sm:text-base">
                    {deal.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {deal.description}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditDeal(deal)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteDeal(deal.id)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Deal details */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Store:</span>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {deal.storeName}
                  </div>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Category:</span>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {deal.categoryName}
                  </div>
                </div>
              </div>

              {/* Status and discount */}
              <div className="flex justify-between items-center">
                <span className="bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded text-xs sm:text-sm">
                  {deal.discount}
                </span>
                <span className={`px-2 py-1 rounded text-xs sm:text-sm ${
                  deal.isActive 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {deal.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
