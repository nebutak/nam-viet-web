# LỘ TRÌNH PHÁT TRIỂN FRONTEND - HỆ THỐNG QUẢN LÝ BÁN HÀNG & SẢN XUẤT

## TECH STACK

### Core Technologies
- **Framework**: Next.js 15.2.3 (App Router)
- **React**: 19.0.0
- **Language**: TypeScript 5+
- **Styling**: TailwindCSS 4.0 + @tailwindcss/forms

### State Management & Data Fetching
- **State Management**: Zustand (global state)
- **Form Handling**: React Hook Form + Zod (validation)
- **HTTP Client**: Axios + Axios Interceptors
- **Server State**: TanStack Query (React Query) - recommended
- **Real-time**: Socket.io Client

### Additional Libraries (Already Available)
- **Charts**: ApexCharts + react-apexcharts
- **Calendar**: @fullcalendar/react
- **Date Picker**: flatpickr
- **Maps**: @react-jvectormap
- **File Upload**: react-dropzone
- **Drag & Drop**: react-dnd + react-dnd-html5-backend

### Additional Libraries (To Install)
- **Data Tables**: @tanstack/react-table
- **Notifications**: react-hot-toast / sonner
- **Icons**: lucide-react / @heroicons/react
- **PDF Export**: jsPDF / react-pdf
- **Excel Export**: xlsx
- **Currency Format**: dinero.js
- **Date Utils**: date-fns
- **Image Optimization**: next/image (built-in)

---

## PHASE 0: SETUP & FOUNDATION (Week 1)

### 0.1. Project Structure Reorganization

**Priority: CRITICAL**

**Tasks:**

- [ ] Cài đặt dependencies mới:
  ```bash
  npm install zustand axios @tanstack/react-query @tanstack/react-table
  npm install react-hook-form @hookform/resolvers zod
  npm install socket.io-client react-hot-toast lucide-react
  npm install date-fns dinero.js xlsx jspdf
  npm install -D @types/node
  ```

- [ ] Tạo cấu trúc thư mục mới:
  ```
  frontend/
  ├── src/
  │   ├── app/                      # Next.js App Router
  │   │   ├── (admin)/              # Layout admin (có sidebar)
  │   │   │   ├── dashboard/
  │   │   │   ├── products/
  │   │   │   ├── inventory/
  │   │   │   ├── warehouses/
  │   │   │   ├── production/
  │   │   │   ├── sales/
  │   │   │   ├── customers/
  │   │   │   ├── finance/
  │   │   │   ├── users/
  │   │   │   ├── reports/
  │   │   │   └── settings/
  │   │   ├── (auth)/               # Layout auth (full width)
  │   │   │   ├── login/
  │   │   │   └── forgot-password/
  │   │   └── layout.tsx
  │   │
  │   ├── components/               # Shared components
  │   │   ├── ui/                   # Base UI components
  │   │   │   ├── button/
  │   │   │   ├── input/
  │   │   │   ├── modal/
  │   │   │   ├── table/
  │   │   │   ├── card/
  │   │   │   ├── badge/
  │   │   │   ├── alert/
  │   │   │   ├── dropdown/
  │   │   │   ├── tabs/
  │   │   │   └── loading/
  │   │   ├── form/                 # Form components
  │   │   │   ├── FormInput.tsx
  │   │   │   ├── FormSelect.tsx
  │   │   │   ├── FormTextarea.tsx
  │   │   │   ├── FormCheckbox.tsx
  │   │   │   ├── FormRadio.tsx
  │   │   │   ├── FormDatePicker.tsx
  │   │   │   ├── FormImageUpload.tsx
  │   │   │   └── FormMultiSelect.tsx
  │   │   ├── layout/               # Layout components
  │   │   │   ├── Sidebar.tsx
  │   │   │   ├── Header.tsx
  │   │   │   ├── Footer.tsx
  │   │   │   └── Breadcrumb.tsx
  │   │   ├── charts/               # Chart components
  │   │   │   ├── LineChart.tsx
  │   │   │   ├── BarChart.tsx
  │   │   │   ├── PieChart.tsx
  │   │   │   └── AreaChart.tsx
  │   │   └── features/             # Feature-specific components
  │   │       ├── products/
  │   │       ├── inventory/
  │   │       ├── sales/
  │   │       ├── production/
  │   │       └── customers/
  │   │
  │   ├── lib/                      # Libraries & utilities
  │   │   ├── axios.ts              # Axios config
  │   │   ├── socket.ts             # Socket.io config
  │   │   ├── queryClient.ts        # React Query config
  │   │   ├── utils.ts              # Utility functions
  │   │   ├── constants.ts          # Constants
  │   │   └── validations/          # Zod schemas
  │   │       ├── auth.schema.ts
  │   │       ├── product.schema.ts
  │   │       ├── customer.schema.ts
  │   │       └── sales.schema.ts
  │   │
  │   ├── stores/                   # Zustand stores
  │   │   ├── authStore.ts
  │   │   ├── uiStore.ts
  │   │   ├── cartStore.ts
  │   │   └── notificationStore.ts
  │   │
  │   ├── hooks/                    # Custom hooks
  │   │   ├── useAuth.ts
  │   │   ├── useDebounce.ts
  │   │   ├── useLocalStorage.ts
  │   │   ├── usePermissions.ts
  │   │   ├── useTableFilters.ts
  │   │   └── api/                  # React Query hooks
  │   │       ├── useProducts.ts
  │   │       ├── useInventory.ts
  │   │       ├── useSales.ts
  │   │       └── useCustomers.ts
  │   │
  │   ├── types/                    # TypeScript types
  │   │   ├── api.types.ts
  │   │   ├── product.types.ts
  │   │   ├── inventory.types.ts
  │   │   ├── sales.types.ts
  │   │   ├── customer.types.ts
  │   │   ├── user.types.ts
  │   │   └── common.types.ts
  │   │
  │   └── middleware.ts             # Next.js middleware (auth)
  ```

**Deliverables:**
- Cấu trúc thư mục hoàn chỉnh
- Dependencies đã cài đặt
- TypeScript config phù hợp

---

### 0.2. Core Configuration

**Priority: CRITICAL**

**Tasks:**

- [ ] **Axios Configuration** (`src/lib/axios.ts`):
  ```typescript
  import axios from 'axios';
  import { useAuthStore } from '@/stores/authStore';

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 - Token expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = useAuthStore.getState().refreshToken;
          const { data } = await axios.post('/api/auth/refresh-token', {
            refreshToken,
          });

          useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  export default api;
  ```

- [ ] **React Query Configuration** (`src/lib/queryClient.ts`):
  ```typescript
  import { QueryClient } from '@tanstack/react-query';

  export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      mutations: {
        retry: 0,
      },
    },
  });
  ```

- [ ] **Socket.io Configuration** (`src/lib/socket.ts`):
  ```typescript
  import { io, Socket } from 'socket.io-client';
  import { useAuthStore } from '@/stores/authStore';

  let socket: Socket | null = null;

  export const initSocket = () => {
    const token = useAuthStore.getState().token;

    socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return socket;
  };

  export const getSocket = () => socket;

  export const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };
  ```

