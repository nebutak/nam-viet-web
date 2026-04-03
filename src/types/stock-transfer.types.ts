import { BaseEntity } from "./common.types";
import { Product } from "./product.types";
import { User } from "./user.types";
import { Warehouse } from "./warehouse.types";

// Transfer Status
export type TransferStatus = "pending" | "in_transit" | "completed" | "cancelled";

// Stock Transfer
export interface StockTransfer extends BaseEntity {
  transferCode: string;
  fromWarehouseId: number;
  fromWarehouse?: Warehouse;
  toWarehouseId: number;
  toWarehouse?: Warehouse;
  transferDate: string;
  totalValue?: number;
  reason?: string;
  status: TransferStatus;
  requestedBy?: number;
  requester?: User;
  approvedBy?: number;
  approver?: User;
  cancelledBy?: number;
  canceller?: User;
  approvedAt?: string;
  cancelledAt?: string;
  details?: StockTransferDetail[];
  createdBy?: number;
  updatedBy?: number;
}

// Stock Transfer Detail
export interface StockTransferDetail extends BaseEntity {
  transferId: number;
  transfer?: StockTransfer;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string;
}

export interface CreateStockTransferRequest {
  fromWarehouseId: number;
  toWarehouseId: number;
  transferDate?: string | Date;
  reason?: string;
  details: Array<{
    productId: number;
    quantity: number;
    unitPrice?: number;
    batchNumber?: string;
    expiryDate?: string | Date;
    notes?: string;
  }>;
}

export interface StockTransferResponse {
  id: number;
  transferCode: string;
  fromWarehouseId: number;
  toWarehouseId: number;
  transferDate: string;
  reason?: string;
  status: string;
  createdAt: string;
}

export interface StockTransferFilters {
  fromWarehouseId?: number;
  toWarehouseId?: number;
  status?: TransferStatus;
  fromDay?: string;
  toDay?: string;
}