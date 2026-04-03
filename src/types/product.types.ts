import { ProductFormData } from "@/lib/validations";
import type { BaseEntity, StatusCommon } from "./common.types";
import { Supplier } from "./supplier.types";
import type { Inventory } from "./inventory.types";

// Product Type
export type ProductType = "raw_material" | "packaging" | "finished_product" | "goods";

export type ProductStatus = "active" | "inactive" | "discontinued";

// Packaging Type
export type PackagingType = "bottle" | "box" | "bag" | "label" | "other";

// Video Type
export type VideoType = "demo" | "tutorial" | "review" | "unboxing" | "promotion" | "other";

// Category
export interface Category extends BaseEntity {
  categoryCode: string;
  categoryName: string;
  slug: string;
  parentId?: number;
  parent?: Category;
  children?: Category[];
  description?: string;
  status: StatusCommon;
  _count: { products: number };
}

// Unit basic info
export interface UnitInfo {
  id: number;
  unitName: string;
  unitSymbol?: string;
}

// Product
export interface Product extends BaseEntity {
  sku: string;
  slug: string;
  productName: string;
  productType: ProductType;
  packagingType?: PackagingType;
  categoryId?: number;
  category?: Category;
  supplierId?: number;
  supplier?: Supplier;
  unitId?: number;
  unit?: UnitInfo | string; // can be object or string depending on API response
  barcode?: string;
  weight?: number;
  dimensions?: string;
  description?: string;
  purchasePrice?: number;
  sellingPriceRetail?: number;
  sellingPriceWholesale?: number;
  sellingPriceVip?: number;
  taxRate?: number;
  minStockLevel?: number;
  expiryDate?: string;
  status: ProductStatus;
  image?: string;         // Single image field (new schema)
  isFeatured?: boolean;   // Featured product flag
  images?: ProductImage[];
  videos?: ProductVideo[];
  inventory?: Inventory[];
  currentQuantity?: number;
  createdBy?: number;
  updatedBy?: number;
}

// Product Image
export interface ProductImage extends BaseEntity {
  productId: number;
  imageUrl: string;
  imageType: "thumbnail" | "gallery" | "main";
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
  uploadedBy?: number;
}

// Product Video
export interface ProductVideo extends BaseEntity {
  productId: number;
  videoUrl: string;
  videoType: VideoType;
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  fileSize?: bigint;
  isPrimary: boolean;
  displayOrder: number;
  uploadedBy?: number;
}

// Product Update DTO
export interface UpdateProductDto extends Partial<ProductFormData> {}

// Product Filters
export interface ProductFilters {
  productType?: ProductType | ProductType[];
  packagingType?: PackagingType;
  categoryId?: number;
  supplierId?: number;
  warehouseId?: number;
  status?: ProductStatus | string;
  lowStock?: boolean;
  expiringSoon?: boolean;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isFeatured?: boolean;
}

// Product với tồn kho
export interface ProductWithInventory extends Product {
  totalQuantity?: number;
  availableQuantity?: number;
  reservedQuantity?: number;
}

// Category Tree
export interface CategoryTree extends Category {
  level?: number;
  children?: CategoryTree[];
}

// Get Product Statistics
export interface ProductStats {
  totalProducts: number;
  byStatus: {
    active: number;
    inactive: number;
    discontinued: number;
  };
  byType: {
    rawMaterial: number;
    packaging: number;
    finished: number;
    goods: number;
  };
  dataQuality: {
    withoutSupplier: number;
    withoutCategory: number;
  };
}

// Raw Material Statistics
export interface RawMaterialStats {
  totalRawMaterials: number;
  byStatus: {
    active: number;
    inactive: number;
    discontinued: number;
  };
  lowStockCount: number;
  expiringCount: number;
  discontinuedCount: number;
  totalInventoryValue: number;
}

export interface PackagingStats {
  totalPackaging: number;
  byStatus: {
    active: number;
    inactive: number;
    discontinued: number;
  };
  lowStockCount: number;
  expiringCount: number;
  discontinuedCount: number;
  totalInventoryValue: number;
}