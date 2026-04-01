import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, XCircle, AlertCircle, Clock, Check } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useNotificationStore } from '@/stores/notificationStore';
import { formatDateTime } from '@/utils';

const NotificationsDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notifications, markAsRead, removeNotification } = useNotificationStore();

  const notification = notifications.find((n) => n.id === id);

  if (!notification) {
    return (
      <DashboardLayout title="Notification" subtitle="Notification not found">
        <Card padding="lg">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">
              Notification not found
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              This notification may have been deleted.
            </p>
            <Button
              variant="primary"
              className="mt-6"
              onClick={() => navigate('/notifications')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Notifications
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const handleMarkRead = () => {
    markAsRead(notification.id);
  };

  const handleDelete = () => {
    removeNotification(notification.id);
    navigate('/notifications');
  };

  const typeConfig = {
    info: {
      icon: <Bell className="w-6 h-6" />,
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'primary',
    },
    success: {
      icon: <CheckCircle className="w-6 h-6" />,
      bg: 'bg-success-100 dark:bg-success-900/30',
      text: 'text-success-600 dark:text-success-400',
      border: 'border-success-200 dark:border-success-800',
      badge: 'success',
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6" />,
      bg: 'bg-warning-100 dark:bg-warning-900/30',
      text: 'text-warning-600 dark:text-warning-400',
      border: 'border-warning-200 dark:border-warning-800',
      badge: 'warning',
    },
    error: {
      icon: <XCircle className="w-6 h-6" />,
      bg: 'bg-danger-100 dark:bg-danger-900/30',
      text: 'text-danger-600 dark:text-danger-400',
      border: 'border-danger-200 dark:border-danger-800',
      badge: 'danger',
    },
  };

  const config = typeConfig[notification.type];

  return (
    <DashboardLayout title="Notification Details" subtitle="View notification details">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/notifications')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notifications
        </Button>

        {/* Main Notification Card */}
        <Card padding="lg" className={`border-l-4 ${config.border}`}>
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg} ${config.text}`}>
              {config.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {notification.title}
                </h2>
                <Badge variant={config.badge as any}>
                  {notification.type}
                </Badge>
                {!notification.read && (
                  <Badge variant="primary">New</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDateTime(notification.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 mb-6">
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {notification.message}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!notification.read && (
              <Button
                variant="primary"
                onClick={handleMarkRead}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Mark as Read
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={handleDelete}
              className="text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/20"
            >
              Delete Notification
            </Button>
          </div>
        </Card>

        {/* Additional Info Card */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Notification Details
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Type
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                  {notification.type}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Status
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {notification.read ? 'Read' : 'Unread'}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Received
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatDateTime(notification.timestamp)}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  ID
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 font-mono">
                  {notification.id}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/orders')}
            >
              View Orders
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/products')}
            >
              View Products
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/restock')}
            >
              View Restock Queue
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsDetailsPage;
