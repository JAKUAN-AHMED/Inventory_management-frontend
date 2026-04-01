import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import SkeletonTable from '@/components/ui/Skeleton';
import { formatCurrency, getStockStatus, getStockStatusColor } from '@/utils';
import type { Product, Category } from '@/types';
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/store/api';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  categoryId: z.string().min(1, 'Please select a category'),
  price: z.number().min(0, 'Price must be a positive number'),
  stockQuantity: z.number().min(0, 'Stock must be a positive number'),
  minStockThreshold: z.number().min(1, 'Minimum stock threshold must be at least 1'),
  status: z.enum(['active', 'out_of_stock', 'discontinued']),
});

type ProductFormData = z.infer<typeof productSchema>;

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices', userId: 'user1', createdAt: '', updatedAt: '' },
  { id: '2', name: 'Clothing', description: 'Apparel and accessories', userId: 'user1', createdAt: '', updatedAt: '' },
  { id: '3', name: 'Grocery', description: 'Food and beverages', userId: 'user1', createdAt: '', updatedAt: '' },
  { id: '4', name: 'Home & Garden', description: 'Home improvement', userId: 'user1', createdAt: '', updatedAt: '' },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro',
    categoryId: '1',
    category: mockCategories[0],
    price: 999.99,
    stockQuantity: 3,
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
    category: mockCategories[0],
    price: 1999.99,
    stockQuantity: 15,
    minStockThreshold: 5,
    status: 'active',
    userId: 'user1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    name: 'AirPods Pro',
    categoryId: '1',
    category: mockCategories[0],
    price: 249.99,
    stockQuantity: 0,
    minStockThreshold: 10,
    status: 'out_of_stock',
    userId: 'user1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    name: 'T-Shirt Basic',
    categoryId: '2',
    category: mockCategories[1],
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
    category: mockCategories[0],
    price: 49.99,
    stockQuantity: 8,
    minStockThreshold: 10,
    status: 'active',
    userId: 'user1',
    createdAt: '',
    updatedAt: '',
  },
];

const ProductsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);

  // RTK Query hooks
  const { data: productsData, isLoading: isFetching } = useGetProductsQuery({ page, pageSize });
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const products = productsData?.data || [];
  const isLoading = isFetching;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'active',
    },
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      reset({
        name: product.name,
        categoryId: product.categoryId,
        price: product.price,
        stockQuantity: product.stockQuantity,
        minStockThreshold: product.minStockThreshold,
        status: product.status,
      });
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        categoryId: '',
        price: 0,
        stockQuantity: 0,
        minStockThreshold: 5,
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data }).unwrap();
        toast.success('Product updated successfully');
      } else {
        await createProduct(data).unwrap();
        toast.success('Product created successfully');
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to delete product');
      }
    }
  };

  const getStatusBadge = (product: Product) => {
    const stockStatus = getStockStatus(product.stockQuantity, product.minStockThreshold);

    if (product.status === 'out_of_stock') {
      return <Badge variant="danger">Out of Stock</Badge>;
    }

    if (stockStatus === 'critical') {
      return (
        <Badge variant="danger">
          <AlertTriangle className="w-3 h-3" />
          Critical Stock
        </Badge>
      );
    }

    if (stockStatus === 'low') {
      return (
        <Badge variant="warning">
          <AlertTriangle className="w-3 h-3" />
          Low Stock
        </Badge>
      );
    }

    return <Badge variant="success">In Stock</Badge>;
  };

  const getStockLevelColor = (product: Product) => {
    const stockStatus = getStockStatus(product.stockQuantity, product.minStockThreshold);
    return getStockStatusColor(stockStatus);
  };

  return (
    <DashboardLayout title="Products" subtitle="Manage your product inventory">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="flex-1 max-w-md">
              <Input
                type="search"
                placeholder="Search products..."
                leftIcon={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'out_of_stock', label: 'Out of Stock' },
                { value: 'discontinued', label: 'Discontinued' },
              ]}
            />
          </div>
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
            Add Product
          </Button>
        </div>

        {/* Products Table */}
        <Card padding="none">
          {isLoading ? (
            <SkeletonTable rows={5} columns={6} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              variant="products"
              title="No products found"
              description={
                searchQuery
                  ? `No products match "${searchQuery}"`
                  : 'Get started by creating your first product'
              }
              action={{
                label: 'Add Product',
                onClick: () => handleOpenModal(),
                variant: 'primary',
              }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead align="right">Price</TableHead>
                  <TableHead align="center">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead align="right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">SKU: {product.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="primary">{product.category?.name || 'Uncategorized'}</Badge>
                    </TableCell>
                    <TableCell align="right">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-slate-900">
                          {product.stockQuantity} units
                        </span>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStockLevelColor(product)}`}>
                          {product.stockQuantity <= product.minStockThreshold
                            ? `${product.minStockThreshold - product.stockQuantity} below threshold`
                            : 'OK'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product)}</TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(product)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4 text-danger-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Product Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingProduct ? 'Edit Product' : 'Create Product'}
          description={
            editingProduct ? 'Update product information' : 'Add a new product to your inventory'
          }
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Product Name"
              placeholder="Enter product name"
              error={errors.name?.message}
              {...register('name')}
            />

            <Select
              label="Category"
              placeholder="Select category"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              error={errors.categoryId?.message}
              {...register('categoryId')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.price?.message}
                {...register('price', { valueAsNumber: true })}
              />

              <Input
                label="Stock Quantity"
                type="number"
                placeholder="0"
                error={errors.stockQuantity?.message}
                {...register('stockQuantity', { valueAsNumber: true })}
              />
            </div>

            <Input
              label="Minimum Stock Threshold"
              type="number"
              placeholder="5"
              hint="You'll be notified when stock falls below this level"
              error={errors.minStockThreshold?.message}
              {...register('minStockThreshold', { valueAsNumber: true })}
            />

            <Select
              label="Status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'out_of_stock', label: 'Out of Stock' },
                { value: 'discontinued', label: 'Discontinued' },
              ]}
              {...register('status')}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
