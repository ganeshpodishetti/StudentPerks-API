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
import { Calendar, Clock, ExternalLink, MapPin, Tag } from 'lucide-react';
import React from 'react';
import { Deal } from '../types/Deal';

interface DealDetailProps {
  deal: Deal;
  trigger: React.ReactNode;
}

const DealDetail: React.FC<DealDetailProps> = ({ deal, trigger }) => {
  const imageUrl = deal.imageUrl || '/no-image.svg';
  const { toast } = useToast();
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
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
  
  // Handle copy promo code
  const handleCopyPromo = () => {
    navigator.clipboard.writeText(deal.promo);
    toast({
      title: "Promo code copied!",
      description: `"${deal.promo}" has been copied to your clipboard.`,
      duration: 3000,
    });
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge 
              variant="secondary" 
              className="text-xs bg-neutral-100 hover:bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Tag className="h-3 w-3 mr-1" />
              {deal.categoryName}
            </Badge>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{deal.storeName}</span>
          </div>
          <DialogTitle className="text-xl font-bold">{deal.title}</DialogTitle>
          <DialogDescription className="flex items-center text-amber-500 dark:text-amber-400">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Offer expired'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="relative aspect-video bg-gray-50 dark:bg-neutral-900 rounded-md overflow-hidden">
            <img 
              src={imageUrl} 
              alt={deal.title} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.currentTarget.src = '/no-image.svg';
              }}
            />
            <div className="absolute top-3 right-3">
              <Badge variant="default" className="bg-black hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
                {deal.discount}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center text-neutral-500 dark:text-neutral-400">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>Valid from {formatDate(deal.startDate)} to {formatDate(deal.endDate)}</span>
            </div>
            <div className="flex items-center text-neutral-500 dark:text-neutral-400">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>Redeem: {deal.redeemType}</span>
            </div>
          </div>
          
          <p className="text-neutral-600 dark:text-neutral-300 whitespace-pre-line">{deal.description}</p>
          
          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-sm border border-neutral-100 dark:border-neutral-800">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium block mb-1">PROMO CODE</span>
                <span className="font-mono font-bold text-lg text-neutral-900 dark:text-neutral-100">{deal.promo}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopyPromo}
                className="w-full sm:w-auto"
              >
                Copy Code
              </Button>
            </div>
            <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Valid until {formatDate(deal.endDate)}
            </div>
          </div>
          
          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-sm border border-neutral-100 dark:border-neutral-800">
            <h4 className="text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">How to Use</h4>
            <ol className="text-sm text-neutral-600 dark:text-neutral-300 list-decimal pl-4 space-y-1">
              <li>Click the "Get This Deal" button below</li>
              <li>Copy the promo code above</li>
              <li>Apply the code at checkout on the merchant's website</li>
              <li>Enjoy your student discount!</li>
            </ol>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            className="w-full sm:w-auto bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 group"
            asChild
          >
            <a
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
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
