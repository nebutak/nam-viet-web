/**
 * Sales Report Type Definitions
 * Detailed types for the new sales report UI
 */

export type DatePreset = "today" | "yesterday" | "thisWeek" | "thisMonth" | "lastMonth" | "custom";
export type SalesChannel = "retail" | "wholesale" | "online" | "distributor";
export type PaymentStatus = "unpaid" | "partial" | "paid";

// ========== FILTER TYPES ==========
export interface SalesReportFilters {
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  warehouseId?: number;
  salesChannel?: SalesChannel;
  staffId?: number;
  customerId?: number;
  paymentStatus?: PaymentStatus;
}

// ========== KPI SUMMARY ==========
export interface SalesKPISummary {
  // Card 1: Doanh thu thuần
  netRevenue: number;
  netRevenueGrowth: number; // % so với kỳ trước
  
  // Card 2: Lợi nhuận ước tính
  estimatedProfit: number;
  profitMargin: number; // %
  
  // Card 3: Số lượng đơn hàng
  totalOrders: number;
  cancelledOrders: number;
  completedOrders: number;
  
  // Card 4: Công nợ phát sinh
  newDebt: number; // Công nợ phát sinh trong kỳ
  totalDebt: number; // Tổng công nợ hiện tại của khách
  debtPercentage: number; // % so với doanh thu
}

// ========== TREND DATA ==========
export interface SalesTrendData {
  date: string;
  totalRevenue: number; // Doanh thu tổng (finalAmount)
  paidRevenue: number; // Doanh thu thực thu (paidAmount)
  orderCount: number;
  debtAmount: number; // Công nợ trong ngày
}

// ========== SALES BY CHANNEL ==========
export interface SalesByChannel {
  channel: SalesChannel;
  displayName: string; // "Bán lẻ", "Bán sỉ", etc.
  totalRevenue: number;
  netRevenue: number;
  discount: number;
  tax: number;
  shipping: number;
  paidAmount: number;
  debtAmount: number;
  orderCount: number;
  percentage: number;
}

// ========== TOP PRODUCTS ==========
export interface TopProduct {
  id: number;
  sku: string;
  productName: string;
  image?: string;
  unit: string;
  quantity: number; // Số lượng bán
  revenue: number; // Doanh thu từ sản phẩm
  percentage: number; // % so với tổng doanh thu
  currentStock: number; // Tồn kho hiện tại
  trend?: number[]; // Xu hướng 7 ngày (sparkline)
}

// ========== STAFF PERFORMANCE ==========
export interface StaffPerformance {
  staffId: number;
  staffName: string;
  avatar?: string;
  totalOrders: number; // Số đơn tạo
  totalRevenue: number; // Doanh số
  paidRevenue: number; // Thực thu
  debtAmount: number; // Công nợ phát sinh
  completionRate: number; // % hoàn tất
}

// ========== TOP CUSTOMERS ==========
export interface TopCustomer {
  customerId: number;
  customerCode: string;
  customerName: string;
  classification: "retail" | "wholesale" | "vip" | "distributor"; // Phân loại khách
  totalOrders: number;
  totalRevenue: number; // Tổng mua
  currentDebt: number; // Công nợ hiện tại (quan trọng!)
  lastOrderDate?: string; // Lần mua cuối
  paymentStatus: "good" | "warning" | "danger"; // Tình trạng thanh toán
}

// ========== COMPLETE SALES REPORT RESPONSE ==========
export interface SalesReport {
  period: {
    fromDate: string;
    toDate: string;
    days: number;
  };
  
  summary: SalesKPISummary;
  
  trends: SalesTrendData[]; // Dữ liệu biểu đồ đường theo ngày
  
  byChannel: SalesByChannel[]; // Dữ liệu biểu đồ tròn
  
  topProducts: TopProduct[];
  staffPerformance: StaffPerformance[];
  topCustomers: TopCustomer[];
}

// ========== UTILITY FUNCTIONS ==========
export const formatCurrencyVND = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const getChannelName = (channel: SalesChannel): string => {
  const channelNames: Record<SalesChannel, string> = {
    retail: "Bán lẻ",
    wholesale: "Bán sỉ",
    online: "Online",
    distributor: "Đại lý",
  };
  return channelNames[channel] || channel;
};

export const getClassificationName = (classification: string): string => {
  const names: Record<string, string> = {
    retail: "Khách lẻ",
    wholesale: "Khách sỉ",
    vip: "Khách VIP",
    distributor: "Đại lý",
    individual: "Cá nhân",
    company: "Công ty",
  };
  return names[classification] || classification;
};