- [ ] **Environment Variables** (`.env.local`):
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:3000/api
  NEXT_PUBLIC_WS_URL=http://localhost:3000
  NEXT_PUBLIC_APP_NAME=Quản Lý Bán Hàng & Sản Xuất
  ```

**Deliverables:**
- Axios config với interceptors
- React Query setup
- Socket.io config
- Environment variables

---

### 0.3. Base UI Components

**Priority: HIGH**

**Tasks:**

- [ ] **Button Component** (`src/components/ui/button/Button.tsx`):
  ```typescript
  import { ButtonHTMLAttributes, forwardRef } from 'react';
  import { cn } from '@/lib/utils';

  interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
  }

  const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
      const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

      const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'hover:bg-gray-100 focus:ring-gray-500',
        outline: 'border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
      };

      const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      };

      return (
        <button
          ref={ref}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading && (
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {children}
        </button>
      );
    }
  );

  Button.displayName = 'Button';
  export default Button;
  ```

- [ ] **Modal Component** (`src/components/ui/modal/Modal.tsx`)
- [ ] **Table Component** (`src/components/ui/table/DataTable.tsx`) - Sử dụng @tanstack/react-table
- [ ] **Card Component** (`src/components/ui/card/Card.tsx`)
- [ ] **Badge Component** (`src/components/ui/badge/Badge.tsx`)
- [ ] **Alert Component** (`src/components/ui/alert/Alert.tsx`)
- [ ] **Loading Component** (`src/components/ui/loading/Loading.tsx`)
- [ ] **Pagination Component** (`src/components/ui/pagination/Pagination.tsx`)

**Deliverables:**
- Tất cả base UI components
- Storybook (optional)

---

### 0.4. Zustand Stores

**Priority: CRITICAL**

**Tasks:**

- [ ] **Auth Store** (`src/stores/authStore.ts`):
  ```typescript
  import { create } from 'zustand';
  import { persist } from 'zustand/middleware';

  interface User {
    id: number;
    email: string;
    full_name: string;
    role: {
      id: number;
      role_name: string;
      permissions: string[];
    };
    warehouse_id?: number;
  }

  interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    setUser: (user: User) => void;
    setTokens: (token: string, refreshToken: string) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
  }

  export const useAuthStore = create<AuthState>()(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,

        setUser: (user) => set({ user, isAuthenticated: true }),

        setTokens: (token, refreshToken) => set({ token, refreshToken }),

        logout: () => set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false
        }),

        hasPermission: (permission) => {
          const { user } = get();
          return user?.role?.permissions?.includes(permission) || false;
        },
      }),
      {
        name: 'auth-storage',
      }
    )
  );
  ```

- [ ] **UI Store** (`src/stores/uiStore.ts`):
  ```typescript
  import { create } from 'zustand';

  interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';

    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleTheme: () => void;
  }

  export const useUIStore = create<UIState>()((set) => ({
    sidebarOpen: true,
    theme: 'light',

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleTheme: () => set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light'
    })),
  }));
  ```

- [ ] **Notification Store** (`src/stores/notificationStore.ts`) - Quản lý real-time notifications
- [ ] **Cart Store** (nếu cần) - Cho tính năng tạo đơn hàng

**Deliverables:**
- Auth store hoàn chỉnh
- UI store
- Notification store

---

### 0.5. TypeScript Types

**Priority: HIGH**

**Tasks:**

- [ ] **Common Types** (`src/types/common.types.ts`):
  ```typescript
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    meta?: PaginationMeta;
  }

  export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }

  export interface ApiError {
    success: false;
    error: {
      code: string;
      message: string;
      details?: any;
    };
  }

  export type Status = 'active' | 'inactive';
  export type UserStatus = 'active' | 'inactive' | 'locked';
  ```

- [ ] **Product Types** (`src/types/product.types.ts`)
- [ ] **Inventory Types** (`src/types/inventory.types.ts`)
- [ ] **Sales Types** (`src/types/sales.types.ts`)
- [ ] **Customer Types** (`src/types/customer.types.ts`)
- [ ] **User Types** (`src/types/user.types.ts`)

**Deliverables:**
- Tất cả TypeScript types tương ứng với backend models

---

## PHASE 1: AUTHENTICATION (Week 2)

### 1.1. Authentication Pages

**Priority: CRITICAL**

**Endpoints Used:**
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
```

**Tasks:**

- [ ] **Login Page** (`app/(auth)/login/page.tsx`):
  - Form với email + password
  - Validation với Zod
  - Remember me checkbox
  - Forgot password link
  - Error handling
  - Loading state
  - Redirect sau khi login thành công

- [ ] **Forgot Password Page** (`app/(auth)/forgot-password/page.tsx`)

- [ ] **Reset Password Page** (`app/(auth)/reset-password/page.tsx`)

- [ ] **Login Hook** (`src/hooks/api/useAuth.ts`):
  ```typescript
  import { useMutation } from '@tanstack/react-query';
  import api from '@/lib/axios';
  import { useAuthStore } from '@/stores/authStore';
  import { toast } from 'react-hot-toast';

  interface LoginCredentials {
    email: string;
    password: string;
  }

  export const useLogin = () => {
    const { setUser, setTokens } = useAuthStore();

    return useMutation({
      mutationFn: async (credentials: LoginCredentials) => {
        const response = await api.post('/auth/login', credentials);
        return response;
      },
      onSuccess: (data) => {
        setTokens(data.accessToken, data.refreshToken);
        setUser(data.user);
        toast.success('Đăng nhập thành công!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
      },
    });
  };

  export const useLogout = () => {
    const { logout } = useAuthStore();

    return useMutation({
      mutationFn: async () => {
        await api.post('/auth/logout');
      },
      onSuccess: () => {
        logout();
        toast.success('Đăng xuất thành công!');
      },
    });
  };
  ```

- [ ] **Auth Middleware** (`src/middleware.ts`):
  ```typescript
  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';

  export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith('/login');

    if (!token && !isAuthPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  }

  export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  };
  ```

**Deliverables:**
- Login page hoàn chỉnh
- Forgot password flow
- Auth middleware
- Auth hooks

---

### 1.2. Protected Routes & Permissions

**Priority: CRITICAL**

**Tasks:**

- [ ] **Permission Hook** (`src/hooks/usePermissions.ts`):
  ```typescript
  import { useAuthStore } from '@/stores/authStore';

  export const usePermissions = () => {
    const { hasPermission, user } = useAuthStore();

    return {
      canView: (module: string) => hasPermission(`view_${module}`),
      canCreate: (module: string) => hasPermission(`create_${module}`),
      canUpdate: (module: string) => hasPermission(`update_${module}`),
      canDelete: (module: string) => hasPermission(`delete_${module}`),
      canApprove: (module: string) => hasPermission(`approve_${module}`),
      isAdmin: () => user?.role?.role_name === 'admin',
    };
  };
  ```

- [ ] **ProtectedRoute Component** (`src/components/auth/ProtectedRoute.tsx`)

- [ ] **Can Component** (Conditional rendering based on permissions):
  ```typescript
  interface CanProps {
    permission: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }

  export const Can: React.FC<CanProps> = ({ permission, children, fallback = null }) => {
    const { hasPermission } = useAuthStore();

    if (!hasPermission(permission)) {
      return <>{fallback}</>;
    }

    return <>{children}</>;
  };
  ```

**Deliverables:**
- Permission system hoàn chỉnh
- Protected routes
- Conditional rendering components

---

## PHASE 2: DASHBOARD (Week 3)

### 2.1. Main Dashboard

**Priority: HIGH**

**Endpoints Used:**
```
GET    /api/reports/dashboard
GET    /api/reports/revenue
GET    /api/inventory/alerts
GET    /api/sales-orders/revenue
```

**Tasks:**

- [ ] **Dashboard Page** (`app/(admin)/dashboard/page.tsx`):

  **Metrics Cards:**
  - Doanh thu hôm nay/tuần/tháng
  - Số đơn hàng mới
  - Tổng tồn kho
  - Công nợ phải thu

  **Charts:**
  - Biểu đồ doanh thu theo ngày (Line Chart)
  - Top sản phẩm bán chạy (Bar Chart)
  - Phân bố đơn hàng theo kênh (Pie Chart)
  - Tồn kho theo loại (Bar Chart)

  **Tables:**
  - Đơn hàng mới nhất
  - Sản phẩm sắp hết hàng
  - Công nợ quá hạn

