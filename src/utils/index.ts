import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function getStockStatus(
  stockQuantity: number,
  minStockThreshold: number
): 'critical' | 'low' | 'ok' {
  if (stockQuantity === 0) return 'critical';
  if (stockQuantity <= minStockThreshold) return 'low';
  return 'ok';
}

export function getStockStatusColor(
  status: 'critical' | 'low' | 'ok'
): string {
  switch (status) {
    case 'critical':
      return 'text-danger-600 bg-danger-50';
    case 'low':
      return 'text-warning-600 bg-warning-50';
    case 'ok':
      return 'text-success-600 bg-success-50';
  }
}

export function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high':
      return 'text-danger-700 bg-danger-100 border-danger-200';
    case 'medium':
      return 'text-warning-700 bg-warning-100 border-warning-200';
    case 'low':
      return 'text-primary-700 bg-primary-100 border-primary-200';
  }
}

export function getOrderStatusColor(
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
): string {
  switch (status) {
    case 'pending':
      return 'text-warning-700 bg-warning-100';
    case 'confirmed':
      return 'text-primary-700 bg-primary-100';
    case 'shipped':
      return 'text-blue-700 bg-blue-100';
    case 'delivered':
      return 'text-success-700 bg-success-100';
    case 'cancelled':
      return 'text-slate-700 bg-slate-100';
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
