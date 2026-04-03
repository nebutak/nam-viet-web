import { PaymentMethod } from "./sales.types";
import { User } from "./user.types";

// Salary Status Enum
export type SalaryStatus = "pending" | "approved" | "paid";

export interface Salary {
  id: number;
  userId: number;
  month: string; // Format: YYYYMM (e.g., "202501")
  basicSalary: number; // Lương cơ bản
  allowance: number; // Phụ cấp
  overtimePay: number; // Lương làm thêm
  bonus: number; // Thưởng
  commission: number; // Hoa hồng
  deduction: number; // Khấu trừ
  advance: number; // Tạm ứng
  totalSalary: number; // Tổng lương (GENERATED/COMPUTED field)
  paymentDate: string | null; // Ngày thanh toán
  status: SalaryStatus;
  isPosted: boolean; // Đã hạch toán chưa
  approvedBy: number | null;
  approvedAt: string | null;
  paidBy: number | null;
  voucherId: number | null; // Payment voucher ID
  notes: string | null;
  createdBy: number;
  createdAt: string;

  // Relations (populated by backend)
  user?: User;
  approver?: User;
  payer?: User;
  creator?: User;
}

// Salary Filters for querying
export interface SalaryFilters {
  userId?: number;
  month?: string; // YYYYMM
  status?: SalaryStatus;
  roleId?: number;
  warehouseId?: number;
  fromMonth?: string; // YYYYMM
  toMonth?: string; // YYYYMM
}

// Salary Summary (aggregated data)
export interface SalarySummary {
  totalSalaries: number; // Tổng số bảng lương
  totalBasicSalary: number; // Tổng lương cơ bản
  totalAllowance: number; // Tổng phụ cấp
  totalOvertimePay: number; // Tổng lương OT
  totalBonus: number; // Tổng thưởng
  totalCommission: number; // Tổng hoa hồng
  totalDeduction: number; // Tổng khấu trừ
  totalAdvance: number; // Tổng tạm ứng
  totalPaid: number; // Tổng đã thanh toán
  totalPending: number; // Tổng chờ duyệt
  totalApproved: number; // Tổng đã duyệt
  fromMonth: string;
  toMonth: string;
}

// Salary Calculation Result (preview before save)
export interface SalaryCalculationResult {
  userId: number;
  month: string;
  basicSalary: number;
  allowance: number;
  overtimePay: number; // Auto-calculated from attendance
  bonus: number;
  commission: number; // Auto-calculated from sales
  deduction: number;
  advance: number;
  totalSalary: number; // Calculated: basic + allowance + overtime + bonus + commission - deduction - advance
  workDays: number; // Số ngày làm việc
  overtimeHours: number; // Số giờ làm thêm
  totalSales?: number; // Tổng doanh số (if sales person)
  user?: User;
}

// Helper Constants & Labels
// Salary Status Labels (Vietnamese)
export const SALARY_STATUS_LABELS: Record<SalaryStatus, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  paid: "Đã thanh toán",
};

// Payment Method Labels (Vietnamese)
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Tiền mặt",
  transfer: "Chuyển khoản",
  installment: "Trả góp", 
  credit: "Tín dụng",
};

// Salary Component Labels (Vietnamese)
export const SALARY_COMPONENT_LABELS = {
  basicSalary: "Lương cơ bản",
  allowance: "Phụ cấp",
  overtimePay: "Lương làm thêm",
  bonus: "Thưởng",
  commission: "Hoa hồng",
  deduction: "Khấu trừ",
  advance: "Tạm ứng",
  totalSalary: "Tổng lương",
} as const;

// Default salary calculation config
export const SALARY_CONFIG = {
  OVERTIME_RATE: 1.5, // 150% for overtime
  COMMISSION_RATE: 0.02, // 2% commission on sales
  STANDARD_WORK_DAYS: 26, // Days per month
} as const;

// Format month from YYYYMM to display format
export function formatMonth(month: string): string {
  if (!month || month.length !== 6) return month;
  const year = month.substring(0, 4);
  const mon = month.substring(4, 6);
  return `${mon}/${year}`;
}

// Format month from Date to YYYYMM
export function dateToMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
}

// Parse YYYYMM to Date (first day of month)
export function monthToDate(month: string): Date {
  if (!month || month.length !== 6) return new Date();
  const year = parseInt(month.substring(0, 4));
  const mon = parseInt(month.substring(4, 6)) - 1;
  return new Date(year, mon, 1);
}