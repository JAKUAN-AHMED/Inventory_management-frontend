import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useLoginMutation } from '@/store/api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();
      // Store credentials in Redux state (not localStorage)
      dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Invalid email or password');
    }
  };

  const handleDemoLogin = async () => {
    try {
      const result = await login({ email: 'demo@inventory.com', password: 'demo123' }).unwrap();
      dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
      toast.success('Logged in with demo account!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to login with demo account');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-level-3 mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Pro</h1>
          <p className="text-slate-600 mt-2">Smart Inventory Management</p>
        </div>

        {/* Login Card */}
        <Card padding="lg" className="backdrop-blur-sm bg-white/90">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
            <p className="text-slate-600 mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Forgot password?
              </a>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Sign In
              {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or</span>
            </div>
          </div>

          {/* Demo Login */}
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleDemoLogin}
            isLoading={isLoading}
          >
            Try Demo Account
          </Button>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary-600">100%</p>
            <p className="text-xs text-slate-600 mt-1">Secure</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-600">24/7</p>
            <p className="text-xs text-slate-600 mt-1">Support</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-600">Free</p>
            <p className="text-xs text-slate-600 mt-1">Trial</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