- [ ] **Dashboard Hook** (`src/hooks/api/useDashboard.ts`):
  ```typescript
  import { useQuery } from '@tanstack/react-query';
  import api from '@/lib/axios';

  export const useDashboardMetrics = () => {
    return useQuery({
      queryKey: ['dashboard', 'metrics'],
      queryFn: async () => {
        const response = await api.get('/reports/dashboard');
        return response.data;
      },
      refetchInterval: 60000, // Refetch every 1 minute
    });
  };

  export const useRevenueChart = (period: 'day' | 'week' | 'month') => {
    return useQuery({
      queryKey: ['dashboard', 'revenue', period],
      queryFn: async () => {
        const response = await api.get(`/reports/revenue?period=${period}`);
        return response.data;
      },
    });
  };
  ```

- [ ] **Metric Card Component** (`src/components/dashboard/MetricCard.tsx`)
- [ ] **Revenue Chart Component** (`src/components/dashboard/RevenueChart.tsx`)
- [ ] **Recent Orders Table** (`src/components/dashboard/RecentOrders.tsx`)

**Deliverables:**
- Dashboard tổng quan hoàn chỉnh
- Real-time metrics
- Interactive charts

---

## PHASE 3: WAREHOUSE & INVENTORY MANAGEMENT (Week 4-5)

### 3.1. Warehouses Management

**Priority: HIGH**

**Endpoints:**
```
GET    /api/warehouses
GET    /api/warehouses/:id
POST   /api/warehouses
PUT    /api/warehouses/:id
DELETE /api/warehouses/:id
```

**Pages:**

- [ ] **Warehouses List** (`app/(admin)/warehouses/page.tsx`):
  - Table với pagination, search, filter
  - Filter theo type (nguyên liệu/bao bì/thành phẩm/hàng hóa)
  - Filter theo status
  - Actions: View, Edit, Delete
  - Button "Tạo kho mới"

- [ ] **Warehouse Form** (`app/(admin)/warehouses/create/page.tsx` & `[id]/edit/page.tsx`):
  - Tên kho
  - Loại kho (select)
  - Địa chỉ
  - Quản lý kho (select users)
  - Sức chứa
  - Trạng thái

- [ ] **Warehouse Detail** (`app/(admin)/warehouses/[id]/page.tsx`):
  - Thông tin kho
  - Tồn kho hiện tại
  - Lịch sử nhập/xuất
  - Biểu đồ xu hướng

**Components:**

- [ ] `src/components/features/warehouses/WarehouseTable.tsx`
- [ ] `src/components/features/warehouses/WarehouseForm.tsx`
- [ ] `src/components/features/warehouses/WarehouseCard.tsx`

**Hooks:**

- [ ] `src/hooks/api/useWarehouses.ts`:
  ```typescript
  export const useWarehouses = (filters?: WarehouseFilters) => {
    return useQuery({
      queryKey: ['warehouses', filters],
      queryFn: async () => {
        const response = await api.get('/warehouses', { params: filters });
        return response.data;
      },
    });
  };

  export const useCreateWarehouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: CreateWarehouseDto) => {
        return await api.post('/warehouses', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['warehouses'] });
        toast.success('Tạo kho thành công!');
      },
    });
  };
  ```

**Validation:**

- [ ] `src/lib/validations/warehouse.schema.ts`:
  ```typescript
  import { z } from 'zod';

  export const warehouseSchema = z.object({
    warehouse_name: z.string().min(3, 'Tên kho phải có ít nhất 3 ký tự'),
    warehouse_type: z.enum(['raw_material', 'packaging', 'finished_product', 'goods']),
    address: z.string().optional(),
    city: z.string().optional(),
    manager_id: z.number().optional(),
    capacity: z.number().positive().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
  });

  export type WarehouseFormData = z.infer<typeof warehouseSchema>;
  ```

**Deliverables:**
- Warehouse CRUD hoàn chỉnh
- Filters & search
- Validation

---

### 3.2. Products Management

**Priority: CRITICAL**

**Endpoints:**
```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
POST   /api/products/:id/images
GET    /api/products/low-stock
```

**Pages:**

- [ ] **Products List** (`app/(admin)/products/page.tsx`):
  - Data Table với @tanstack/react-table
  - Columns: Ảnh, SKU, Tên, Loại, Giá, Tồn kho, Trạng thái
  - Multi-filter: Type, Category, Supplier, Status
  - Search: Name, SKU, Barcode
  - Bulk actions: Delete, Update status
  - Export to Excel

- [ ] **Product Form** (`app/(admin)/products/create/page.tsx`):
  - **Thông tin cơ bản**:
    - SKU (auto-generate nếu không nhập)
    - Tên sản phẩm
    - Loại sản phẩm (raw_material/packaging/finished_product/goods)
    - Loại bao bì (nếu type = packaging)
    - Danh mục (select tree)
    - Nhà cung cấp (select)

  - **Thông tin chi tiết**:
    - Đơn vị tính
    - Barcode
    - Trọng lượng
    - Kích thước
    - Mô tả

  - **Giá & Tồn kho**:
    - Giá nhập
    - Giá bán lẻ
    - Giá bán sỉ
    - Giá bán VIP
    - Thuế suất (%)
    - Tồn kho tối thiểu

  - **Hình ảnh**:
    - Upload multiple images (max 5)
    - Drag & drop để sắp xếp
    - Set primary image

- [ ] **Product Detail** (`app/(admin)/products/[id]/page.tsx`):
  - Thông tin sản phẩm
  - Gallery ảnh
  - Tồn kho theo từng kho
  - Lịch sử nhập/xuất
  - Biểu đồ giá & tồn kho

**Components:**

- [ ] `src/components/features/products/ProductTable.tsx`:
  ```typescript
  import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';

  export const ProductTable = ({ data, columns }) => {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

    return (
      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination table={table} />
      </div>
    );
  };
  ```

- [ ] `src/components/features/products/ProductForm.tsx`
- [ ] `src/components/features/products/ProductImageUpload.tsx`
- [ ] `src/components/features/products/ProductFilters.tsx`

**Hooks:**

- [ ] `src/hooks/api/useProducts.ts`
- [ ] `src/hooks/useTableFilters.ts` - Generic hook for table filtering

**Deliverables:**
- Product CRUD hoàn chỉnh
- Image upload & gallery
- Advanced filtering
- Excel export

---

### 3.3. Inventory Management

**Priority: CRITICAL**

**Endpoints:**
```
GET    /api/inventory
GET    /api/inventory/warehouse/:id
GET    /api/inventory/product/:id
GET    /api/inventory/alerts
POST   /api/inventory/check
```

**Pages:**

- [ ] **Inventory Overview** (`app/(admin)/inventory/page.tsx`):
  - Multi-warehouse view
  - Filter theo kho, sản phẩm
  - Show: quantity, reserved_quantity, available_quantity
  - Color coding cho low stock
  - Real-time updates via Socket.io

- [ ] **Inventory by Warehouse** (`app/(admin)/inventory/warehouse/[id]/page.tsx`)

- [ ] **Low Stock Alerts** (`app/(admin)/inventory/alerts/page.tsx`):
  - Danh sách sản phẩm tồn kho thấp
  - Gợi ý số lượng cần nhập
  - Actions: Tạo đơn đặt hàng

**Components:**

- [ ] `src/components/features/inventory/InventoryTable.tsx`
- [ ] `src/components/features/inventory/StockLevelIndicator.tsx`:
  ```typescript
  interface StockLevelProps {
    current: number;
    min: number;
  }

  export const StockLevelIndicator = ({ current, min }: StockLevelProps) => {
    const percentage = (current / min) * 100;

    const getColor = () => {
      if (percentage >= 100) return 'green';
      if (percentage >= 50) return 'yellow';
      return 'red';
    };

    return (
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-${getColor()}-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <span className="text-sm">{current} / {min}</span>
      </div>
    );
  };
  ```

**Real-time Updates:**

