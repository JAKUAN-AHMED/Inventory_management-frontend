import React from 'react';
import {
  ShoppingCart,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { formatCurrency, formatRelativeTime } from '@/utils';
import type { ActivityLog, Order } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  useGetDashboardMetricsQuery,
  useGetActivityLogQuery,
  useGetRevenueDataQuery,
  useGetOrderDataQuery,
  useGetOrdersQuery,
} from '@/store/api';

// Static data for charts
const orderStatusColors = ['#f59e0b', '#6366f1', '#3b82f6', '#10b981', '#64748b'];

const activityIcons: Record<string, React.ReactNode> = {
  order_created: <ShoppingCart className="w-4 h-4" />,
  order_updated: <Truck className="w-4 h-4" />,
  order_cancelled: <XCircle className="w-4 h-4" />,
  stock_updated: <Package className="w-4 h-4" />,
  product_added: <Package className="w-4 h-4" />,
  product_updated: <Package className="w-4 h-4" />,
  restock_queued: <AlertTriangle className="w-4 h-4" />,
  restock_completed: <CheckCircle2 className="w-4 h-4" />,
};

const activityColors: Record<string, string> = {
  order_created: 'bg-blue-100 text-blue-600',
  order_updated: 'bg-indigo-100 text-indigo-600',
  order_cancelled: 'bg-slate-100 text-slate-600',
  stock_updated: 'bg-success-100 text-success-600',
  product_added: 'bg-primary-100 text-primary-600',
  product_updated: 'bg-primary-100 text-primary-600',
  restock_queued: 'bg-warning-100 text-warning-600',
  restock_completed: 'bg-success-100 text-success-600',
};

export const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  iconBg: string;
  isLoading?: boolean;
}> = ({ title, value, change, icon, iconBg, isLoading }) => {
  if (isLoading) {
    return <Skeleton variant="rounded" height="120px" className="w-full" />;
  }

  return (
    <Card padding="md" className="hover:shadow-level-2 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {change >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-success-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-danger-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  change >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}
              >
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-slate-500">vs last week</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export const ActivityLogItem: React.FC<{ log: ActivityLog }> = ({ log }) => {
  const icon = activityIcons[log.action] || <Clock className="w-4 h-4" />;
  const colorClass = activityColors[log.action] || 'bg-slate-100 text-slate-600';

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900">{log.details}</p>
        <p className="text-xs text-slate-500 mt-0.5">{formatRelativeTime(log.timestamp)}</p>
      </div>
    </div>
  );
};

export const RecentOrdersTable: React.FC<{ orders: Partial<Order>[] }> = ({ orders }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              Order
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              Customer
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              Status
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              Total
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                <span className="text-sm font-medium text-primary-600">
                  {order.orderNumber}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-900">{order.customerName}</span>
              </td>
              <td className="px-4 py-3">
                <Badge variant={order.status as any}>{order.status}</Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(order.totalPrice || 0)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-600">
                  {formatRelativeTime(order.createdAt || '')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  // Use RTK Query hooks to fetch real data from backend
  const { data: metrics, isLoading: metricsLoading } = useGetDashboardMetricsQuery();
  const { data: activityLogs = [], isLoading: activityLoading } = useGetActivityLogQuery({ limit: 10 });
  const { data: revenueData = [] } = useGetRevenueDataQuery({ days: 7 });
  const { data: orderData = [] } = useGetOrderDataQuery({ days: 7 });
  const { data: productSummary = [] } = useGetProductSummaryQuery();
  const { data: recentOrdersData } = useGetOrdersQuery({ page: 1, pageSize: 5 });

  const isLoading = metricsLoading || activityLoading;
  const recentOrders = recentOrdersData?.data || [];

  // Transform revenue data for chart
  const chartRevenueData = revenueData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: item.revenue,
  }));

  // Transform order data for pie chart (by status)
  const orderStatusData = orderData.length > 0 
    ? orderData.map((item, index) => ({
        name: item.date,
        value: item.orders,
        color: orderStatusColors[index % orderStatusColors.length],
      }))
    : [];

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Overview of your inventory and sales">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rounded" height="120px" className="w-full" />
            ))}
          </div>
          <Skeleton variant="rounded" height="300px" className="w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" subtitle="Overview of your inventory and sales">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Orders Today"
          value={metrics?.totalOrdersToday || 0}
          change={12.5}
          icon={<ShoppingCart className="w-6 h-6 text-primary-600" />}
          iconBg="bg-primary-100"
          isLoading={isLoading}
        />
        <MetricCard
          title="Pending Orders"
          value={metrics?.pendingOrders || 0}
          icon={<Clock className="w-6 h-6 text-warning-600" />}
          iconBg="bg-warning-100"
          isLoading={isLoading}
        />
        <MetricCard
          title="Low Stock Items"
          value={metrics?.lowStockItems || 0}
          icon={<AlertTriangle className="w-6 h-6 text-danger-600" />}
          iconBg="bg-danger-100"
          isLoading={isLoading}
        />
        <MetricCard
          title="Revenue Today"
          value={formatCurrency(metrics?.revenueToday || 0)}
          change={metrics?.revenueChange}
          icon={<DollarSign className="w-6 h-6 text-success-600" />}
          iconBg="bg-success-100"
          isLoading={isLoading}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Revenue Overview</h3>
            <p className="text-sm text-slate-600 mt-1">Last 7 days revenue trend</p>
          </div>
          <div className="h-72">
            {chartRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                No revenue data available
              </div>
            )}
          </div>
        </Card>

        {/* Activity Log */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
              <p className="text-sm text-slate-600 mt-1">Latest system actions</p>
            </div>
          </div>
          <div className="divide-y divide-slate-200">
            {Array.isArray(activityLogs) && activityLogs.length > 0 ? (
              activityLogs.map((log) => (
                <ActivityLogItem key={log.id} log={log} />
              ))
            ) : (
              <div className="p-8 text-center">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-600">No recent activity</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Order Status Distribution & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Pie Chart */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Order Status</h3>
            <p className="text-sm text-slate-600 mt-1">Distribution by status</p>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
              <p className="text-sm text-slate-600 mt-1">Latest orders from customers</p>
            </div>
            <a
              href="/orders"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all →
            </a>
          </div>
          {recentOrders.length > 0 ? (
            <RecentOrdersTable orders={recentOrders} />
          ) : (
            <div className="p-8 text-center text-slate-500">
              No recent orders
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
