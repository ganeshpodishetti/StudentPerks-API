import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, Copy, ExternalLink, Image, Info, MapPin, School, Tag } from 'lucide-react';
import React, { useState } from 'react';
import { Deal } from '../types/Deal';

interface DealDetailProps {
  deal: Deal;
  trigger: React.ReactNode;
}

const DealDetail: React.FC<DealDetailProps> = ({ deal, trigger }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = deal.imageUrl;
  const { toast } = useToast();
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!deal.endDate) return 0;
    try {
      const endDate = new Date(deal.endDate);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 ? diffDays : 0;
    } catch (error) {
      return 0;
    }
  };

  const daysRemaining = getDaysRemaining();
  
  // Helper function to format redeem type for display
  const formatRedeemType = (redeemType: string): string => {
    switch (redeemType) {
      case 'Online':
        return 'Online only';
      case 'InStore':
        return 'In-store only';
      case 'Both':
        return 'Online & In-store';
      case 'Unknown':
        return 'Contact store';
      default:
        return redeemType;
    }
  };

  // Handle copy promo code
  const handleCopyPromo = () => {
    if (deal.promo) {
      navigator.clipboard.writeText(deal.promo);
      toast({
        title: "Promo code copied!",
        description: `"${deal.promo}" has been copied to your clipboard.`,
        duration: 3000,
      });
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="text-xs bg-neutral-100 hover:bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              >
                <Tag className="h-3 w-3 mr-1" />
                {deal.categoryName}
              </Badge>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{deal.storeName}</span>
            </div>
            <Badge variant="default" className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black text-xs">
              {deal.discount}
            </Badge>
          </div>
          <DialogTitle className="text-lg font-semibold leading-tight text-neutral-700 dark:text-neutral-300">{deal.title}</DialogTitle>
          <DialogDescription className="flex items-center text-amber-600 dark:text-amber-400 text-sm">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Offer expired'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-900">
              {!imageError && imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={deal.title} 
                  className="w-full h-full object-contain" 
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(deal.startDate)} - {formatDate(deal.endDate)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{formatRedeemType(deal.redeemType)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">{deal.description}</p>
          
          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">PROMO CODE</span>
                <div className="font-mono font-semibold text-lg text-neutral-900 dark:text-neutral-100 mt-1">{deal.promo || 'No code required'}</div>
              </div>
              {deal.promo && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopyPromo}
                  className="text-xs flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
              )}
            </div>
            <div className="text-xs text-neutral-400 dark:text-neutral-500">
              Valid until {formatDate(deal.endDate)}
            </div>
          </div>
          
          {/* How to Redeem Instructions */}
          {'howToRedeem' in deal && (deal as any).howToRedeem && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">How to Redeem</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{(deal as any).howToRedeem}</p>
                </div>
              </div>
            </div>
          )}

          {/* University Specific Info */}
          {'isUniversitySpecific' in deal && (deal as any).isUniversitySpecific && (
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-2">
                <School className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">University Exclusive</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    This deal is exclusive to {'universityName' in deal && (deal as any).universityName ? (deal as any).universityName : 'specific universities'}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-4">
          <Button 
            className="w-full bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 group"
            asChild
          >
            <a
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              Get This Deal
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DealDetail;
