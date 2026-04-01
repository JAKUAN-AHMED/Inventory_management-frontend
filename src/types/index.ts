// User types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager';
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Product types
export type ProductStatus = 'active' | 'out_of_stock' | 'discontinued';

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  category?: Category;
  price: number;
  stockQuantity: number;
  minStockThreshold: number;
  status: ProductStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Order types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  userId: string;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Activity Log types
export type ActivityType = 
  | 'order_created'
  | 'order_updated'
  | 'order_cancelled'
  | 'stock_updated'
  | 'product_added'
  | 'product_updated'
  | 'product_deleted'
  | 'restock_queued'
  | 'restock_completed'
  | 'user_login'
  | 'user_signup';

export interface ActivityLog {
  id: string;
  action: ActivityType;
  entityType: 'order' | 'product' | 'stock' | 'user' | 'restock';
  entityId: string;
  userId: string;
  details: string;
  timestamp: string;
}

// Restock Queue types
export type RestockPriority = 'high' | 'medium' | 'low';
export type RestockStatus = 'pending' | 'completed' | 'removed';

export interface RestockQueue {
  id: string;
  productId: string;
  product?: Product;
  priority: RestockPriority;
  quantityNeeded: number;
  status: RestockStatus;
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export interface DashboardMetrics {
  totalOrdersToday: number;
  pendingOrders: number;
  completedOrders: number;
  lowStockItems: number;
  revenueToday: number;
  revenueChange: number;
}

export interface ProductSummary {
  id: string;
  name: string;
  stockQuantity: number;
  minStockThreshold: number;
  status: ProductStatus;
  isLowStock: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  role?: 'admin' | 'manager';
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Form types
export interface ProductFormData {
  name: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  minStockThreshold: number;
  status: ProductStatus;
}

export interface OrderFormData {
  customerId: string;
  customerName: string;
  items: OrderItemInput[];
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}
