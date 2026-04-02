import React from 'react';
import { cn } from '@/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | false;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClass = animation ? 'animate-pulse' : '';

  return (
    <div
      className={cn(
        'bg-slate-200',
        variantStyles[variant],
        animationClass,
        className
      )}
      style={{
        width,
        height,
        minWidth: width,
        minHeight: height,
      }}
    />
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 1, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" height="1rem" className={cn(i === lines - 1 && 'w-3/4')} />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-xl p-6 shadow-level-1 border border-slate-200', className)}>
    <div className="flex items-start justify-between mb-4">
      <Skeleton variant="rounded" width="120px" height="24px" />
      <Skeleton variant="circular" width="32px" height="32px" />
    </div>
    <SkeletonText lines={2} />
    <div className="mt-4 flex items-center gap-2">
      <Skeleton variant="rounded" width="60px" height="20px" />
      <Skeleton variant="rounded" width="60px" height="20px" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={cn('bg-white rounded-xl shadow-level-1 border border-slate-200 overflow-hidden', className)}>
    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
      <Skeleton variant="text" height="16px" width="150px" />
    </div>
    <div className="divide-y divide-slate-200">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} variant="text" height="16px" width="100px" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
