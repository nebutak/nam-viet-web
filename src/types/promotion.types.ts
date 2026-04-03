import type { BaseEntity } from "./common.types";
import type { User } from "./user.types";
import type { Product } from "./product.types";

// =====================================================
// ENUMS
// =====================================================

export type PromotionType = "percent_discount" | "fixed_discount" | "buy_x_get_y" | "gift";

export type PromotionStatus = "pending" | "active" | "expired" | "cancelled";

export type ApplicableTo = "all" | "category" | "product_group" | "specific_product" | "customer_group";

// =====================================================
// MAIN TYPES
// =====================================================

export interface PromotionConditions {
  // Time-based conditions
  daysOfWeek?: number[]; // [0-6] Sunday-Saturday
  timeSlots?: {
    start: string; // HH:mm format
    end: string;
  }[];

  // Customer conditions
  customerTypes?: string[]; // Customer classifications
  excludedCustomers?: number[]; // Customer IDs to exclude

  // Product conditions
  categoryIds?: number[];
  productGroupIds?: number[];
  excludedProductIds?: number[];

  // Quantity conditions
  minQuantityPerProduct?: number;
  maxQuantityPerProduct?: number;

  // Buy X Get Y specific
  buyQuantity?: number; // X
  getQuantity?: number; // Y

  // Additional conditions
  requiresCouponCode?: boolean;
  couponCode?: string;
  stackable?: boolean; // Can combine with other promotions

  // Custom conditions (flexible)
  [key: string]: any;
}

export interface Promotion extends BaseEntity {
  promotionCode: string;
  promotionName: string;
  promotionType: PromotionType;
  discountValue: number; // Percentage or fixed amount
  maxDiscountValue?: number; // Max discount for percentage type
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  applicableTo: ApplicableTo;
  minOrderValue: number;
  minQuantity: number;
  conditions?: PromotionConditions | null;
  quantityLimit?: number;
  usageCount: number;
  status: PromotionStatus;

  // Relationships
  createdBy: number;
  creator?: User;
  approvedBy?: number;
  approver?: User;
  approvedAt?: string;
  cancelledBy?: number;
  canceller?: User;
  cancelledAt?: string;

  // Related products
  products?: PromotionProduct[];
}

export interface PromotionProduct {
  id: number;
  promotionId: number;
  productId: number;
  product?: Product;
  discountValueOverride?: number; // Override default discount for this product
  minQuantity: number; // Min quantity for this product
  giftProductId?: number; // Gift product ID (for buy_x_get_y or gift)
  giftProduct?: Product;
  giftQuantity: number;
  note?: string;
}

// =====================================================
// DTOs
// =====================================================

export interface CreatePromotionDto {
  promotionCode: string;
  promotionName: string;
  promotionType: PromotionType;
  discountValue?: number;
  maxDiscountValue?: number;
  startDate: string;
  endDate: string;
  isRecurring?: boolean;
  applicableTo: ApplicableTo;
  minOrderValue?: number;
  minQuantity?: number;
  conditions?: PromotionConditions;
  quantityLimit?: number;

  // Products
  products?: CreatePromotionProductDto[];
}

// Create Promotion Product DTO
export interface CreatePromotionProductDto {
  productId: number;
  discountValueOverride?: number;
  minQuantity?: number;
  giftProductId?: number;
  giftQuantity?: number;
  note?: string;
}

// Update Promotion DTO
export interface UpdatePromotionDto {
  promotionName?: string;
  discountValue?: number;
  maxDiscountValue?: number;
  startDate?: string;
  endDate?: string;
  isRecurring?: boolean;
  applicableTo?: ApplicableTo;
  minOrderValue?: number;
  minQuantity?: number;
  conditions?: PromotionConditions;
  quantityLimit?: number;

  // Products
  products?: CreatePromotionProductDto[];
}

// Approve Promotion DTO
export interface ApprovePromotionDto {
  notes?: string;
}

// Cancel Promotion DTO
export interface CancelPromotionDto {
  reason: string;
}

// Apply Promotion DTO
export interface ApplyPromotionDto {
  orderId?: number;
  customerId?: number;
  orderValue: number;
  products: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}

// Apply Promotion Result
export interface ApplyPromotionResult {
  applicable: boolean;
  reason?: string;
  discountAmount: number;
  finalAmount: number;
  giftProducts?: {
    productId: number;
    quantity: number;
  }[];
}

// =====================================================
// FILTERS
// =====================================================

// Promotion Filters
export interface PromotionFilters {
  promotionType?: PromotionType | PromotionType[];
  status?: PromotionStatus | PromotionStatus[];
  applicableTo?: ApplicableTo | ApplicableTo[];
  fromDate?: string;
  toDate?: string;
  isRecurring?: boolean;
  hasProducts?: boolean;
}

// =====================================================
// STATISTICS
// =====================================================

// Promotion Statistics
export interface PromotionStatistics {
  totalPromotions: number;
  activePromotions: number;
  pendingPromotions: number;
  expiredPromotions: number;
  expiringPromotions: number; // Promotions expiring in 3-7 days
  totalUsage: number;
  totalDiscountAmount: number; // Total discount given (if tracked)
  averageDiscountPerOrder?: number;
  usageByDay?: UsageByDay[]; // For sparkline chart
}

// Usage by Day (for sparkline)
export interface UsageByDay {
  date: string; // YYYY-MM-DD format
  count: number; // Usage count on that day
}