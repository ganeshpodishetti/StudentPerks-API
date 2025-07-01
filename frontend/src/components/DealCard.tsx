import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, ExternalLink, MapPin, School } from 'lucide-react';
import React, { memo, useState } from 'react';
import { Deal } from '../types/Deal';
import DealDetail from './DealDetail';

interface DealCardProps {
  deal: Deal;
  showUniversityInfo?: boolean;
  compact?: boolean;
}

const DealCard: React.FC<DealCardProps> = memo(({ deal, showUniversityInfo = false, compact = false }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = deal.imageUrl;
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Calculate days remaining if end date exists
  const getDaysRemaining = () => {
    if (!deal.endDate) return null;
    try {
      const endDate = new Date(deal.endDate);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 ? diffDays : 0;
    } catch (error) {
      return null;
    }
  };

  const daysRemaining = getDaysRemaining();
  const isExpiring = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining !== null && daysRemaining <= 0;

  return (
    <Card className={`overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-2xl ${compact ? 'p-4' : 'p-6'} ${isExpired ? 'opacity-75' : ''} h-full`}>
      {/* Status indicators */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isExpired && (
            <Badge variant="destructive" className="text-xs px-2 py-1">
              <Clock className="h-3 w-3 mr-1" />
              Expired
            </Badge>
          )}
          {isExpiring && !isExpired && (
            <Badge variant="outline" className="text-xs px-2 py-1 border-amber-300 text-amber-600 dark:text-amber-400">
              <Clock className="h-3 w-3 mr-1" />
              {daysRemaining} days left
            </Badge>
          )}
          {deal.discount && (
            <Badge 
              variant="default" 
              className="text-xs px-2 py-1 bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black"
            >
              {deal.discount}
            </Badge>
          )}
        </div>
        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Header with Icon */}
      <div className="flex items-start gap-4 mb-4">
        <DealDetail 
          deal={deal} 
          trigger={
            <div className="cursor-pointer">
              <div className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 rounded-lg bg-neutral-50 dark:bg-neutral-900`}>
                {!imageError && imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={deal.title} 
                    className="w-full h-full object-contain" 
                    onError={handleImageError}
                  />
                ) : (
                  <img 
                    src="/no-image.svg" 
                    alt="No image available" 
                    className="w-full h-full object-contain opacity-60"
                  />
                )}
              </div>
            </div>
          } 
        />
        
        {/* Deal Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-neutral-700 dark:text-neutral-300 mb-2 leading-tight`}>
            {deal.title}
          </h3>
          {deal.promo && (
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs font-mono px-2 py-1">
                {deal.promo}
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow">
        <p className={`text-sm text-neutral-500 dark:text-neutral-400 ${compact ? 'line-clamp-2' : 'line-clamp-3'} leading-relaxed mb-4`}>
          {deal.description}
        </p>
      </div>

      {/* Deal Details */}
      {!compact && (
        <div className="space-y-2 mb-4">
          {(deal.startDate || deal.endDate) && (
            <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {deal.startDate && new Date(deal.startDate).toLocaleDateString()}
                {deal.startDate && deal.endDate && ' - '}
                {deal.endDate && new Date(deal.endDate).toLocaleDateString()}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{deal.redeemType === 'Online' ? 'Online only' : deal.redeemType === 'InStore' ? 'In-store only' : deal.redeemType === 'Both' ? 'Online & In-store' : 'Contact store'}</span>
          </div>

          {showUniversityInfo && 'universityName' in deal && (deal as any).universityName && (
            <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
              <School className="h-3 w-3 mr-1" />
              <span>{(deal as any).universityName}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Footer with Tags */}
      <div className="flex items-center gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
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