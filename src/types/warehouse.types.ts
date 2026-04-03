import { BaseEntity, StatusCommon } from "./common.types";
import { User } from "./user.types";

export type WarehouseType = "raw_material" | "packaging" | "finished_product" | "goods";

export interface Warehouse extends BaseEntity {
  warehouseCode: string;
  warehouseName: string;
  warehouseType: WarehouseType;
  address?: string;
  city?: string;
  region?: string;
  description?: string;
  managerId?: number;
  manager?: User;
  capacity?: number;
  status: StatusCommon;
}

export interface WarehouseFilters {
  warehouseType?: WarehouseType;
  status?: StatusCommon;
  city?: string;
  region?: string;
  managerId?: number;
}

// Warehouse Statistics
export interface WarehouseStatistics {
  warehouseId: number;
  warehouseName: string;
  warehouseType: WarehouseType;
  inventory: {
    totalProducts: number;
    totalQuantity: number;
    reservedQuantity: number;
    availableQuantity: number;
    totalValue: number;
  };
  transactions: {
    last30Days: Record<string, number>;
  };
  capacity: {
    total: number | null;
    used: number;
    available: number | null;
    utilizationPercent: number | null;
  };
}

// Dashboard Statistics DTO
export interface WarehouseCards {
  totalWarehouses: number;
  activeWarehouses: number;
  createdThisMonth: number;
  totalInventoryValue: number;
}