import { BaseEntity } from "./common.types";
import { Product } from "./product.types";
import { User } from "./user.types";
import { Warehouse } from "./warehouse.types";
import { Supplier } from "./supplier.types";
import { StockTransaction } from "./stock-transaction.types";

export type PurchaseOrderStatus = "pending" | "approved" | "received" | "cancelled";

// Purchase Order
export interface PurchaseOrder extends BaseEntity {
  poCode: string;
  supplierId: number;
  supplier?: Supplier; 
  warehouseId: number;
  warehouse?: Warehouse;
  orderDate: string;
  expectedDeliveryDate?: string;
  totalAmount: number;
  status: PurchaseOrderStatus;
  notes?: string;
  taxRate: number;
  subTotal: number;
  approvedBy?: number;
  sendNumber?: number;
  approver?: User;
  details?: PurchaseOrderDetail[];
  stockTransaction: StockTransaction;
  createdBy?: number;
  creator?: User;
  updatedBy?: number;
}

// Purchase Order Detail
export interface PurchaseOrderDetail extends BaseEntity {
  poId: number;
  po?: PurchaseOrder;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface POCard {
  pending: number;
  approved: number;
  received: number;
  cancelled: number;
}