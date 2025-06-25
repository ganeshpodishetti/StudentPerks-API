import { Button } from '@/components/ui/button';
import { ComponentVariant } from '@/types/common/BaseTypes';

interface AdminActionsProps {
  actions: Array<{
    label: string;
    onClick: () => void;
    variant?: ComponentVariant;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
}

export const AdminActions: React.FC<AdminActionsProps> = ({ actions }) => {
  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant === 'primary' ? 'default' : action.variant || 'outline'}
          size="sm"
          onClick={action.onClick}
          disabled={action.disabled}
          className="flex items-center gap-2"
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
};
