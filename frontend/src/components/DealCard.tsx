import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, ExternalLink, Tag } from 'lucide-react';
import React from 'react';
import { Deal } from '../types/Deal';
import DealDetail from './DealDetail';

interface DealCardProps {
  deal: Deal;
}

const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const imageUrl = deal.imageUrl || '/no-image.svg';
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Check if deal is expiring soon (within 7 days)
  const isExpiringSoon = () => {
    try {
      const endDate = new Date(deal.endDate);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    } catch (error) {
      return false;
    }
  };
  
  // Check if deal is new (added within the last 7 days)
  const isNew = () => {
    try {
      const startDate = new Date(deal.startDate);
      const now = new Date();
      const diffTime = now.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    } catch (error) {
      return false;
    }
  };
  
  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-md transition-all duration-300 dark:border-neutral-800">
      {/* Image */}
      <div className="relative aspect-[3/2] bg-gray-50 cursor-pointer overflow-hidden">
        <DealDetail 
          deal={deal} 
          trigger={
            <div className="w-full h-full">
              <img 
                src={imageUrl} 
                alt={deal.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                onError={(e) => {
                  e.currentTarget.src = '/no-image.svg';
                }}
              />
            </div>
          } 
        />
        <div className="absolute top-3 right-3">
          <Badge variant="default" className="bg-black hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
            {deal.discount}
          </Badge>
        </div>
        
        {/* Status badges - New or Expiring Soon */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew() && (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700">
              New
            </Badge>
          )}
          {isExpiringSoon() && (
            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600">
              Expiring Soon
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge 
            variant="secondary" 
            className="text-[10px] bg-neutral-100 hover:bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Tag className="h-3 w-3 mr-1" />
            {deal.categoryName}
          </Badge>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">{deal.storeName}</span>
        </div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-0 leading-snug">{deal.title}</h3>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4 line-clamp-3">{deal.description}</p>
        
        {/* Promo */}
        <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-sm mb-3 border border-neutral-100 dark:border-neutral-800">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">PROMO</span>
            <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">{deal.promo}</span>
          </div>
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Valid until {formatDate(deal.endDate)}
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium mb-4">
          <span>Limited offer</span>
          <span>{deal.redeemType}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full text-xs bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 group"
          asChild
        >
          <a
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            Get Deal
            <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DealCard;