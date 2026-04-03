import { BaseEntity } from "./common.types";
import { Product } from "./product.types";
import { User } from "./user.types";

// BOM Status
export type BomStatus = "draft" | "active" | "inactive";

// Material Type in BOM
export type BomMaterialType = "raw_material" | "packaging";

// BOM Material Item (trong BOM)
export interface BomMaterial {
  id: number;
  bomId: number;
  materialId: number;
  material: Product;
  quantity: number;
  unit: string;
  materialType: BomMaterialType;
  notes?: string;
}

// BOM (Bill of Materials)
export interface Bom extends BaseEntity {
  bomCode: string;
  finishedProductId: number;
  finishedProduct: Product;
  version: string;
  outputQuantity: number; // Sản lượng/mẻ
  efficiencyRate: number; // Tỷ lệ hiệu suất (%)
  productionTime?: number; // Thời gian sản xuất (phút)
  status: BomStatus;
  notes?: string;
  createdBy: number;
  creator?: User;
  approvedBy?: number;
  approver?: User;
  approvedAt?: string;
  materials: BomMaterial[];
  productionOrders?: any[]; // Sẽ định nghĩa chi tiết ở production.types.ts
}

// BOM List Item (cho table)
export interface BomListItem {
  id: number;
  bomCode: string;
  finishedProductId: number;
  finishedProductName: string;
  finishedProductSku: string;
  version: string;
  outputQuantity: number;
  efficiencyRate: number;
  status: BomStatus;
  materialsCount: number;
  createdBy: number;
  creatorName?: string;
  approvedBy?: number;
  approverName?: string;
  createdAt: string;
  updatedAt: string;
}

// Create BOM Input
export interface CreateBomInput {
  bomCode: string;
  finishedProductId: number;
  version?: string;
  outputQuantity: number;
  efficiencyRate?: number;
  productionTime?: number;
  notes?: string;
  materials: CreateBomMaterialInput[];
}

// Create BOM Material Input
export interface CreateBomMaterialInput {
  materialId: number;
  quantity: number;
  unit?: string;
  materialType: BomMaterialType;
  notes?: string;
}

// Update BOM Input
export interface UpdateBomInput {
  bomCode?: string;
  finishedProductId?: number;
  version?: string;
  outputQuantity?: number;
  efficiencyRate?: number;
  productionTime?: number;
  notes?: string;
  materials?: CreateBomMaterialInput[];
}

// BOM Query Params
export interface BomQueryParams {
  status?: BomStatus;
  finishedProductId?: number;
}

// Calculate Materials Input
export interface CalculateMaterialsInput {
  bomId: number;
  productionQuantity: number;
}

// Calculated Material Result
export interface CalculatedMaterial {
  materialId: number;
  materialName: string;
  materialSku: string;
  materialType: BomMaterialType;
  unit: string;
  baseQuantityPerBatch: number;
  totalQuantityNeeded: number;
  unitPrice: number;
  estimatedCost: number;
}

// Calculate Materials Result
export interface CalculateMaterialsResult {
  bomId: number;
  bomCode: string;
  finishedProduct: {
    id: number;
    name: string;
    unit: string;
  };
  productionQuantity: number;
  outputQuantityPerBatch: number;
  batchCount: number;
  efficiencyRate: number;
  materials: CalculatedMaterial[];
  totalEstimatedCost: number;
  costPerUnit: number;
}

// Approve BOM Input
export interface ApproveBomInput {
  notes?: string;
}

// BOM Form Data (cho React Hook Form)
export interface BomFormData {
  bomCode: string;
  finishedProductId: number;
  version: string;
  outputQuantity: number;
  efficiencyRate: number;
  productionTime?: number;
  notes?: string;
  materials: BomMaterialFormData[];
}

// BOM Material Form Data
export interface BomMaterialFormData {
  id?: number; // Có ID nếu đang edit
  materialId: number;
  materialName?: string; // For display
  materialSku?: string; // For display
  quantity: number;
  unit: string;
  materialType: BomMaterialType;
  notes?: string;
}
