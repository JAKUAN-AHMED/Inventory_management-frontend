import React from 'react';
import { cn } from '@/utils';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  showSearch = false,
  className,
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - fixed on desktop, overlay on mobile */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="lg:ml-64 transition-all duration-300">
        <Header
          title={title}
          subtitle={subtitle}
          showSearch={showSearch}
        />
        <main className={cn('p-4 sm:p-6 lg:p-8', className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
