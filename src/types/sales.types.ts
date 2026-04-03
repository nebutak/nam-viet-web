import type { BaseEntity } from "./common.types";
import type { Customer } from "./customer.types";
import { PaymentReceipt } from "./finance.types";
import type { Product } from "./product.types";
import type { User } from "./user.types";
import type { Warehouse } from "./warehouse.types";

// Payment Method - MATCH BACKEND & DATABASE
export type PaymentMethod = "cash" | "transfer" | "installment" | "credit";

// Payment Status
export type PaymentStatus = "unpaid" | "partial" | "paid";

// Order Status - MATCH BACKEND & DATABASE
export type OrderStatus = "pending" | "preparing" | "delivering" | "completed" | "cancelled";

// Delivery Status
export type DeliveryStatus = "pending" | "in_transit" | "delivered" | "failed" | "returned";

// Settlement Status
export type SettlementStatus = "pending" | "settled";

// Sales Channel
export type SalesChannel = "retail" | "wholesale" | "online" | "distributor";

// Sales Order
export interface SalesOrder extends BaseEntity {
  orderCode: string;
  customerId: number;
  customer?: Customer;
  warehouseId?: number;
  warehouse?: Warehouse;
  orderDate: string;
  salesChannel: SalesChannel;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryAddress?: string;
  notes?: string;
  createdBy: number;
  creator?: User;
  approvedBy?: number;
  approver?: User;
  cancelledBy?: number;
  canceller?: User;
  approvedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  details?: SalesOrderDetail[];
  deliveries?: Delivery[];
  paymentReceipts?: PaymentReceipt[];
}

// Sales Order Detail
export interface SalesOrderDetail extends BaseEntity {
  orderId: number;
  order?: SalesOrder;
  productId: number;
  product?: Product;
  warehouseId?: number;
  warehouse?: Warehouse;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxRate: number;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

// Delivery
export interface Delivery extends BaseEntity {
  deliveryCode: string;
  orderId: number;
  order?: SalesOrder;
  deliveryStaffId: number;
  deliveryStaff?: User;
  shippingPartner?: string;
  deliveryDate: string;
  deliveryStatus: DeliveryStatus;
  deliveryCost: number;
  codAmount: number;
  collectedAmount: number;
  receivedBy?: string;
  receivedPhone?: string;
  deliveryProof?: string;
  failureReason?: string;
  settlementStatus: SettlementStatus;
  settledBy?: number;
  settler?: User;
  notes?: string;
  settledAt?: string;
}

// Create Sales Order DTO
export interface CreateSalesOrderDto {
  customerId: number;
  warehouseId?: number;
  orderDate?: string;
  salesChannel: SalesChannel;
  isPickupOrder?: boolean; // true = lấy ngay (completed), false = giao hàng (pending)
  deliveryAddress?: string;
  recipientName?: string;
  recipientPhone?: string;
  shippingFee?: number;
  paymentMethod: PaymentMethod;
  paidAmount?: number;
  notes?: string;
  items: Array<{
    productId: number;
    warehouseId?: number;
    quantity: number;
    unitPrice: number;
    discountPercent?: number;
    taxRate?: number;
    batchNumber?: string;
    expiryDate?: string;
    notes?: string;
  }>;
}

// Update Sales Order DTO
export interface UpdateSalesOrderDto {
  deliveryAddress?: string;
  shippingFee?: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
  details?: Array<{
    id?: number;
    productId: number;
    warehouseId?: number;
    quantity: number;
    unitPrice: number;
    discountPercent?: number;
    taxRate?: number;
    batchNumber?: string;
    expiryDate?: string;
    notes?: string;
  }>;
}

// Approve Order DTO
export interface ApproveOrderDto {
  notes?: string;
}

// Cancel Order DTO
export interface CancelOrderDto {
  reason: string;
}

// Process Payment DTO
export interface ProcessPaymentDto {
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate?: string;
  notes?: string;
}

// Sales Order Filters
export interface SalesOrderFilters {
  customerId?: number;
  orderStatus?: OrderStatus | OrderStatus[];
  paymentStatus?: PaymentStatus | PaymentStatus[];
  salesChannel?: SalesChannel;
  paymentMethod?: PaymentMethod;
  fromDate?: string;
  toDate?: string;
  warehouseId?: number;
  createdBy?: number;
}

// Order Summary (cho cart/checkout)
export interface OrderSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

// Cart Item (cho tạo order)
export interface CartItem {
  productId: number;
  product: Product;
  warehouseId?: number;
  warehouse?: Warehouse;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxRate: number;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

// Inventory Shortage Warning
export interface InventoryShortage {
  productId: number;
  productName: string;
  requested: number;
  available: number;
  shortage: number;
}

// Order Statistics
export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  paidAmount: number;
  unpaidAmount: number;
  pendingOrders: number;
  approvedOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

// =====================================================
// DELIVERY DTOs
// =====================================================

// Create Delivery DTO
export interface CreateDeliveryDto {
  orderId: number;
  deliveryStaffId: number;
  shippingPartner?: string;
  deliveryDate: string;
  deliveryCost?: number;
  codAmount?: number;
  notes?: string;
}

// Update Delivery DTO
export interface UpdateDeliveryDto {
  deliveryStaffId?: number;
  shippingPartner?: string;
  deliveryDate?: string;
  deliveryCost?: number;
  codAmount?: number;
  notes?: string;
}

// Update Delivery Status DTO
export interface UpdateDeliveryStatusDto {
  deliveryStatus: DeliveryStatus;
  receivedBy?: string;
  receivedPhone?: string;
  collectedAmount?: number;
  failureReason?: string;
  notes?: string;
}

// Upload Delivery Proof DTO
export interface UploadDeliveryProofDto {
  proof: File;
}

// Settle Delivery DTO
export interface SettleDeliveryDto {
  notes?: string;
}

// Delivery Filters
export interface DeliveryFilters {
  orderId?: number;
  deliveryStaffId?: number;
  deliveryStatus?: DeliveryStatus | DeliveryStatus[];
  settlementStatus?: SettlementStatus | SettlementStatus[];
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// Delivery Statistics
export interface DeliveryStatistics {
  totalDeliveries: number;
  pendingDeliveries: number;
  inTransitDeliveries: number;
  deliveredDeliveries: number;
  failedDeliveries: number;
  totalCOD: number;
  collectedCOD: number;
  pendingSettlement: number;
}
