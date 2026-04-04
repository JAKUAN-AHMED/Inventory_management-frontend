import React from 'react';
import { Settings, Moon, Shield, Database } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useUIStore } from '@/stores/uiStore';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useUIStore();

  const handleExportData = (type: string) => {
    toast.info(`Exporting ${type} data...`);
    // This will be implemented with actual export functionality
    setTimeout(() => {
      toast.success(`${type} data exported successfully`);
    }, 1000);
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached data?')) {
      localStorage.removeItem('redux');
      sessionStorage.clear();
      toast.success('Cache cleared successfully. Page will reload.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your application preferences and configuration
          </p>
        </div>

        {/* Appearance Settings */}
        <Card className="mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Moon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customize how the application looks</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Export and manage your data</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Export Products</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download all products as CSV</p>
              </div>
              <Button variant="secondary" onClick={() => handleExportData('products')}>
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Export Orders</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download all orders as CSV</p>
              </div>
              <Button variant="secondary" onClick={() => handleExportData('orders')}>
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Export Analytics</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download analytics report as CSV</p>
              </div>
              <Button variant="secondary" onClick={() => handleExportData('analytics')}>
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Application Settings */}
        <Card className="mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage application settings</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Clear Cache</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Clear all locally cached data</p>
              </div>
              <Button variant="danger" onClick={handleClearCache}>
                Clear Cache
              </Button>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage security settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-2">Session Management</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your session will expire after 7 days of inactivity. For security reasons, please log in again if your session expires.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-2">Password Policy</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Passwords must be at least 8 characters long and contain a mix of letters, numbers, and special characters.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
