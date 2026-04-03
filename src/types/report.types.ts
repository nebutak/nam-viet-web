export type DatePreset = "today" | "yesterday" | "thisWeek" | "thisMonth" | "lastMonth" | "custom";
export type SalesChannel = "retail" | "wholesale" | "online" | "distributor";
export type PaymentStatus = "unpaid" | "partial" | "paid";

// ========== FILTER TYPES ==========
export interface SalesReportFilters {
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  warehouseId?: number;
  salesChannel?: SalesChannel;
  createdBy?: number;        // Nhân viên tạo đơn (User ID)
  customerId?: number;       // Khách hàng
  orderStatus?: string;      // pending | preparing | delivering | completed | cancelled
  paymentStatus?: PaymentStatus;
}

export interface RevenueReportFilters {
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  groupBy?: 'day' | 'week' | 'month' | 'year';
  salesChannel?: SalesChannel;
  customerId?: number;
}

export interface ProductionReportFilters {
  productId?: number;
  warehouseId?: number;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  status?: string;  // pending | in_progress | completed | cancelled
  finishedProductId?: number;  // Sản phẩm đích
  createdBy?: number;  // Người tạo lệnh
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
  totalRevenue: number; // Doanh thu tổng
  paidRevenue: number; // Doanh thu thực thu
  orderCount: number;
  debtAmount: number; // Công nợ trong ngày
}

// ========== SALES BY CHANNEL ==========
export interface SalesByChannel {
  channel: SalesChannel;
  displayName: string; // "Bán lẻ", "Bán sỉ", etc.
  totalRevenue: number;
  netRevenue: number;
  revenue: number;
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
  productId: number;
  sku: string;
  productName: string;
  quantity: number;
  categoryName?: string;
  unit: string;
  quantitySold: number; // Số lượng bán
  revenue: number; // Doanh thu từ sản phẩm
  orderCount: number;
}

export interface FinancialReportFilters {
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  datePreset?: 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom';
}

export interface CashFlow {
  date: string;
  openingBalance: number;
  totalReceipts: number;
  totalPayments: number;
  closingBalance: number;
  receiptCount: number;
  paymentCount: number;
}

// Breakdown by type
export interface CashFlowByType {
  type: string;
  displayName: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface PaymentBreakdown {
  paymentMethod: string;
  displayName: string;
  amount: number;
  percentage: number;
  count: number;
}

// Debt Status
export interface DebtStatus {
  customerId: number;
  customerCode: string;
  customerName: string;
  classification: string;
  openingDebt: number;
  newDebt: number;
  payments: number;
  closingDebt: number;
  overdue: boolean;
  daysOverdue?: number;
}

export interface SupplierDebt {
  supplierId: number;
  supplierCode: string;
  supplierName: string;
  supplierType: string;
  openingPayable: number;
  purchasesInPeriod: number;
  paymentsMade: number;
  closingPayable: number;
  overdue: boolean;
  daysOverdue?: number;
}

// KPI Cards
export interface FinancialKPI {
  totalReceipts: number;
  totalPayments: number;
  netCashFlow: number;
  openingBalance: number;
  closingBalance: number;
  receiptGrowth: number; // % vs previous period
  paymentGrowth: number;
  cashFlowGrowth: number;
}

// Profit & Loss
export interface ProfitLossLine {
  key: string;
  label: string;
  currentPeriod: number;
  previousPeriod: number;
  growth: number; // %
  type: 'revenue' | 'expense' | 'subtotal' | 'profit';
}

export interface ProfitLossReport {
  lines: ProfitLossLine[];
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

// Cash Book Entry
export interface CashBookEntry {
  id: number;
  date: string;
  code: string; // Phiếu code
  type: 'receipt' | 'payment';
  description: string;
  party: string; // Customer/Supplier/User
  amount: number;
  paymentMethod: string;
  createdBy: string;
  status: string;
}

export interface FinancialReport {
  period: {
    fromDate: string;
    toDate: string;
    days: number;
  };

  kpi: FinancialKPI;
  profitLoss: ProfitLossReport;
  cashLedger: CashFlow[];
  receiptsByType: CashFlowByType[];
  paymentsByType: CashFlowByType[];
  paymentMethods: PaymentBreakdown[];
  cashBookEntries: CashBookEntry[];
  customerDebts: DebtStatus[];
  supplierDebts: SupplierDebt[];
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
  classification: "retail" | "wholesale" | "vip" | "distributor" | "individual" | "company"; // Phân loại khách
  totalRevenue: number; // Tổng mua
  totalPaid: number; // Tổng đã trả
  orderCount: number;
  totalOrders: number;
  currentDebt: number; // Công nợ hiện tại (quan trọng!)
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

// ========== REVENUE REPORT RESPONSE ==========
export interface RevenueReport {
  summary: {
    grossRevenue: number;
    netRevenue: number;
    totalOrders: number;
    totalDiscount: number;
    totalTax: number;
    averageOrderValue: number;
    paidAmount: number;
    debtAmount: number;
    shippingFee: number;
    growth: number;
  };
  trendData: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  byChannel: SalesByChannel[];
  topProducts: TopProduct[];
  orders: any[];
  productPerformance: any[];
  customerAnalysis: TopCustomer[];
  period: {
    fromDate: string;
    toDate: string;
    groupBy: string;
  };
}

// ========== PRODUCTION REPORT RESPONSE ==========
export interface ProductionReport {
  summary: {
    outputVolume: number;  // Thực tế sản xuất
    plannedVolume: number; // Kế hoạch sản xuất
    completionPercentage: number; // % hoàn thành
    wastageRate: number;  // % hao hụt
    wastageValue: number;  // Giá trị hao hụt
    totalProductionCost: number;  // Tổng chi phí
    costPerUnit: number;  // Chi phí/đơn vị
    activeOrders: number;  // Lệnh đang chạy
    completedOrders: number;  // Lệnh hoàn thành
    totalOrders: number;  // Tổng lệnh
    onTimeDeliveryRate: number;  // % hoàn thành đúng hạn
    completedOnTime: number;  // Số lệnh đúng hạn
    totalCompleted: number;  // Tổng hoàn thành
  };
  planVsActualTrend: Array<{
    date: string;
    planned: number;
    actual: number;
    percentage: number;
  }>;
  topWastageByMaterial: Array<{
    materialId: number;
    materialName: string;
    sku: string;
    wastageQty: number;
    wastageCost: number;
    wastagePercentage: number;
  }>;
  costStructure: Array<{
    type: string;
    name: string;
    amount: number;
    percentage: number;
  }>;
  orders: Array<{
    id: number;
    orderCode: string;
    productName: string;
    sku: string;
    plannedQuantity: number;
    actualQuantity: number;
    completionPercentage: number;
    status: string;
    startDate: string;
    expectedEndDate: string;
    actualEndDate?: string;
    creator: string;
    creatorCode: string;
    isOverdue: boolean;
  }>;
  output: Array<{
    productId: number;
    productName: string;
    plannedQuantity: number;
    producedQuantity: number;
    completionRate: number;
    wastage: number;
  }>;
  materialConsumption: Array<{
    materialId: number;
    materialName: string;
    sku: string;
    unit: string;
    plannedQuantity: number;
    actualQuantity: number;
    wastage: number;
    wastageValue: number;
    variance: number;
    variancePercentage: number;
  }>;
}

export const formatPercentage = (value: number | undefined | null, decimals = 1): string => {
  if (value === undefined || value === null) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
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

