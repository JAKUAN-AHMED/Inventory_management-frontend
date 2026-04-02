import React, { useState } from 'react';
import { cn } from '@/utils';
import { Menu, Bell, Search, Moon, Sun } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useNotificationStore } from '@/stores/notificationStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import NotificationDropdown from '@/components/ui/NotificationDropdown';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showSearch = false,
  className,
}) => {
  const { toggleSidebar, darkMode, toggleDarkMode } = useUIStore();
  const { unreadCount } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200',
        'dark:bg-slate-800/95 dark:border-slate-700',
        'px-4 sm:px-6 lg:px-8',
        'transition-all duration-300',
        className
      )}
    >
      <div className="h-full flex items-center justify-between gap-4">
        {/* Left section */}
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="flex-shrink-0 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {title && (
            <div className="hidden sm:block min-w-0">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 truncate">{title}</h1>
              {subtitle && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          )}

          {showSearch && (
            <div className="flex-1 max-w-md">
              <Input
                type="search"
                placeholder="Search..."
                leftIcon={<Search className="w-4 h-4" />}
                className="bg-slate-100 dark:bg-slate-700 border-transparent focus:bg-white dark:focus:bg-slate-600 text-slate-900 dark:text-slate-100"
              />
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="relative text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleNotifications}
              aria-label="Notifications"
              className="relative text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-danger-500 text-white text-xs font-medium rounded-full ring-2 ring-white dark:ring-slate-800">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3 pl-4 ml-2 border-l border-slate-200 dark:border-slate-700">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
