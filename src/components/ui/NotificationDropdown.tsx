import React from 'react';
import { Bell, Check, Trash2, AlertCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useNotificationStore, type Notification } from '@/stores/notificationStore';
import { formatRelativeTime } from '@/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const notificationIcons = {
  info: <Bell className="w-5 h-5 text-blue-600" />,
  success: <CheckCircle className="w-5 h-5 text-success-600" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning-600" />,
  error: <XCircle className="w-5 h-5 text-danger-600" />,
};

const notificationColors = {
  info: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  success: 'bg-success-50 border-success-200 hover:bg-success-100',
  warning: 'bg-warning-50 border-warning-200 hover:bg-warning-100',
  error: 'bg-danger-50 border-danger-200 hover:bg-danger-100',
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-xl shadow-level-4 border border-slate-200 dark:border-slate-700 z-50 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-slate-700 dark:text-slate-300"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs text-slate-600 dark:text-slate-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400">No notifications</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={() => markAsRead(notification.id)}
                  onRemove={() => removeNotification(notification.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-b-xl">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              onClick={onClose}
            >
              View all notifications
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: () => void;
  onRemove: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
  onRemove,
}) => {
  const icon = notificationIcons[notification.type];
  const colorClass = notificationColors[notification.type];

  const handleClick = () => {
    onMarkRead();
    window.location.href = `/notifications/${notification.id}`;
  };

  return (
    <div
      className={`p-4 border-l-4 transition-colors cursor-pointer ${colorClass} ${
        !notification.read ? 'bg-opacity-100' : 'opacity-75'
      } dark:bg-opacity-20 dark:hover:bg-opacity-30`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  notification.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {notification.title}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                {formatRelativeTime(notification.timestamp)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          {!notification.read && (
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2" />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
