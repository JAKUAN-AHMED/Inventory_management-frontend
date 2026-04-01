import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  Product,
  ProductFormData,
  Category,
  CategoryFormData,
  Order,
  OrderFormData,
  OrderStatus,
  DashboardMetrics,
  ProductSummary,
  ActivityLog,
  RestockQueue,
  PaginatedResponse,
} from '@/types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '/api';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    // Get token from Redux state
    const token = state.auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'Product',
    'Order',
    'Category',
    'User',
    'Dashboard',
    'RestockQueue',
    'ActivityLog',
  ],
  endpoints: (builder) => ({
    // ============ AUTH ============
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    signup: builder.mutation<AuthResponse, SignupCredentials>({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // ============ PRODUCTS ============
    getProducts: builder.query<
      PaginatedResponse<Product>,
      { page?: number; pageSize?: number; search?: string; categoryId?: string; status?: string }
    >({
      query: (params) => ({
        url: '/products',
        params,
      }),
      transformResponse: (response: { success: boolean; data: PaginatedResponse<Product> }) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation<Product, ProductFormData>({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, 'Dashboard'],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: Partial<ProductFormData> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        'Dashboard',
      ],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        'Dashboard',
      ],
    }),

    updateStock: builder.mutation<Product, { id: string; stockQuantity: number }>({
      query: ({ id, stockQuantity }) => ({
        url: `/products/${id}/stock`,
        method: 'PATCH',
        body: { stockQuantity },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        'Dashboard',
      ],
    }),

    getLowStockProducts: builder.query<Product[], void>({
      query: () => '/products/low-stock',
      providesTags: ['Product'],
    }),

    // ============ CATEGORIES ============
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      transformResponse: (response: { success: boolean; data: Category[] }) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category' as const, id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    createCategory: builder.mutation<Category, CategoryFormData>({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    updateCategory: builder.mutation<Category, { id: string; data: Partial<CategoryFormData> }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Category', id }],
    }),

    // ============ ORDERS ============
    getOrders: builder.query<
      PaginatedResponse<Order>,
      { page?: number; pageSize?: number; search?: string; status?: OrderStatus; dateFrom?: string; dateTo?: string }
    >({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      transformResponse: (response: { success: boolean; data: PaginatedResponse<Order> }) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    createOrder: builder.mutation<Order, OrderFormData>({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Order', id: 'LIST' },
        'Product',
        'Dashboard',
      ],
    }),

    updateOrderStatus: builder.mutation<Order, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'Dashboard',
      ],
    }),

    cancelOrder: builder.mutation<Order, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'Product',
        'Dashboard',
      ],
    }),

    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    // ============ DASHBOARD ============
    getDashboardMetrics: builder.query<DashboardMetrics, void>({
      query: () => '/dashboard/metrics',
      transformResponse: (response: { success: boolean; data: DashboardMetrics }) => {
        return response.data;
      },
      providesTags: ['Dashboard'],
    }),

    getProductSummary: builder.query<ProductSummary[], void>({
      query: () => '/dashboard/product-summary',
      transformResponse: (response: { success: boolean; data: ProductSummary[] }) => {
        return response.data;
      },
      providesTags: ['Dashboard', 'Product'],
    }),

    getActivityLog: builder.query<ActivityLog[], { limit?: number }>({
      query: (params) => ({
        url: '/dashboard/activity',
        params,
      }),
      transformResponse: (response: { success: boolean; data: ActivityLog[] }) => {
        return response.data;
      },
      providesTags: ['ActivityLog'],
    }),

    getRevenueData: builder.query<{ date: string; revenue: number }[], { days?: number }>({
      query: (params) => ({
        url: '/dashboard/revenue',
        params,
      }),
      transformResponse: (response: { success: boolean; data: { date: string; revenue: number }[] }) => {
        return response.data;
      },
      providesTags: ['Dashboard'],
    }),

    getOrderData: builder.query<{ date: string; orders: number }[], { days?: number }>({
      query: (params) => ({
        url: '/dashboard/orders',
        params,
      }),
      transformResponse: (response: { success: boolean; data: { date: string; orders: number }[] }) => {
        return response.data;
      },
      providesTags: ['Dashboard'],
    }),

    // ============ RESTOCK QUEUE ============
    getRestockQueue: builder.query<RestockQueue[], void>({
      query: () => '/restock-queue',
      transformResponse: (response: { success: boolean; data: RestockQueue[] }) => {
        return response.data;
      },
      providesTags: ['RestockQueue'],
    }),

    addToRestockQueue: builder.mutation<RestockQueue, { productId: string; quantityNeeded: number }>({
      query: (data) => ({
        url: '/restock-queue',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['RestockQueue', 'Product'],
    }),

    completeRestock: builder.mutation<RestockQueue, string>({
      query: (id) => ({
        url: `/restock-queue/${id}/complete`,
        method: 'PATCH',
      }),
      invalidatesTags: ['RestockQueue', 'Product', 'Dashboard'],
    }),

    removeRestockQueue: builder.mutation<void, string>({
      query: (id) => ({
        url: `/restock-queue/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RestockQueue'],
    }),

    bulkRestock: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: '/restock-queue/bulk-complete',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: ['RestockQueue', 'Product', 'Dashboard'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Auth
  useLoginMutation,
  useSignupMutation,
  // Products
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStockMutation,
  useGetLowStockProductsQuery,
  // Categories
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  // Orders
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useDeleteOrderMutation,
  // Dashboard
  useGetDashboardMetricsQuery,
  useGetProductSummaryQuery,
  useGetActivityLogQuery,
  useGetRevenueDataQuery,
  useGetOrderDataQuery,
  // Restock Queue
  useGetRestockQueueQuery,
  useAddToRestockQueueMutation,
  useCompleteRestockMutation,
  useRemoveRestockQueueMutation,
  useBulkRestockMutation,
} = api;

export default api;
