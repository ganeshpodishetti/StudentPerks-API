import { GraduationCap, LayoutDashboard, MessagesSquare, ShoppingBag, Store, Tag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminNavigation() {
  const location = useLocation();

  const navItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/admin/deals',
      label: 'Deals',
      icon: ShoppingBag,
    },
    {
      path: '/admin/submitted-deals',
      label: 'Submitted Deals',
      icon: MessagesSquare,
    },
    {
      path: '/admin/stores',
      label: 'Stores', 
      icon: Store,
    },
    {
      path: '/admin/categories',
      label: 'Categories',
      icon: Tag,
    },
    {
      path: '/admin/universities',
      label: 'Universities',
      icon: GraduationCap,
    },
  ];

  return (
    <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 mb-6">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
