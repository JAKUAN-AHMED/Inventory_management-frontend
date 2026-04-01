import React from 'react';
import { cn } from '@/utils';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => (
  <div className="overflow-x-auto">
    <table className={cn('w-full', className)}>{children}</table>
  </div>
);

export const TableHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <thead className={cn('bg-slate-50 border-b border-slate-200', className)}>
    {children}
  </thead>
);

export const TableBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <tbody className={cn('divide-y divide-slate-200', className)}>{children}</tbody>
);

export const TableRow: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}> = ({ children, className, hover = false, onClick }) => (
  <tr
    className={cn(
      'transition-colors duration-150',
      hover && 'hover:bg-slate-50 cursor-pointer',
      className
    )}
    onClick={onClick}
  >
    {children}
  </tr>
);

export const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}> = ({ children, className, align = 'left' }) => (
  <td
    className={cn(
      'px-6 py-4 text-sm',
      align === 'left' && 'text-left',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}
  >
    {children}
  </td>
);

export const TableHead: React.FC<{
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}> = ({ children, className, align = 'left' }) => (
  <th
    scope="col"
    className={cn(
      'px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider',
      align === 'left' && 'text-left',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}
  >
    {children}
  </th>
);

export const TableFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <tfoot className={cn('bg-slate-50 border-t border-slate-200', className)}>
    {children}
  </tfoot>
);

export default Table;
