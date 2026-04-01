import React from 'react';
import { AlertTriangle, TrendingUp, CheckCircle, XCircle, Package, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Table, { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency, getPriorityColor } from '@/utils';
import type { RestockQueue, RestockPriority } from '@/types';
import {
  useGetRestockQueueQuery,
  useCompleteRestockMutation,
  useRemoveRestockQueueMutation,
  useBulkRestockMutation,
} from '@/store/api';

const RestockQueuePage: React.FC = () => {
  const { data: restockQueue = [], isLoading } = useGetRestockQueueQuery();
  const [completeRestock] = useCompleteRestockMutation();
  const [removeRestockQueue] = useRemoveRestockQueueMutation();
  const [bulkRestock] = useBulkRestockMutation();

  // Sort by priority (high first) and then by stock quantity
  const sortedQueue = [...restockQueue].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return (a.product?.stockQuantity || 0) - (b.product?.stockQuantity || 0);
  });

  const handleRestock = async (id: string, productId: string, quantityNeeded: number) => {
    try {
      await completeRestock(id).unwrap();
      toast.success(`Product restocked with ${quantityNeeded} units`);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to restock product');
    }
  };

  const handleRemoveFromQueue = async (id: string) => {
    if (window.confirm('Remove this item from the restock queue?')) {
      try {
        await removeRestockQueue(id).unwrap();
        toast.success('Item removed from queue');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to remove from queue');
      }
    }
  };

  const handleBulkRestock = async () => {
    try {
      const ids = restockQueue.map((item) => item.id);
      await bulkRestock(ids).unwrap();
      toast.success(`All ${restockQueue.length} items restocked successfully`);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to bulk restock');
    }
  };

  const getPriorityBadge = (priority: RestockPriority) => {
    const icons = {
      high: <AlertTriangle className="w-3 h-3" />,
      medium: <TrendingUp className="w-3 h-3" />,
      low: <Package className="w-3 h-3" />,
    };

    return (
      <Badge className={getPriorityColor(priority)}>
        {icons[priority]}
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </Badge>
    );
  };

  const totalValue = restockQueue.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantityNeeded;
  }, 0);

  if (isLoading) {
    return (
      <DashboardLayout title="Restock Queue" subtitle="Manage low stock products">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} padding="md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-24 mb-2" />
                    <div className="h-8 bg-slate-200 rounded animate-pulse w-16" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card padding="none">
            <div className="p-8">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-32 mb-4" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded animate-pulse mb-2" />
              ))}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Restock Queue" subtitle="Manage low stock products">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-danger-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">High Priority</p>
                <p className="text-2xl font-bold text-slate-900">
                  {restockQueue.filter((i) => i.priority === 'high').length}
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Medium Priority</p>
                <p className="text-2xl font-bold text-slate-900">
                  {restockQueue.filter((i) => i.priority === 'medium').length}
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Value</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bulk Actions */}
        {restockQueue.length > 0 && (
          <div className="flex justify-end">
            <Button onClick={handleBulkRestock} leftIcon={<ArrowUpCircle className="w-4 h-4" />}>
              Bulk Restock All ({restockQueue.length})
            </Button>
          </div>
        )}

        {/* Restock Queue Table */}
        <Card padding="none">
          {restockQueue.length === 0 ? (
            <EmptyState
              icon={<CheckCircle className="w-12 h-12 text-success-600" />}
              title="All stocked up!"
              description="No products need restocking at the moment"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Quantity Needed</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Est. Value</TableHead>
                  <TableHead align="right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedQueue.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{item.product?.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          SKU: {item.product?.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            (item.product?.stockQuantity || 0) === 0
                              ? 'text-danger-600'
                              : 'text-slate-900'
                          }`}
                        >
                          {item.product?.stockQuantity || 0} units
                        </span>
                        {(item.product?.stockQuantity || 0) === 0 && (
                          <Badge variant="danger">Out of Stock</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {item.product?.minStockThreshold || 0} units
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-primary-600">
                        {item.quantityNeeded} units
                      </span>
                    </TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency((item.product?.price || 0) * item.quantityNeeded)}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleRestock(item.id, item.productId, item.quantityNeeded)
                          }
                          leftIcon={<CheckCircle className="w-4 h-4" />}
                        >
                          Restock
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromQueue(item.id)}
                          className="text-slate-600"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Info Banner */}
        <Card padding="md" className="bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-primary-900">
                Automated Restock Queue
              </h4>
              <p className="text-sm text-primary-700 mt-1">
                Products are automatically added to this queue when their stock falls below the
                minimum threshold. High priority items (out of stock) appear at the top.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RestockQueuePage;
