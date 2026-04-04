# Inventory Management System - Frontend

A modern, responsive inventory management dashboard built with React, TypeScript, Tailwind CSS, and Redux Toolkit.

## Features

- 📊 **Dashboard**
  - Real-time metrics and KPIs
  - Revenue and order charts
  - Recent activity feed
  - Low stock alerts

- 📦 **Product Management**
  - Browse and search products
  - Filter by category and status
  - Create, edit, delete products
  - Stock level management
  - Visual stock indicators

- 🛒 **Order Management**
  - Create orders with multiple items
  - Track order status
  - Cancel orders
  - Customer information management
  - Real-time stock validation

- 📁 **Category Management**
  - Organize products by category
  - Category-wise product counts
  - Full CRUD operations

- 🔄 **Restock Queue**
  - View low-stock items
  - Priority-based restocking
  - Bulk restock operations

- 📈 **Analytics**
  - Revenue trends
  - Order statistics
  - Category distribution
  - Top-selling products
  - CSV export functionality

- 👤 **User Features**
  - User profile management
  - Password change
  - Role-based access (ADMIN, MANAGER, USER)
  - User management (Admin only)

- ⚙️ **Settings**
  - Dark mode toggle
  - Data export options
  - Cache management
  - Security settings

- 🔔 **Notifications**
  - Real-time notifications
  - Notification history
  - Mark as read/clear all

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **HTTP**: RTK Query (Redux Toolkit Query)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Tables**: TanStack Table

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running (see `/Inventory_management-backend`)

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd Inventory_management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if needed:
   ```env
   VITE_API_URL=/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       ├── Table.tsx
│       ├── Badge.tsx
│       └── ...
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProductsPage.tsx
│   ├── OrdersPage.tsx
│   ├── CategoriesPage.tsx
│   ├── RestockQueuePage.tsx
│   ├── AnalyticsPage.tsx
│   ├── NotificationsPage.tsx
│   ├── ProfilePage.tsx
│   ├── UsersPage.tsx
│   └── SettingsPage.tsx
├── store/
│   ├── api.ts              # RTK Query API
│   ├── auth.slice.ts       # Auth state
│   ├── ui.slice.ts         # UI state
│   └── index.ts            # Store configuration
├── stores/
│   ├── uiStore.ts          # Zustand UI store
│   └── notificationStore.ts # Client notifications
├── types/
│   └── index.ts            # TypeScript types
├── utils/
│   ├── index.ts            # Utility functions
│   └── export.ts           # CSV export utilities
├── App.tsx                 # Main app component
└── main.tsx                # Entry point
```

## State Management

### Redux Toolkit (Server State)
- API calls via RTK Query
- Authentication state
- Token management

### Zustand (Client State)
- UI preferences (sidebar, dark mode)
- Client-side notifications

## Authentication

The app uses JWT token-based authentication:

1. Login with credentials
2. Token stored in sessionStorage
3. Token automatically attached to API requests
4. Protected routes redirect to login if not authenticated

### Default Test Account
After seeding the backend:
- **Email**: admin@example.com
- **Password**: admin123

## Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## Dark Mode

Toggle dark mode from:
- Settings page
- Header quick toggle

## Features by Role

### ADMIN
- Full access to all features
- User management
- System configuration

### MANAGER
- Product management
- Order management
- Analytics access
- Restock management

### USER
- View products and orders
- Create orders
- View analytics
- Limited management capabilities

## API Integration

All API calls are made through RTK Query with:
- Automatic caching
- Optimistic updates
- Error handling
- Loading states
- Tag-based invalidation

## Export Functionality

CSV export available for:
- Revenue reports (Analytics page)
- Product lists (coming soon)
- Order lists (coming soon)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting by route
- Lazy loading of components
- Memoized calculations
- Efficient re-renders with React.memo
- Optimized chart rendering

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check code quality
4. Test thoroughly
5. Submit a pull request

## License

MIT