- [ ] Socket.io listener for inventory updates:
  ```typescript
  useEffect(() => {
    const socket = getSocket();

    socket?.on('inventory:updated', (data) => {
      queryClient.setQueryData(['inventory'], (old: any) => {
        // Update cache with new inventory data
        return updateInventoryInCache(old, data);
      });
    });

    return () => {
      socket?.off('inventory:updated');
    };
  }, []);
  ```

**Deliverables:**
- Real-time inventory tracking
- Low stock alerts
- Multi-warehouse view

---

### 3.4. Stock Transactions

**Priority: CRITICAL**

**Endpoints:**
```
GET    /api/stock-transactions
POST   /api/stock-transactions/import
POST   /api/stock-transactions/export
POST   /api/stock-transactions/transfer
POST   /api/stock-transactions/disposal
PUT    /api/stock-transactions/:id/approve
```

**Pages:**

- [ ] **Transactions List** (`app/(admin)/inventory/transactions/page.tsx`):
  - Filter theo type, warehouse, date range
  - Show: Code, Type, Warehouse, Total Value, Status, Date
  - Actions: View, Approve, Cancel

- [ ] **Import Form** (`app/(admin)/inventory/transactions/import/page.tsx`):
  - Chọn kho đích
  - Chọn NCC (optional)
  - Thêm sản phẩm (search & select)
  - Nhập số lượng, giá nhập
  - Batch number, expiry date
  - Tính tổng giá trị tự động

- [ ] **Export Form** (`app/(admin)/inventory/transactions/export/page.tsx`):
  - Chọn kho xuất
  - Lý do xuất (bán hàng, sản xuất, hủy)
  - Reference (order_id, production_order_id)
  - Danh sách sản phẩm
  - Check tồn kho trước khi xuất

- [ ] **Transfer Form** (`app/(admin)/inventory/transactions/transfer/page.tsx`):
  - Kho nguồn → Kho đích
  - Lý do chuyển
  - Danh sách sản phẩm
  - Approval workflow

**Components:**

- [ ] `src/components/features/inventory/TransactionForm.tsx`
- [ ] `src/components/features/inventory/ProductSelector.tsx`:
  ```typescript
  // Combobox để search & select products
  // Show: Image, SKU, Name, Available stock
  // Disable nếu out of stock (for export)
  ```

- [ ] `src/components/features/inventory/TransactionItems.tsx`:
  ```typescript
  // Editable table for transaction items
  // Columns: Product, Quantity, Price, Total, Actions
  // Row actions: Edit quantity, Remove
  // Show running total
  ```

**Validation:**

- [ ] Validate tồn kho đủ không (export, transfer)
- [ ] Validate batch numbers
- [ ] Validate expiry dates

**Deliverables:**
- Stock transaction CRUD
- Import/Export/Transfer flows
- Inventory validation

---

## PHASE 4: PRODUCTION MANAGEMENT (Week 6)

### 4.1. BOM (Bill of Materials)

**Priority: HIGH**

**Endpoints:**
```
GET    /api/bom
POST   /api/bom
PUT    /api/bom/:id
PUT    /api/bom/:id/approve
GET    /api/bom/:id/calculate
```

**Pages:**

- [ ] **BOM List** (`app/(admin)/production/bom/page.tsx`):
  - Table: Code, Product, Version, Status
  - Filter: Product, Status
  - Actions: View, Edit, Approve, Clone

- [ ] **BOM Form** (`app/(admin)/production/bom/create/page.tsx`):
  - Chọn sản phẩm thành phẩm
  - Version
  - Output quantity (sản lượng/mẻ)
  - Efficiency rate (%)
  - Production time (phút)

  - **Materials Section**:
    - Add raw materials (search & select)
    - Quantity per batch
    - Unit

  - **Packaging Section**:
    - Add packaging materials
    - Quantity per batch

  - Preview: Tính toán chi phí dự kiến

**Components:**

- [ ] `src/components/features/production/BOMForm.tsx`
- [ ] `src/components/features/production/MaterialsTable.tsx`:
  ```typescript
  interface Material {
    id: number;
    material_id: number;
    material_name: string;
    quantity: number;
    unit: string;
    material_type: 'raw_material' | 'packaging';
  }

  // Editable table for BOM materials
  // Add/Remove materials
  // Edit quantities
  ```

- [ ] `src/components/features/production/BOMCalculator.tsx`:
  ```typescript
  // Input: production_quantity
  // Output: Required materials list với quantities
  ```

**Deliverables:**
- BOM CRUD
- Material calculator
- Version management

---

### 4.2. Production Orders

**Priority: HIGH**

**Endpoints:**
```
GET    /api/production-orders
POST   /api/production-orders
PUT    /api/production-orders/:id/start
PUT    /api/production-orders/:id/complete
GET    /api/production-orders/:id/wastage
```

**Pages:**

- [ ] **Production Orders List** (`app/(admin)/production/orders/page.tsx`):
  - Filter: Status, Date range, Product
  - Show: Code, Product, Planned Qty, Status, Start Date
  - Color coding theo status

- [ ] **Create Production Order** (`app/(admin)/production/orders/create/page.tsx`):
  - Chọn BOM
  - Số lượng cần sản xuất
  - **Material Requirements** (auto-calculated from BOM):
    - Show danh sách NL & bao bì cần
    - Check tồn kho
    - Warning nếu thiếu
  - Ngày bắt đầu - kết thúc
  - Ghi chú

- [ ] **Production Order Detail** (`app/(admin)/production/orders/[id]/page.tsx`):
  - Thông tin lệnh
  - Material requirements vs actual
  - Wastage report
  - Timeline/Progress
  - Actions: Start, Complete, Cancel

**Workflow:**

- [ ] **Start Production**:
  - Popup confirm
  - Auto-create stock transaction (export materials)
  - Update status → in_progress

- [ ] **Complete Production**:
  - Input actual quantity produced
  - Input actual materials used (if different from planned)
  - Calculate wastage
  - Auto-create stock transaction (import finished products)
  - Update status → completed

**Components:**

- [ ] `src/components/features/production/ProductionOrderForm.tsx`
- [ ] `src/components/features/production/MaterialRequirements.tsx`
- [ ] `src/components/features/production/WastageReport.tsx`
- [ ] `src/components/features/production/ProductionTimeline.tsx`

**Deliverables:**
- Production order management
- Material shortage alerts
- Wastage tracking

---

## PHASE 5: CUSTOMER & SALES MANAGEMENT (Week 7-8)

### 5.1. Customers Management

**Priority: HIGH**

**Endpoints:**
```
GET    /api/customers
POST   /api/customers
PUT    /api/customers/:id
GET    /api/customers/:id/orders
GET    /api/customers/:id/debt
PUT    /api/customers/:id/credit-limit
```

**Pages:**

- [ ] **Customers List** (`app/(admin)/customers/page.tsx`):
  - Table: Avatar, Code, Name, Type, Classification, Phone, Debt, Status
  - Filter: Type, Classification, Province
  - Search: Name, Phone, Email
  - Debt indicator (color coding)

- [ ] **Customer Form** (`app/(admin)/customers/create/page.tsx`):
  - Customer type (individual/company)
  - Classification (retail/wholesale/vip/distributor)
  - Thông tin cơ bản: Name, Phone, Email, Address
  - Tax code (for company)
  - Credit limit
  - Avatar upload

- [ ] **Customer Detail** (`app/(admin)/customers/[id]/page.tsx`):
  - Thông tin khách hàng
  - Công nợ hiện tại
  - Credit limit progress bar
  - Lịch sử đơn hàng
  - Lịch sử thanh toán
  - Charts: Doanh số theo tháng

**Components:**

