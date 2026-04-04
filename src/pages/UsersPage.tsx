import React, { useState } from 'react';
import { Edit2, Trash2, Mail, Calendar } from 'lucide-react';
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
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from '@/store/api';
import type { UserWithCounts, UserRole } from '@/types';

const userSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'USER']).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case 'ADMIN':
      return 'danger';
    case 'MANAGER':
      return 'primary';
    default:
      return 'secondary';
  }
};

const UsersPage: React.FC = () => {
  const { data: users = [], isLoading, refetch } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithCounts | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const handleOpenModal = (user?: UserWithCounts) => {
    if (user) {
      setEditingUser(user);
      reset({
        email: user.email,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      reset({});
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    reset();
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!editingUser) return;

    try {
      await updateUser({
        id: editingUser.id,
        data: {
          email: data.email || undefined,
          role: data.role || undefined,
        },
      }).unwrap();
      toast.success('User updated successfully');
      handleCloseModal();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser(userId).unwrap();
      toast.success('User deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage system users and their roles
            </p>
          </div>
        </div>

        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              title="No Users Found"
              description="There are no users in the system yet."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-gray-500">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeColor(user.role)}>
                          {user.role.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {user._count.products}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {user._count.orders}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {user._count.categories}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(user)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                            onClick={() => handleDeleteUser(user.id, user.email)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>

      {/* Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Edit User"
      >
        <form onSubmit={handleSubmit(handleUpdateUser)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="user@example.com"
          />

          <Select
            label="Role"
            {...register('role')}
            options={[
              { value: 'ADMIN', label: 'Admin' },
              { value: 'MANAGER', label: 'Manager' },
              { value: 'USER', label: 'User' },
            ]}
          />

          {editingUser && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Products:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {editingUser._count.products}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Orders:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {editingUser._count.orders}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Categories:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {editingUser._count.categories}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default UsersPage;
