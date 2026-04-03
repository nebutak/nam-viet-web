// Dashboard Metrics
export interface DashboardMetrics {
  // Revenue metrics
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  revenueGrowthPercent: number;

  // Orders metrics
  ordersToday: number;
  ordersWeek: number;
  ordersMonth: number;
  ordersPending: number;
  ordersGrowthPercent: number;

  // Inventory metrics
  totalInventoryValue: number;
  lowStockItemsCount: number;
  outOfStockItemsCount: number;

  // Debt metrics
  totalDebt: number;
  overdueDebt: number;
  customersWithDebt: number;

  // Production metrics
  productionOrdersInProgress: number;
  productionOrdersCompletedThisMonth: number;
}

// Revenue Chart Data Point
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

// Revenue Chart Data
export interface RevenueChartData {
  period: "day" | "week" | "month" | "year";
  data: RevenueDataPoint[];
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
}

// Top Product
export interface TopProduct {
  productId: number;
  productName: string;
  sku: string;
  totalQuantity: number;
  totalRevenue: number;
  ordersCount: number;
}

// Sales Channel Distribution
export interface SalesChannelData {
  channel: "store" | "online" | "phone" | "social_media" | "distributor";
  channelName: string;
  ordersCount: number;
  revenue: number;
  percentage: number;
}

// Inventory by Type
export interface InventoryByType {
  type: "raw_material" | "packaging" | "finished_product" | "goods";
  typeName: string;
  totalQuantity: number;
  totalValue: number;
  itemsCount: number;
}

// Recent Order for Dashboard
export interface RecentOrder {
  id: number;
  orderCode: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  paymentStatus: "unpaid" | "partial" | "paid";
  status: "pending" | "approved" | "in_progress" | "completed" | "cancelled";
}

// Low Stock Item
export interface LowStockItem {
  productId: number;
  productName: string;
  sku: string;
  warehouseId: number;
  warehouseName: string;
  currentQuantity: number;
  minStockLevel: number;
  shortage: number;
  status: "low" | "out";
}

// Overdue Debt
export interface OverdueDebt {
  customerId: number;
  customerName: string;
  customerCode: string;
  totalDebt: number;
  overdueAmount: number;
  daysOverdue: number;
  phone?: string;
}

// Dashboard Data (Combined)
export interface DashboardData {
  metrics: DashboardMetrics;
  revenueChart: RevenueChartData;
  topProducts: TopProduct[];
  salesChannels: SalesChannelData[];
  inventoryByType: InventoryByType[];
  recentOrders: RecentOrder[];
  lowStockItems: LowStockItem[];
  overdueDebts: OverdueDebt[];
}