- [ ] `src/components/features/customers/CustomerTable.tsx`
- [ ] `src/components/features/customers/CustomerForm.tsx`
- [ ] `src/components/features/customers/DebtIndicator.tsx`:
  ```typescript
  const DebtIndicator = ({ currentDebt, creditLimit }) => {
    const percentage = (currentDebt / creditLimit) * 100;

    return (
      <div>
        <div className="flex justify-between mb-1">
          <span>Công nợ</span>
          <span>{formatCurrency(currentDebt)} / {formatCurrency(creditLimit)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              percentage >= 100 ? 'bg-red-600' :
              percentage >= 80 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };
  ```

**Deliverables:**
- Customer CRUD
- Debt tracking
- Customer analytics

---

### 5.2. Sales Orders

**Priority: CRITICAL** (Most complex module)

**Endpoints:**
```
GET    /api/sales-orders
POST   /api/sales-orders
PUT    /api/sales-orders/:id/approve
PUT    /api/sales-orders/:id/complete
PUT    /api/sales-orders/:id/cancel
POST   /api/sales-orders/:id/payment
```

**Pages:**

- [ ] **Sales Orders List** (`app/(admin)/sales/orders/page.tsx`):
  - Filter: Status, Payment Status, Date range, Customer
  - Search: Order code
  - Color coding: Order status, Payment status
  - Quick actions: View, Approve, Print

- [ ] **Create Sales Order** (`app/(admin)/sales/orders/create/page.tsx`):

  **Step 1: Customer Selection**
  - Search & select customer
  - Show customer debt status
  - Warning nếu vượt credit limit

  **Step 2: Order Items**
  - Chọn kho xuất
  - Search & add products (chỉ từ kho thành phẩm/hàng hóa)
  - Giá bán theo customer classification (lẻ/sỉ/VIP)
  - Check tồn kho available
  - Apply promotions tự động
  - Editable table: Product, Qty, Price, Discount, Tax, Total

  **Step 3: Order Details**
  - Sales channel
  - Delivery address
  - Shipping fee
  - Payment method
  - Ghi chú

  **Summary Panel (sticky sidebar)**:
  - Tổng tiền hàng
  - Giảm giá
  - Thuế
  - Phí vận chuyển
  - **Tổng thanh toán**
  - Payment method selection
  - Số tiền trả trước (if credit)

**Complex Logic:**

- [ ] **Credit Validation**:
  ```typescript
  const validateCredit = (customer, orderTotal) => {
    const availableCredit = customer.credit_limit - customer.current_debt;

    if (orderTotal > availableCredit) {
      return {
        allowed: false,
        message: `Vượt hạn mức công nợ. Còn lại: ${formatCurrency(availableCredit)}`,
      };
    }

    return { allowed: true };
  };
  ```

- [ ] **Inventory Reservation**:
  ```typescript
  // Reserve inventory khi tạo đơn
  // Release khi cancel
  // Convert to actual stock decrease khi approve
  ```

- [ ] **Price Calculation**:
  ```typescript
  const calculatePrice = (product, customer) => {
    const basePrice = getBasePrice(product, customer.classification);
    const promotionDiscount = calculatePromotion(product);
    const taxAmount = (basePrice - promotionDiscount) * product.tax_rate / 100;

    return {
      basePrice,
      discount: promotionDiscount,
      tax: taxAmount,
      total: basePrice - promotionDiscount + taxAmount,
    };
  };
  ```

- [ ] **Sales Order Detail** (`app/(admin)/sales/orders/[id]/page.tsx`):
  - Order info
  - Customer info
  - Order items table
  - Payment history
  - Delivery status
  - Timeline
  - Actions: Approve, Cancel, Print, Add payment

**Components:**

- [ ] `src/components/features/sales/SalesOrderForm.tsx` - Multi-step wizard
- [ ] `src/components/features/sales/CustomerSelector.tsx`
- [ ] `src/components/features/sales/ProductCart.tsx`:
  ```typescript
  // Shopping cart style
  // Add/Remove products
  // Edit quantities (with stock validation)
  // Show running total
  ```

- [ ] `src/components/features/sales/OrderSummary.tsx` - Sticky summary panel
- [ ] `src/components/features/sales/PaymentForm.tsx`
- [ ] `src/components/features/sales/OrderTimeline.tsx`

**Hooks:**

- [ ] `src/hooks/api/useSalesOrders.ts`
- [ ] `src/hooks/useOrderCart.ts`:
  ```typescript
  // Local state management for cart
  // Add/remove items
  // Update quantities
  // Calculate totals
  // Validate stock
  ```

**Deliverables:**
- Sales order creation flow (complex)
- Credit validation
- Inventory reservation
- Payment tracking
- Order approval workflow

---

### 5.3. Deliveries

**Priority: MEDIUM**

**Endpoints:**
```
GET    /api/deliveries
POST   /api/deliveries
PUT    /api/deliveries/:id/status
POST   /api/deliveries/:id/proof
```

**Pages:**

- [ ] **Deliveries List** (`app/(admin)/sales/deliveries/page.tsx`):
  - Filter: Status, Delivery staff, Date
  - Map view (optional)
  - Actions: Update status, Upload proof

- [ ] **Delivery Detail** (`app/(admin)/sales/deliveries/[id]/page.tsx`):
  - Order info
  - Customer info & address
  - Delivery staff
  - Status timeline
  - COD amount
  - Upload proof image
  - Mark as delivered/failed

**Components:**

- [ ] `src/components/features/sales/DeliveryStatus.tsx`
- [ ] `src/components/features/sales/ProofUpload.tsx`

**Deliverables:**
- Delivery tracking
- Status updates
- Proof of delivery

---

## PHASE 6: FINANCIAL MANAGEMENT (Week 9)

### 6.1. Payment Receipts (Phiếu thu)

**Priority: HIGH**

**Endpoints:**
```
GET    /api/payment-receipts
POST   /api/payment-receipts
PUT    /api/payment-receipts/:id/approve
```

**Pages:**

- [ ] **Receipts List** (`app/(admin)/finance/receipts/page.tsx`)

- [ ] **Create Receipt** (`app/(admin)/finance/receipts/create/page.tsx`):
  - Receipt type
  - Customer (search & select)
  - Related order (optional)
  - Amount
  - Payment method
  - Bank info (if transfer)
  - Receipt date
  - Notes

**Workflow:**

- Khi approve → Tự động update customer debt
- Khi approve → Update order paid_amount

**Deliverables:**
- Receipt CRUD
- Auto debt update
- PDF generation

---

### 6.2. Payment Vouchers (Phiếu chi)

**Priority: HIGH**

**Endpoints:**
```
GET    /api/payment-vouchers
POST   /api/payment-vouchers
PUT    /api/payment-vouchers/:id/approve
```

**Pages:**

- [ ] **Vouchers List** (`app/(admin)/finance/vouchers/page.tsx`)

- [ ] **Create Voucher** (`app/(admin)/finance/vouchers/create/page.tsx`):
  - Voucher type
  - Supplier/Employee (conditional)
  - Amount
  - Payment method
  - Expense account
  - Notes

**Deliverables:**
- Voucher CRUD
- Approval workflow

---

### 6.3. Debt Reconciliation

**Priority: MEDIUM**

**Endpoints:**
```
GET    /api/debt-reconciliation
POST   /api/debt-reconciliation/monthly
POST   /api/debt-reconciliation/quarterly
GET    /api/debt-reconciliation/:id/pdf
POST   /api/debt-reconciliation/:id/send-email
```

**Pages:**

- [ ] **Reconciliation List** (`app/(admin)/finance/debt-reconciliation/page.tsx`)

- [ ] **Create Reconciliation** (`app/(admin)/finance/debt-reconciliation/create/page.tsx`):
  - Type (monthly/quarterly/yearly)
  - Period
  - Customer/Supplier
  - Auto-calculate:
    - Opening balance
    - Transactions amount
    - Payment amount
    - Closing balance
  - Export PDF
  - Send email

**Components:**

