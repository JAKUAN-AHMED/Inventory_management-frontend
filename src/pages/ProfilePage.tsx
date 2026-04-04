import React, { useState } from 'react';
import { User, Mail, Shield, Edit2, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { useGetCurrentUserQuery, useUpdateProfileMutation, useChangePasswordMutation } from '@/store/api';
import type { UserRole } from '@/types';

const profileSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

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

const ProfilePage: React.FC = () => {
  const { data: user, isLoading, refetch } = useGetCurrentUserQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const handleProfileUpdate = async (data: ProfileFormData) => {
    try {
      await updateProfile(data).unwrap();
      toast.success('Profile updated successfully');
      setIsProfileModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }).unwrap();
      toast.success('Password changed successfully');
      setIsPasswordModalOpen(false);
      resetPassword();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to change password');
    }
  };

  const openProfileModal = () => {
    resetProfile({ email: user?.email || '' });
    setIsProfileModalOpen(true);
  };

  const openPasswordModal = () => {
    resetPassword();
    setIsPasswordModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.email}
                </h2>
                <Badge variant={getRoleBadgeColor(user?.role || 'USER')}>
                  {user?.role.toLowerCase() || 'USER'}
                </Badge>
              </div>
            </div>
            <Button variant="secondary" onClick={openProfileModal}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </div>
              <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Role</span>
              </div>
              <p className="text-gray-900 dark:text-white font-medium capitalize">{user?.role.toLowerCase()}</p>
            </div>

            <div className="md:col-span-2">
              <div className="text-gray-600 dark:text-gray-400 mb-1 text-sm">Member Since</div>
              <p className="text-gray-900 dark:text-white font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        {/* Security Card */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Manage your password and security settings
              </p>
            </div>
            <Button variant="secondary" onClick={openPasswordModal}>
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Password</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last changed recently</p>
                </div>
              </div>
              <Button variant="ghost" onClick={openPasswordModal}>
                Update
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleSubmitProfile(handleProfileUpdate)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            {...registerProfile('email')}
            error={profileErrors.email?.message}
            placeholder="your@email.com"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <form onSubmit={handleSubmitPassword(handlePasswordChange)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            {...registerPassword('currentPassword')}
            error={passwordErrors.currentPassword?.message}
            placeholder="Enter current password"
          />

          <Input
            label="New Password"
            type="password"
            {...registerPassword('newPassword')}
            error={passwordErrors.newPassword?.message}
            placeholder="Enter new password"
          />

          <Input
            label="Confirm New Password"
            type="password"
            {...registerPassword('confirmPassword')}
            error={passwordErrors.confirmPassword?.message}
            placeholder="Confirm new password"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Change Password
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default ProfilePage;
