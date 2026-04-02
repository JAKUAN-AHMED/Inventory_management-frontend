import React from 'react';
import { Bell, Check, Trash2, AlertCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useNotificationStore, type Notification } from '@/stores/notificationStore';
import { formatRelativeTime } from '@/utils';

const notificationIcons = {
  info: <Bell className="w-5 h-5 text-blue-600" />,
  success: <CheckCircle className="w-5 h-5 text-success-600" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning-600" />,
  error: <XCircle className="w-5 h-5 text-danger-600" />,
};

const notificationColors = {
  info: 'bg-blue-50 border-blue-200',
  success: 'bg-success-50 border-success-200',
  warning: 'bg-warning-50 border-warning-200',
  error: 'bg-danger-50 border-danger-200',
};

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  const handleMarkRead = (id: string) => {
    markAsRead(id);
  };

  const handleRemove = (id: string) => {
    removeNotification(id);
  };

  return (
    <DashboardLayout title="Notifications" subtitle="Manage your notifications">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold text-slate-900">
                  {notifications.length}
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Unread</p>
                <p className="text-2xl font-bold text-slate-900">{unreadCount}</p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Read</p>
                <p className="text-2xl font-bold text-slate-900">
                  {notifications.length - unreadCount}
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Alerts</p>
                <p className="text-2xl font-bold text-slate-900">
                  {notifications.filter((n) => n.type === 'warning' || n.type === 'error').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="primary">All ({notifications.length})</Badge>
            <Badge variant="warning">Unread ({unreadCount})</Badge>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={markAllAsRead}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Mark All Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-danger-600 hover:bg-danger-50"
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card padding="lg">
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900">
                No notifications
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={() => handleMarkRead(notification.id)}
                onRemove={() => handleRemove(notification.id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: () => void;
  onRemove: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
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
    <Card
      padding="md"
      className={`border-l-4 transition-all cursor-pointer ${colorClass} ${
        !notification.read ? 'shadow-level-2' : 'opacity-80'
      } hover:shadow-level-3 dark:hover:shadow-level-3`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className={`text-base font-semibold ${
                    notification.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {notification.title}
                </h4>
                {!notification.read && (
                  <Badge variant="primary">New</Badge>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {notification.message}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {formatRelativeTime(notification.timestamp)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead();
                  }}
                  className="text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-slate-400 hover:text-danger-600 dark:text-slate-500 dark:hover:text-danger-400"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationsPage;