- [ ] `src/components/features/finance/ReconciliationForm.tsx`
- [ ] `src/components/features/finance/ReconciliationPDF.tsx`

**Deliverables:**
- Debt reconciliation
- Auto-calculation
- PDF export
- Email notification

---

## PHASE 7: PROMOTION MANAGEMENT (Week 10)

### 7.1. Promotions

**Priority: MEDIUM**

**Endpoints:**
```
GET    /api/promotions
POST   /api/promotions
PUT    /api/promotions/:id
PUT    /api/promotions/:id/approve
GET    /api/promotions/active
```

**Pages:**

- [ ] **Promotions List** (`app/(admin)/promotions/page.tsx`):
  - Filter: Type, Status, Date range
  - Show: Name, Type, Discount, Dates, Status

- [ ] **Promotion Form** (`app/(admin)/promotions/create/page.tsx`):
  - Promotion type:
    - Percent discount
    - Fixed discount
    - Buy X get Y
    - Gift

  - Basic info:
    - Name, Code
    - Start date - End date
    - Is recurring

  - Conditions (JSON):
    - Min order value
    - Applicable categories/products
    - Customer types
    - Days of week
    - Time slots

  - Discount value
  - Max discount value (for %)
  - Quantity limit

  - Products:
    - Add applicable products
    - Gift products (if type = buy_x_get_y or gift)

**Components:**

- [ ] `src/components/features/promotions/PromotionForm.tsx`
- [ ] `src/components/features/promotions/ConditionBuilder.tsx`:
  ```typescript
  // Dynamic form builder for promotion conditions
  // JSON editor with validation
  ```

**Deliverables:**
- Promotion CRUD
- Complex condition builder
- Auto-apply in sales orders

---

## PHASE 8: USER & HR MANAGEMENT (Week 11)

### 8.1. User Management

**Priority: HIGH**

**Endpoints:**
```
GET    /api/users
POST   /api/users
PUT    /api/users/:id
PATCH  /api/users/:id/status
POST   /api/users/:id/avatar
```

**Pages:**

- [ ] **Users List** (`app/(admin)/users/page.tsx`):
  - Filter: Role, Warehouse, Status
  - Actions: Edit, Lock/Unlock, Delete

- [ ] **User Form** (`app/(admin)/users/create/page.tsx`):
  - Employee code
  - Email, Password
  - Full name, Phone
  - Role (select)
  - Warehouse (select - nếu role = warehouse staff)
  - Avatar upload
  - Status

**Deliverables:**
- User CRUD
- Role assignment
- Avatar upload

---

### 8.2. Attendance

**Priority: MEDIUM**

**Endpoints:**
```
GET    /api/attendance
POST   /api/attendance/check-in
POST   /api/attendance/check-out
GET    /api/attendance/report
```

**Pages:**

- [ ] **Attendance List** (`app/(admin)/hr/attendance/page.tsx`):
  - Calendar view
  - Filter: User, Date range
  - Show: Check-in/out time, Work hours, Status

- [ ] **Check In/Out** (Widget trên header):
  - Button check-in/out
  - Show current time
  - GPS location (optional)

**Deliverables:**
- Attendance tracking
- Calendar view
- Check-in/out widget

---

### 8.3. Salary

**Priority: MEDIUM**

**Endpoints:**
```
GET    /api/salary
POST   /api/salary/calculate
PUT    /api/salary/:id/approve
POST   /api/salary/:id/pay
```

**Pages:**

- [ ] **Salary List** (`app/(admin)/hr/salary/page.tsx`)

- [ ] **Calculate Salary** (`app/(admin)/hr/salary/calculate/page.tsx`):
  - Select month
  - Select users
  - Auto-calculate:
    - Basic salary
    - Overtime pay
    - Commission
    - Deductions
    - Total
  - Preview before approve

**Deliverables:**
- Salary calculation
- Salary slip PDF

---

## PHASE 9: NOTIFICATION & REPORTING (Week 12)

### 9.1. Real-time Notifications

**Priority: HIGH**

**Endpoints:**
```
GET    /api/notifications
PUT    /api/notifications/:id/read
DELETE /api/notifications/:id
```

**Components:**

- [ ] **Notification Bell** (Header):
  ```typescript
  const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
      const socket = getSocket();

      socket?.on('notification', (data) => {
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast(data.message, { icon: getNotificationIcon(data.type) });
      });

      return () => socket?.off('notification');
    }, []);

    return (
      <div className="relative">
        <button className="relative">
          <BellIcon />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5">
              {unreadCount}
            </span>
          )}
        </button>
        {/* Notification dropdown */}
      </div>
    );
  };
  ```

- [ ] **Notification Dropdown**:
  - List recent notifications
  - Mark as read
  - Link to related page
  - "View all" button

- [ ] **Notification Types**:
  - Low stock alert
  - Expiring products
  - Debt overdue
  - New order
  - Approval required
  - System announcements

**Deliverables:**
- Real-time notifications
- Notification bell with badge
- Toast notifications

---

### 9.2. Reports & Analytics

**Priority: HIGH**

**Endpoints:**
```
GET    /api/reports/revenue
GET    /api/reports/inventory
GET    /api/reports/sales-by-product
GET    /api/reports/production
GET    /api/reports/financial
GET    /api/reports/export/:type
```

**Pages:**

- [ ] **Revenue Report** (`app/(admin)/reports/revenue/page.tsx`):
  - Date range picker
  - Chart: Revenue over time
  - Breakdown by channel, region, product
  - Export to Excel/PDF

- [ ] **Inventory Report** (`app/(admin)/reports/inventory/page.tsx`):
  - Tồn kho theo warehouse
  - Tồn kho theo category
  - Inventory turnover rate
  - Slow-moving products
  - Export to Excel

- [ ] **Sales Report** (`app/(admin)/reports/sales/page.tsx`):
  - Top products
  - Top customers
  - Sales by employee
  - Conversion rate
  - Export to Excel

- [ ] **Production Report** (`app/(admin)/reports/production/page.tsx`):
  - Production output
  - Material consumption
  - Wastage analysis
  - Export to Excel

- [ ] **Financial Report** (`app/(admin)/reports/financial/page.tsx`):
  - P&L statement
  - Cash flow
  - Debt aging
  - Export to Excel/PDF

**Components:**

- [ ] `src/components/features/reports/ReportFilters.tsx`
- [ ] `src/components/features/reports/ExportButton.tsx`:
  ```typescript
  const ExportButton = ({ type, data, filename }) => {
    const exportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      XLSX.writeFile(wb, `${filename}.xlsx`);
    };

    const exportToPDF = () => {
      const doc = new jsPDF();
      // Generate PDF content
      doc.save(`${filename}.pdf`);
    };

    return (
      <div className="flex gap-2">
        <Button onClick={exportToExcel}>Excel</Button>
        <Button onClick={exportToPDF}>PDF</Button>
      </div>
    );
  };
  ```

**Deliverables:**
- Comprehensive reports
- Interactive charts
- Excel/PDF export

---

## PHASE 10: OPTIMIZATION & POLISH (Week 13)

### 10.1. Performance Optimization

**Priority: HIGH**

**Tasks:**

- [ ] **Code Splitting**:
  ```typescript
  // Dynamic imports for heavy components
  const ChartComponent = dynamic(() => import('@/components/charts/LineChart'), {
    loading: () => <Spinner />,
    ssr: false,
  });
  ```

- [ ] **Image Optimization**:
  - Use Next.js Image component
  - Lazy loading
  - WebP format
  - Responsive images

