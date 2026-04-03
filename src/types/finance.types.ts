import type { BaseEntity } from "./common.types";
import type { Customer } from "./customer.types";
import { SalesOrder } from "./sales.types";
import type { User } from "./user.types";

// Receipt Type
export type ReceiptType = "sales" | "debt_collection" | "refund" | "other";

// Payment Method (for receipts)
export type ReceiptPaymentMethod = "cash" | "transfer" | "card";

// Payment Receipt
export interface PaymentReceipt extends BaseEntity {
  receiptCode: string;
  receiptType: ReceiptType;
  customerId: number;
  customerRef?: Customer;
  orderId: number;
  order?: SalesOrder;
  amount: number;
  paymentMethod: ReceiptPaymentMethod;
  bankName?: string;
  transactionReference?: string;
  receiptDate: string;
  approvedBy?: number;
  approver?: User;
  approvedAt?: string;
  isPosted: boolean;
  notes?: string;
  createdBy: number;
  creator?: User;
  isVerified?: boolean;
}

// Update Payment Receipt DTO
export interface UpdatePaymentReceiptDto {
  receiptType?: ReceiptType;
  customerId?: number;
  orderId?: number;
  amount?: number;
  paymentMethod?: ReceiptPaymentMethod;
  bankName?: string;
  transactionReference?: string;
  receiptDate?: string;
  notes?: string;
}

// Approve Receipt DTO
export interface ApproveReceiptDto {
  notes?: string;
}

// Payment Receipt Filters
export interface PaymentReceiptFilters {
  receiptType?: ReceiptType | ReceiptType[];
  customerId?: number;
  orderId?: number;
  paymentMethod?: ReceiptPaymentMethod | ReceiptPaymentMethod[];
  isPosted?: boolean;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// Payment Receipt Statistics
export interface PaymentReceiptStatistics {
  totalReceipts: number;
  totalAmount: number;
  cashAmount: number;
  transferAmount: number;
  cardAmount: number;
  approvedReceipts: number;
  pendingReceipts: number;
}

// =====================================================
// PAYMENT VOUCHERS (Phiếu chi)
// =====================================================
// Voucher Type
export type VoucherType = "salary" | "operating_cost" | "supplier_payment" | "refund" | "other";

// Payment Method (for vouchers) - only cash and transfer
export type VoucherPaymentMethod = "cash" | "transfer";

// Payment Voucher
export interface PaymentVoucher extends BaseEntity {
  voucherCode: string;
  voucherType: VoucherType;
  supplierId?: number;
  supplier?: any; // Supplier type
  expenseAccount?: string; // Mã tài khoản chi phí kế toán
  amount: number;
  paymentMethod: VoucherPaymentMethod;
  bankName?: string;
  paymentDate: string;
  approvedBy?: number;
  approver?: User;
  approvedAt?: string;
  isPosted: boolean;
  notes?: string;
  createdBy: number;
  creator?: User;
}

// Update Payment Voucher DTO
export interface UpdatePaymentVoucherDto {
  voucherType?: VoucherType;
  supplierId?: number;
  expenseAccount?: string;
  amount?: number;
  paymentMethod?: VoucherPaymentMethod;
  bankName?: string;
  paymentDate?: string;
  notes?: string;
}

// Approve Voucher DTO
export interface ApproveVoucherDto {
  notes?: string;
}

// Payment Voucher Filters
export interface PaymentVoucherFilters {
  voucherType?: VoucherType | VoucherType[];
  supplierId?: number;
  paymentMethod?: VoucherPaymentMethod | VoucherPaymentMethod[];
  isPosted?: boolean;
  fromDate?: string;
  toDate?: string;
}

// Payment Voucher Statistics
export interface PaymentVoucherStatistics {
  totalVouchers: number;
  totalAmount: number;
  cashAmount: number;
  transferAmount: number;
  cardAmount: number;
  approvedVouchers: number;
  pendingVouchers: number;
}

// =====================================================
// CASH FUND (Quỹ tiền mặt)
// =====================================================

export interface CashFund extends BaseEntity {
  fundDate: string;
  openingBalance: number;
  totalReceipts: number;
  totalPayments: number;
  closingBalance: number;
  actualBalance?: number;
  discrepancy?: number;
  isLocked: boolean;
  lockedBy?: number;
  locker?: User;
  lockedAt?: string;
  notes?: string;
}


