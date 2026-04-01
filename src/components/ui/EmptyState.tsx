import React from 'react';
import { cn } from '@/utils';
import Button from './Button';
import { Package, Inbox, FileX, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  variant?: 'default' | 'search' | 'error' | 'orders' | 'products';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  variant = 'default',
  title,
  description,
  action,
  className,
}) => {
  const variantIcons = {
    default: <Package className="w-12 h-12 text-slate-300" />,
    search: <Inbox className="w-12 h-12 text-slate-300" />,
    error: <AlertCircle className="w-12 h-12 text-danger-300" />,
    orders: <FileX className="w-12 h-12 text-slate-300" />,
    products: <Package className="w-12 h-12 text-slate-300" />,
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-12',
        'bg-white rounded-xl border border-dashed border-slate-300',
        className
      )}
    >
      <div className="mb-4">{icon || variantIcons[variant]}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-600 mb-4 max-w-md">{description}</p>
      )}
      {action && (
        <Button variant={action.variant || 'primary'} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
