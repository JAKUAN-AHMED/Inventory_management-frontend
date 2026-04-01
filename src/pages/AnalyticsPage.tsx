import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Package, Download } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
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
  AreaChart,
  Area,
} from 'recharts';
import { formatCurrency } from '@/utils';
import {
  useGetRevenueDataQuery,
  useGetOrderDataQuery,
  useGetProductSummaryQuery,
  useGetProductsQuery,
  useGetCategoriesQuery,
} from '@/store/api';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedChart, setSelectedChart] = useState('revenue');

  // RTK Query hooks
  const { data: revenueData = [] } = useGetRevenueDataQuery({ days: parseInt(timeRange) || 7 });
  const { data: orderData = [] } = useGetOrderDataQuery({ days: parseInt(timeRange) || 7 });
  const { data: productSummary = [] } = useGetProductSummaryQuery();
  const { data: productsResponse } = useGetProductsQuery({ pageSize: 1000 });
  const { data: categories = [] } = useGetCategoriesQuery();

  // Extract products array from paginated response
  const products = productsResponse?.data || [];

  // Calculate metrics from real data
  const totalRevenue = useMemo(() => {
    return revenueData.reduce((sum, d) => sum + d.revenue, 0);
  }, [revenueData]);

  const totalOrders = useMemo(() => {
    return orderData.reduce((sum, d) => d.orders + sum, 0);
  }, [orderData]);

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Transform revenue data for chart
  const chartRevenueData = revenueData.map(item => ({
    date: item.date,
    revenue: item.revenue,
    orders: orderData.find(o => o.date === item.date)?.orders || 0,
  }));

  // Calculate category distribution from products
  const categoryData = useMemo(() => {
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.id, { name: cat.name, value: 0 });
    });

    products.forEach(product => {
      const existing = categoryMap.get(product.categoryId);
      if (existing) {
        existing.value += product.stockQuantity;
      }
    });

    const total = Object.values(categoryMap.values()).reduce((sum: any, c: any) => sum + c.value, 0);
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];
    
    return Array.from(categoryMap.values()).map((item: any, index) => ({
      ...item,
      percent: total > 0 ? ((item.value / total) * 100).toFixed(0) : 0,
      color: colors[index % colors.length],
    })).filter((item: any) => item.value > 0);
  }, [products, categories]);

  // Top products by revenue
  const topProducts = useMemo(() => {
    return [...productSummary]
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5)
      .map((summary, index) => {
        const product = products.find(p => p.id === summary.productId);
        return {
          id: summary.productId,
          name: product?.name || summary.name || 'Unknown Product',
          sales: summary.totalSales,
          revenue: summary.totalRevenue,
          rank: index + 1,
        };
      });
  }, [productSummary, products]);

  return (
    <DashboardLayout title="Analytics" subtitle="Detailed insights and reports">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={[
                { value: '7d', label: 'Last 7 Days' },
                { value: '14d', label: 'Last 14 Days' },
                { value: '30d', label: 'Last 30 Days' },
                { value: '90d', label: 'Last 90 Days' },
              ]}
            />
            <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-success-600 mt-1">↑ 12.5% vs previous</p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
                <p className="text-xs text-success-600 mt-1">↑ 8.2% vs previous</p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(avgOrderValue)}</p>
                <p className="text-xs text-success-600 mt-1">↑ 4.1% vs previous</p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Growth Rate</p>
                <p className="text-2xl font-bold text-slate-900">+24.8%</p>
                <p className="text-xs text-success-600 mt-1">Month over month</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Chart */}
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {selectedChart === 'revenue' ? 'Revenue Trend' : 'Order Volume'}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {timeRange === '7d' ? 'Last 7 days' : `Last ${timeRange}`} performance
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedChart === 'revenue' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedChart('revenue')}
              >
                Revenue
              </Button>
              <Button
                variant={selectedChart === 'orders' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedChart('orders')}
              >
                Orders
              </Button>
            </div>
          </div>
          <div className="h-80">
            {chartRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartRevenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(v) => selectedChart === 'revenue' ? `$${v / 1000}k` : v}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number) => [
                      selectedChart === 'revenue' ? formatCurrency(value) : value,
                      selectedChart === 'revenue' ? 'Revenue' : 'Orders',
                    ]}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedChart === 'revenue' ? 'revenue' : 'orders'}
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                No data available for the selected period
              </div>
            )}
          </div>
        </Card>

        {/* Category Distribution & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Products by Category</h3>
              <p className="text-sm text-slate-600 mt-1">Distribution across categories</p>
            </div>
            <div className="h-48">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  No category data available
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}</span>
                  <span className="text-sm font-semibold text-slate-900 ml-auto">{item.percent}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Products */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Top Selling Products</h3>
              <p className="text-sm text-slate-600 mt-1">Based on total revenue</p>
            </div>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-600">
                      {product.rank}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.sales} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No product sales data available
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