- [ ] **React Query Optimization**:
  ```typescript
  // Prefetch data
  const prefetchProducts = () => {
    queryClient.prefetchQuery({
      queryKey: ['products'],
      queryFn: fetchProducts,
    });
  };

  // Optimistic updates
  const updateProduct = useMutation({
    mutationFn: updateProductApi,
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData(['products']);

      queryClient.setQueryData(['products'], (old) => {
        return old.map(p => p.id === newProduct.id ? newProduct : p);
      });

      return { previousProducts };
    },
    onError: (err, newProduct, context) => {
      queryClient.setQueryData(['products'], context.previousProducts);
    },
  });
  ```

- [ ] **Debounce Search**:
  ```typescript
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  };
  ```

- [ ] **Virtualization** (cho long lists):
  ```typescript
  import { useVirtualizer } from '@tanstack/react-virtual';

  const VirtualList = ({ items }) => {
    const parentRef = useRef();

    const virtualizer = useVirtualizer({
      count: items.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 50,
    });

    return (
      <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
        <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div key={virtualRow.index}>
              {items[virtualRow.index]}
            </div>
          ))}
        </div>
      </div>
    );
  };
  ```

**Deliverables:**
- Optimized bundle size
- Fast page loads
- Smooth interactions

---

### 10.2. Error Handling & Loading States

**Priority: HIGH**

**Tasks:**

- [ ] **Error Boundaries**:
  ```typescript
  // app/error.tsx
  'use client';

  export default function Error({ error, reset }) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2>Có lỗi xảy ra!</h2>
        <p>{error.message}</p>
        <button onClick={reset}>Thử lại</button>
      </div>
    );
  }
  ```

- [ ] **Loading States**:
  ```typescript
  // app/loading.tsx
  export default function Loading() {
    return <Spinner />;
  }
  ```

- [ ] **Skeleton Screens**:
  ```typescript
  const ProductSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded mt-2" />
      <div className="h-4 bg-gray-300 rounded mt-2 w-1/2" />
    </div>
  );
  ```

- [ ] **Toast Notifications**:
  ```typescript
  import { toast } from 'react-hot-toast';

  toast.success('Thành công!');
  toast.error('Có lỗi xảy ra!');
  toast.loading('Đang xử lý...');
  ```

**Deliverables:**
- Graceful error handling
- Loading indicators
- User feedback

---

### 10.3. Accessibility & SEO

**Priority: MEDIUM**

**Tasks:**

- [ ] **Accessibility**:
  - Semantic HTML
  - ARIA labels
  - Keyboard navigation
  - Focus management
  - Color contrast

- [ ] **SEO**:
  ```typescript
  // app/products/[id]/page.tsx
  export async function generateMetadata({ params }) {
    const product = await getProduct(params.id);

    return {
      title: product.product_name,
      description: product.description,
      openGraph: {
        images: [product.image_url],
      },
    };
  }
  ```

**Deliverables:**
- WCAG compliant
- SEO optimized

---

### 10.4. Testing (Optional but Recommended)

**Priority: MEDIUM**

**Tasks:**

- [ ] **Unit Tests** (Jest + React Testing Library):
  ```bash
  npm install -D jest @testing-library/react @testing-library/jest-dom
  ```

- [ ] **E2E Tests** (Playwright):
  ```bash
  npm install -D @playwright/test
  ```

- [ ] Test critical flows:
  - Login/Logout
  - Create sales order
  - Create production order
  - Inventory transactions

**Deliverables:**
- Test coverage > 50% (critical paths)

---

## PHASE 11: DEPLOYMENT (Week 14)

### 11.1. Build Configuration

**Priority: CRITICAL**

**Tasks:**

- [ ] **Environment Variables**:
  ```env
  # .env.production
  NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
  NEXT_PUBLIC_WS_URL=https://api.yourdomain.com
  ```

- [ ] **next.config.ts**:
  ```typescript
  const nextConfig = {
    images: {
      domains: ['yourdomain.com', 's3.amazonaws.com'],
    },
    output: 'standalone', // For Docker
    reactStrictMode: true,
    swcMinify: true,
  };
  ```

- [ ] **Build & Test**:
  ```bash
  npm run build
  npm run start
  ```

**Deliverables:**
- Production build config
- Environment setup

---

### 11.2. Docker Setup

**Priority: HIGH**

**Tasks:**

- [ ] **Dockerfile**:
  ```dockerfile
  FROM node:18-alpine AS base

  # Dependencies
  FROM base AS deps
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production

  # Builder
  FROM base AS builder
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  RUN npm run build

  # Runner
  FROM base AS runner
  WORKDIR /app
  ENV NODE_ENV production

  COPY --from=builder /app/public ./public
  COPY --from=builder /app/.next/standalone ./
  COPY --from=builder /app/.next/static ./.next/static

  EXPOSE 3000
  CMD ["node", "server.js"]
  ```

- [ ] **docker-compose.yml**:
  ```yaml
  version: '3.8'

  services:
    frontend:
      build: .
      ports:
        - '3000:3000'
      environment:
        - NEXT_PUBLIC_API_URL=http://backend:3000/api
        - NEXT_PUBLIC_WS_URL=http://backend:3000
      depends_on:
        - backend
      restart: unless-stopped

    nginx:
      image: nginx:alpine
      ports:
        - '80:80'
        - '443:443'
      volumes:
        - ./nginx.conf:/etc/nginx/nginx.conf
        - ./ssl:/etc/nginx/ssl
      depends_on:
        - frontend
  ```

**Deliverables:**
- Dockerfile
- docker-compose setup

---

### 11.3. Deployment to Production

**Priority: HIGH**

**Options:**

