import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import type { Category } from '@/types';
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/store/api';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const CategoriesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  // RTK Query hooks
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: productsData } = useGetProductsQuery({ pageSize: 1000 });
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Calculate product counts per category
  const products = productsData?.data || [];
  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId).length;
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      reset({
        name: category.name,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      reset({
        name: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, data }).unwrap();
        toast.success('Category updated successfully');
      } else {
        await createCategory(data).unwrap();
        toast.success('Category created successfully');
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id).unwrap();
        toast.success('Category deleted successfully');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to delete category');
      }
    }
  };

  return (
    <DashboardLayout title="Categories" subtitle="Organize your products into categories">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex justify-end">
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
            Add Category
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                variant="products"
                title="No categories yet"
                description="Create your first category to organize products"
                action={{
                  label: 'Add Category',
                  onClick: () => handleOpenModal(),
                  variant: 'primary',
                }}
              />
            </div>
          ) : (
            categories.map((category) => (
              <Card
                key={category.id}
                padding="lg"
                hover
                className="group transition-all duration-200 hover:shadow-level-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal(category)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-danger-600 hover:bg-danger-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {category.description || 'No description'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">
                      {getProductCount(category.id)} products
                    </span>
                  </div>
                  <a
                    href={`/products?category=${category.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    View products →
                  </a>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Category Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingCategory ? 'Edit Category' : 'Create Category'}
          description={
            editingCategory ? 'Update category information' : 'Add a new product category'
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Category Name"
              placeholder="e.g., Electronics, Clothing"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Description"
              placeholder="Brief description of this category"
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default CategoriesPage;
