import type { BaseEntity } from "./common.types";
import type { Product } from "./product.types";
import { Warehouse, WarehouseType } from "./warehouse.types";

// Inventory By Product Response
export interface InventoryByProductResponse {
  product: {
    id: number;
    sku: string;
    productName: string;
    productType: string;
    unit: string;
    minStockLevel?: number;
  };
  warehouses: Array<Inventory & {
    availableQuantity: number;
  }>;
  summary: {
    totalQuantity: number;
    totalReserved: number;
    totalAvailable: number;
    onOrderQuantity: number;
    warehouseCount: number;
  };
}

// Inventory By Warehouse Response
export interface InventoryByWarehouseResponse {
  warehouseId: number;
  productId: number;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  product: {
    sku: string;
    productName: string;
    minStockLevel: number;
  };
}

// Inventory Interface
export interface Inventory extends BaseEntity {
  warehouseId: number;
  warehouse?: Warehouse;
  productId: number;
  product?: Product;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastUpdated: string;
  updatedBy?: number;
}


// Inventory Adjustment DTO
export interface InventoryAdjustmentDto {
  warehouseId: number;
  productId: number;
  quantityChange: number;
  reason: string;
  notes?: string;
}

// Inventory Filters
export interface InventoryFilters {
  warehouseId?: number;
  warehouseType?: WarehouseType;
  productId?: number;
  productType?: string;
  categoryId?: number;
  lowStock?: boolean;
  outOfStock?: boolean;
}

// Inventory Alert (Low Stock) - Matches backend response exactly
export interface InventoryAlert {
  id: number;
  warehouseId: number;
  productId: number;
  quantity: number;
  reservedQuantity: number;
  warehouse: {
    id: number;
    warehouseName: string;
    warehouseCode: string;
    warehouseType: WarehouseType;
  };
  product: {
    id: number;
    sku: string;
    productName: string;
    productType: string;
    unit: string;
    minStockLevel: number;
    category?: {
      id: number;
      categoryName: string;
    };
  };
  availableQuantity: number;  // Calculated: quantity - reservedQuantity
  shortfall: number;          // Calculated: minStockLevel - availableQuantity
  percentageOfMin: number;    // Calculated: (availableQuantity / minStockLevel) * 100
}

export interface AlertFilters {
  warehouseId?: number;
}

// Alerts API Response
export interface AlertsApiResponse {
  alerts: InventoryAlert[];
  summary: {
    totalAlerts: number;
    outOfStock: number; // availableQuantity === 0
    critical: number;   // 0 < availableQuantity < 25%
    warning: number;    // 25% <= percentage < 50%
    low: number;        // 50% <= percentage < 100%
  };
}

// Legacy type - kept for backward compatibility
export interface LowStockAlert {
  productId: number;
  product: Product;
  warehouseId: number;
  warehouse: Warehouse;
  currentQuantity: number;
  minStockLevel: number;
  shortage: number;
}

export interface CardStat {
    totalValue: number;
    lowStockItems: number;
    reservedQuantity: number;
    expiredQuantity: number;
}