1. **Vercel** (Easiest):
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **VPS/Cloud** (AWS EC2, DigitalOcean):
   - Setup server
   - Install Docker
   - Clone repo
   - Run docker-compose
   - Setup Nginx reverse proxy
   - Setup SSL (Let's Encrypt)

3. **Kubernetes** (For scale)

**Deliverables:**
- Production deployment
- SSL certificates
- Monitoring setup

---

## SUCCESS METRICS

### Performance Targets
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 90
- [ ] Bundle size < 500KB (initial)

### Code Quality
- [ ] TypeScript strict mode
- [ ] ESLint no errors
- [ ] All forms validated with Zod
- [ ] All API calls error handled

### Features
- [ ] 100+ pages/components
- [ ] 150+ API integrations
- [ ] Real-time updates (Socket.io)
- [ ] Role-based access control
- [ ] Multi-language support (optional)

---

## TIMELINE SUMMARY

| Phase | Duration | Priority | Dependencies |
|-------|----------|----------|--------------|
| 0. Setup & Foundation | 1 week | CRITICAL | - |
| 1. Authentication | 1 week | CRITICAL | Phase 0 |
| 2. Dashboard | 1 week | HIGH | Phase 1 |
| 3. Warehouse & Inventory | 2 weeks | CRITICAL | Phase 1 |
| 4. Production | 1 week | HIGH | Phase 3 |
| 5. Customer & Sales | 2 weeks | CRITICAL | Phase 3 |
| 6. Financial | 1 week | HIGH | Phase 5 |
| 7. Promotion | 1 week | MEDIUM | Phase 5 |
| 8. User & HR | 1 week | MEDIUM | Phase 1 |
| 9. Notification & Reports | 1 week | HIGH | All phases |
| 10. Optimization | 1 week | HIGH | All phases |
| 11. Deployment | 1 week | CRITICAL | All phases |
| **TOTAL** | **14 weeks** | | |

---

## BEST PRACTICES

### Code Organization
- One component per file
- Co-locate related files
- Use barrel exports (index.ts)
- Consistent naming conventions

### State Management
- Server state → React Query
- Global client state → Zustand
- Form state → React Hook Form
- URL state → Next.js router

### Styling
- TailwindCSS utility classes
- Component-scoped styles when needed
- Consistent spacing system
- Dark mode support

### Type Safety
- Define all types explicitly
- No `any` types
- Use Zod for runtime validation
- Share types between frontend/backend

### Error Handling
- Try-catch for async operations
- Toast notifications for user feedback
- Error boundaries for UI errors
- Logging for debugging

### Performance
- Lazy load heavy components
- Optimize images
- Debounce search inputs
- Virtualize long lists
- Code splitting

---

## RESOURCES

### Documentation
- Next.js: https://nextjs.org/docs
- React Query: https://tanstack.com/query
- Zustand: https://docs.pmnd.rs/zustand
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev
- TailwindCSS: https://tailwindcss.com

### Tools
- VS Code extensions: ESLint, Prettier, Tailwind IntelliSense
- Browser DevTools: React DevTools, Redux DevTools
- API Testing: Postman, Insomnia
- Design: Figma, Adobe XD

---

## NOTES

### Critical Implementation Points

1. **Sales Orders**:
   - MOST COMPLEX module
   - Validate credit limit BEFORE creating order
   - Reserve inventory immediately
   - Handle promotions carefully
   - Calculate totals accurately

2. **Inventory Management**:
   - ALWAYS validate stock before export
   - Update inventory atomically
   - Handle concurrent updates
   - Use optimistic UI updates

3. **Real-time Updates**:
   - Socket.io for inventory changes
   - Socket.io for notifications
   - Handle reconnection
   - Update cache when receiving events

4. **Forms**:
   - Always validate with Zod
   - Show validation errors clearly
   - Disable submit while loading
   - Handle server errors

5. **Performance**:
   - Lazy load charts & heavy components
   - Debounce search (300ms)
   - Paginate large tables
   - Cache API responses

### Common Pitfalls to Avoid

- ❌ Not handling loading states
- ❌ Not handling errors gracefully
- ❌ Not validating user input
- ❌ Hardcoding API URLs
- ❌ Not cleaning up subscriptions/listeners
- ❌ Not optimizing images
- ❌ Ignoring accessibility
- ❌ Not testing critical flows
- ❌ Poor mobile responsiveness

---

## KẾT QUẢ MONG ĐỢI

### Performance Targets
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 90
- [ ] Bundle size < 500KB

### Features Hoàn Thiện
- [ ] 100+ pages/components
- [ ] 150+ API integrations
- [ ] Real-time updates
- [ ] Role-based access control
- [ ] Multi-language support (optional)

### Code Quality
- [ ] TypeScript strict mode
- [ ] ESLint no errors
- [ ] Form validation với Zod
- [ ] Error handling toàn diện
- [ ] Testing coverage > 50% (critical paths)
- [ ] Unit tests với Jest + React Testing Library
- [ ] E2E tests với Playwright (optional)

---

## KẾT QUẢ CHI TIẾT CÁC TRANG

Dưới đây là mô tả kết quả của các trang chính được phát triển trong từng phase, bao gồm chức năng và giao diện.

### Phase 1: Authentication
- **Login Page** (`/login`): Form đăng nhập với validation, remember me, forgot password link. Kết quả: Xác thực an toàn, redirect sau login.
- **Forgot Password Page** (`/forgot-password`): Form reset password. Kết quả: Gửi email reset, flow khôi phục mật khẩu.
- **Reset Password Page** (`/reset-password/[token]`): Form nhập mật khẩu mới. Kết quả: Cập nhật mật khẩu an toàn.

### Phase 2: Dashboard
- **Dashboard Page** (`/dashboard`): Metrics cards (doanh thu, đơn hàng, tồn kho), charts (revenue, top products), tables (recent orders, low stock). Kết quả: Cái nhìn tổng quan real-time về doanh nghiệp.

### Phase 3: Warehouse & Inventory Management
- **Warehouses List** (`/warehouses`): Table với filters, actions (view/edit/delete). Kết quả: Quản lý kho toàn diện.
- **Warehouse Form** (`/warehouses/create`, `/warehouses/[id]/edit`): Form tạo/sửa kho với validation. Kết quả: Dữ liệu kho chính xác.
- **Products List** (`/products`): Data table với search, filters, bulk actions, export. Kết quả: Quản lý sản phẩm hiệu quả.
- **Product Form** (`/products/create`, `/products/[id]/edit`): Form chi tiết với image upload, categories. Kết quả: Sản phẩm đầy đủ thông tin.
- **Inventory Overview** (`/inventory`): Multi-warehouse view với color coding. Kết quả: Giám sát tồn kho real-time.
- **Stock Transactions** (`/inventory/transactions`): Import/Export/Transfer forms. Kết quả: Giao dịch kho chính xác.

### Phase 4: Production Management
- **BOM List** (`/production/bom`): Table BOM với actions. Kết quả: Quản lý công thức sản xuất.
- **BOM Form** (`/production/bom/create`): Form tạo BOM với materials. Kết quả: Tính toán nguyên liệu tự động.
- **Production Orders List** (`/production/orders`): Table với status tracking. Kết quả: Theo dõi lệnh sản xuất.
- **Production Order Form** (`/production/orders/create`): Form tạo lệnh với material requirements. Kết quả: Quy trình sản xuất có kiểm soát.

### Phase 5: Customer & Sales Management
- **Customers List** (`/customers`): Table với debt indicators. Kết quả: Quản lý khách hàng và công nợ.
- **Customer Form** (`/customers/create`): Form với credit limit. Kết quả: Thông tin khách hàng đầy đủ.
- **Sales Orders List** (`/sales/orders`): Complex table với filters. Kết quả: Quản lý đơn hàng toàn diện.
- **Create Sales Order** (`/sales/orders/create`): Multi-step wizard. Kết quả: Đơn hàng với validation credit và inventory.
- **Deliveries List** (`/sales/deliveries`): Table với status updates. Kết quả: Theo dõi giao hàng.

### Phase 6: Financial Management
- **Receipts List** (`/finance/receipts`): Table payment receipts. Kết quả: Quản lý thu tiền.
- **Vouchers List** (`/finance/vouchers`): Table payment vouchers. Kết quả: Quản lý chi tiền.
- **Debt Reconciliation** (`/finance/debt-reconciliation`): Forms và reports. Kết quả: Đối chiếu công nợ chính xác.

### Phase 7: Promotion Management
- **Promotions List** (`/promotions`): Table với status. Kết quả: Quản lý khuyến mãi.
- **Promotion Form** (`/promotions/create`): Form với condition builder. Kết quả: Khuyến mãi phức tạp.

### Phase 8: User & HR Management
- **Users List** (`/users`): Table với role management. Kết quả: Quản lý nhân viên.
- **User Form** (`/users/create`): Form với permissions. Kết quả: Phân quyền chính xác.
- **Attendance** (`/hr/attendance`): Calendar view. Kết quả: Theo dõi chấm công.
- **Salary** (`/hr/salary`): Forms tính lương. Kết quả: Quản lý lương thưởng.

### Phase 9: Notification & Reporting
- **Reports Pages** (`/reports/*`): Charts và tables với export. Kết quả: Báo cáo chi tiết Excel/PDF.
- **Notification Bell**: Dropdown với real-time updates. Kết quả: Thông báo tức thời.

### Phase 10: Optimization
- **Error Pages** (`/error`, `/loading`): Graceful error handling. Kết quả: UX tốt trong lỗi.
- **Skeleton Screens**: Loading states. Kết quả: Performance cảm nhận tốt.

### Phase 11: Deployment
- **Production App**: Optimized build. Kết quả: Ứng dụng sẵn sàng production với SSL.

**Tổng cộng:** 100+ pages với giao diện responsive, validation đầy đủ, và tích hợp real-time.

---

## CONCLUSION

Đây là roadmap đầy đủ cho frontend với **14 tuần** phát triển. Hệ thống rất phức tạp nên cần:

1. **Follow roadmap từng bước** - Không skip phases
2. **Test thoroughly** - Đặc biệt sales order flow
3. **Code reusability** - Tạo components tái sử dụng
4. **Type safety** - TypeScript + Zod everywhere
5. **Performance first** - Optimize từ đầu

**Good luck! 🚀**
