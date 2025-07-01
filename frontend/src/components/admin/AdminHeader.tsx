import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';

interface AdminHeaderProps {
  user: {
    firstName?: string;
  } | null;
  onCreateDeal?: () => void;
  onLogout: () => void;
  onTestConnectivity: () => void;
  title?: string;
  createButtonText?: string;
}

export default function AdminHeader({ 
  user, 
  onCreateDeal, 
  onLogout, 
  onTestConnectivity,
  title = "Admin Dashboard",
  createButtonText = "Create Deal"
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-8">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-1 md:mt-2">
          Welcome back, {user?.firstName}! Manage your {title.toLowerCase().includes('dashboard') ? 'content' : title.toLowerCase()} here.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-2 md:gap-4">
          <ThemeToggle />
          <Button 
            onClick={onTestConnectivity} 
            variant="outline"
            size="sm"
          >
            Test API
          </Button>
          {onCreateDeal && (
            <Button 
              onClick={onCreateDeal}
              className="flex items-center gap-2 flex-1 sm:flex-none"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">{createButtonText}</span>
              <span className="xs:hidden">Create</span>
            </Button>
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={onLogout} 
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
          size="sm"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden xs:inline">Logout</span>
          <span className="xs:hidden">Exit</span>
        </Button>
      </div>
    </div>
  );
}
