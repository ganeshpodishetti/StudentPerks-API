import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Image } from 'lucide-react';
import React, { memo, useState } from 'react';
import { Deal } from '../types/Deal';
import DealDetail from './DealDetail';

interface DealCardProps {
  deal: Deal;
}

const DealCard: React.FC<DealCardProps> = memo(({ deal }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = deal.imageUrl;
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-lg transition-all duration-300 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-2xl p-6">
      {/* Header with Icon and External Link */}
      <div className="flex items-start justify-between mb-4">
        <DealDetail 
          deal={deal} 
          trigger={
            <div className="cursor-pointer">
              <div className="w-16 h-16 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                {!imageError && imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={deal.title} 
                    className="w-full h-full object-contain" 
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                  </div>
                )}
              </div>
            </div>
          } 
        />
        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>
      
      {/* Content */}
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 leading-tight">{deal.title}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-4">{deal.description}</p>
      </div>
      
      {/* Footer with Tags */}
      <div className="flex items-center gap-2 pt-4">
        <Badge 
          variant="secondary" 
          className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 px-3 py-1 rounded-full"
        >
          {deal.categoryName}
        </Badge>
        <Badge 
          variant="secondary" 
          className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 px-3 py-1 rounded-full"
        >
          {deal.storeName}
        </Badge>
      </div>
    </Card>
  );
});

export default DealCard;