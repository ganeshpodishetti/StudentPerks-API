import { AdminLayoutProps } from '@/types/common/ComponentProps';

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  actions,
  navigation,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
        {/* Header */}
        {(title || actions) && (
          <div className="mb-6 flex items-center justify-between">
            {title && (
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {title}
              </h1>
            )}
            {actions && (
              <div className="flex items-center gap-4">
                {actions}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        {navigation && (
          <div className="mb-6">
            {navigation}
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
