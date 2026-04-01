import React from 'react';
import { cn } from '@/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  hover = false,
  onClick,
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4 sm:p-6',
    md: 'p-6 sm:p-8',
    lg: 'p-6 sm:p-8 lg:p-10',
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl shadow-level-1 border border-slate-200 dark:border-slate-700 overflow-hidden',
        paddingStyles[padding],
        hover && 'hover:shadow-level-2 transition-shadow duration-200 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('mb-4 sm:mb-6', className)}>{children}</div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}> = ({ children, className, as = 'h3' }) => {
  const Component = as;
  return (
    <Component
      className={cn(
        'text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100',
        as === 'h1' && 'text-2xl sm:text-3xl',
        as === 'h2' && 'text-xl sm:text-2xl',
        as === 'h4' && 'text-base sm:text-lg',
        as === 'h5' && 'text-sm sm:text-base',
        as === 'h6' && 'text-xs sm:text-sm',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <p className={cn('text-sm text-slate-600 dark:text-slate-400 mt-2', className)}>{children}</p>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('', className)}>{children}</div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700', className)}>
    {children}
  </div>
);

export default Card;
