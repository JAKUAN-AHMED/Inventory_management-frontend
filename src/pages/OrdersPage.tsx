import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Package, User, Trash2, AlertCircle } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Table, { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency, formatRelativeTime, getOrderStatusColor } from '@/utils';
import type { Order, Product, OrderStatus, OrderFormData } from '@/types';
import {
  useGetOrdersQuery,
  useGetProductsQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} from '@/store/api';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

const orderSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

type OrderFormData = z.infer<typeof orderSchema>;

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro',
    categoryId: '1',
    price: 999.99,
    stockQuantity: 15,
    minStockThreshold: 5,
    status: 'active',
    userId: 'user1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    name: 'MacBook Pro 14"',
    categoryId: '1',
    price: 1999.99,
    stockQuantity: 8,
    minStockThreshold: 3,
    status: 'active',
    userId: 'user1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    name: 'AirPods Pro',
    categoryId: '1',
    price: 249.99,
    stockQuantity: 25,
    minStockThreshold: 10,
    status: 'active',
    userId: 'user1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    name: 'T-Shirt Basic',
    categoryId: '2',
    price: 29.99,
    stockQuantity: 150,
    minStockThreshold: 20,
    status: 'active',
    userId: 'user1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '5',
    name: 'Wireless Mouse',
    categoryId: '1',
    price: 49.99,
    stockQuantity: 0,
    minStockThreshold: 10,
    status: 'out_of_stock',
    userId: 'user1',
    createdAt: '',
    updatedAt: '',
  },
];

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001023',
    customerId: 'cust1',
    customerName: 'John Doe',
    userId: 'user1',
    status: 'PENDING',
    totalPrice: 1249.98,
    items: [
      { id: 'item1', productId: '1', product: mockProducts[0], quantity: 1, price: 999.99, subtotal: 999.99 },
      { id: 'item2', productId: '3', product: mockProducts[2], quantity: 1, price: 249.99, subtotal: 249.99 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    orderNumber: 'ORD-001022',
    customerId: 'cust2',
    customerName: 'Jane Smith',
    userId: 'user1',
    status: 'SHIPPED',
    totalPrice: 2049.98,
    items: [
      { id: 'item3', productId: '2', product: mockProducts[1], quantity: 1, price: 1999.99, subtotal: 1999.99 },
      { id: 'item4', productId: '4', product: mockProducts[3], quantity: 1, price: 29.99, subtotal: 29.99 },
      { id: 'item5', productId: '5', product: mockProducts[4], quantity: 1, price: 49.99, subtotal: 49.99 },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    orderNumber: 'ORD-001021',
    customerId: 'cust3',
    customerName: 'Bob Wilson',
    userId: 'user1',
    status: 'DELIVERED',
    totalPrice: 149.97,
    items: [
      { id: 'item6', productId: '4', product: mockProducts[3], quantity: 5, price: 29.99, subtotal: 149.95 },
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const OrdersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [stockWarnings, setStockWarnings] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);

  // RTK Query hooks
  const { data: ordersData, isLoading: ordersLoading, refetch } = useGetOrdersQuery({ page, pageSize });
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ pageSize: 100 });
  const [createOrder] = useCreateOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const orders = ordersData?.data || [];
  const products = productsData?.data || [];
  const isLoading = ordersLoading || productsLoading;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      items: [{ productId: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');

  // Check stock when quantity changes
  useEffect(() => {
    const warnings: Record<string, string> = {};
    items.forEach((item, index) => {
      if (item.productId) {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          if (product.stockQuantity === 0) {
            warnings[index] = 'This product is out of stock';
          } else if (item.quantity > product.stockQuantity) {
            warnings[index] = `Only ${product.stockQuantity} items available in stock`;
          } else if (item.quantity > product.stockQuantity * 0.8) {
            warnings[index] = `Warning: ${product.stockQuantity} items available`;
          }
        }
      }
    });
    setStockWarnings(warnings);
  }, [items, products]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = () => {
    reset({
      customerName: '',
      items: [{ productId: '', quantity: 1 }],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        return total + product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const onSubmit = async (data: OrderFormData) => {
    // Validate stock availability
    const hasStockIssue = Object.values(stockWarnings).some(
      (warning) => warning.includes('out of stock') || warning.includes('Only')
    );

    if (hasStockIssue) {
      toast.error('Cannot create order due to insufficient stock');
      return;
    }

    try {
      await createOrder(data).unwrap();
      toast.success('Order created successfully');
      refetch(); // Refresh orders list
      handleCloseModal();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to create order');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
      refetch(); // Refresh orders list
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, 'warning' | 'primary' | 'blue' | 'success' | 'slate'> = {
      PENDING: 'warning',
      CONFIRMED: 'primary',
      SHIPPED: 'blue',
      DELIVERED: 'success',
      CANCELLED: 'slate',
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const productOptions = products
    .filter((p) => p.status === 'active')
    .map((p) => ({ value: p.id, label: `${p.name} - ${formatCurrency(p.price)} (${p.stockQuantity} in stock)` }));

  return (
    <DashboardLayout title="Orders" subtitle="Manage customer orders">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="flex-1 max-w-md">
              <Input
                type="search"
                placeholder="Search orders..."
                leftIcon={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'CONFIRMED', label: 'Confirmed' },
                { value: 'SHIPPED', label: 'Shipped' },
                { value: 'DELIVERED', label: 'Delivered' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
            />
          </div>
          <Button onClick={handleOpenModal} leftIcon={<Plus className="w-4 h-4" />}>
            Create Order
          </Button>
        </div>

        {/* Orders Table */}
        <Card padding="none">
          {orders.length === 0 ? (
            <EmptyState
              variant="orders"
              title="No orders yet"
              description="Get started by creating your first order"
              action={{
                label: 'Create Order',
                onClick: handleOpenModal,
                variant: 'primary',
              }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead align="right">Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead align="right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <span className="font-medium text-primary-600">{order.orderNumber}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-900">{order.customerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{order.items.length} items</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell align="right">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {formatRelativeTime(order.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          options={[
                            { value: 'PENDING', label: 'Pending' },
                            { value: 'CONFIRMED', label: 'Confirmed' },
                            { value: 'SHIPPED', label: 'Shipped' },
                            { value: 'DELIVERED', label: 'Delivered' },
                            { value: 'CANCELLED', label: 'Cancelled' },
                          ]}
                          className="w-32"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Create Order Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Create New Order"
          description="Add customer details and select products"
          size="xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Customer Name"
              placeholder="Enter customer name"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.customerName?.message}
              {...register('customerName')}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Order Items</label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => append({ productId: '', quantity: 1 })}
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <Select
                      placeholder="Select product"
                      options={productOptions}
                      error={errors.items?.[index]?.productId?.message}
                      value={items[index]?.productId || ''}
                      onChange={(e) => setValue(`items.${index}.productId`, e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={items[index]?.quantity || 1}
                      onChange={(e) =>
                        setValue(`items.${index}.quantity`, parseInt(e.target.value) || 1)
                      }
                      error={errors.items?.[index]?.quantity?.message}
                    />
                  </div>
                  {stockWarnings[index] && (
                    <div className="flex items-center gap-1 text-warning-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{stockWarnings[index]}</span>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-danger-600 hover:bg-danger-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {errors.items?.root && (
                <p className="text-sm text-danger-600">{errors.items.root.message}</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-900">Order Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Order
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
