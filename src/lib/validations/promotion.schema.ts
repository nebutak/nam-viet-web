import { z } from "zod";

// Promotion Type Enum
export const promotionTypeEnum = z.enum([
  "percent_discount",
  "fixed_discount",
  "buy_x_get_y",
  "gift",
]);

// Applicable To Enum
export const applicableToEnum = z.enum([
  "all",
  "category",
  "product_group",
  "specific_product",
  "customer_group",
]);

// Promotion Product Schema
export const promotionProductSchema = z.object({
  // productId: z.number().int().positive("Vui lòng chọn sản phẩm"),
  productId: z.union([z.literal(0), z.number().int().positive()]),
  discountValueOverride: z.number().min(0).optional(),
  minQuantity: z.number().int().min(1).optional(),
  giftProductId: z.number().int().positive().optional(),
  giftQuantity: z.number().int().min(1).optional(),
  note: z.string().max(255).optional(),
});

// Promotion Conditions Schema (flexible JSON)
export const promotionConditionsSchema = z.any().optional();

// Create Promotion Schema
export const createPromotionSchema = z.object({
  promotionCode: z
    .string()
    .min(1, "Vui lòng nhập mã khuyến mãi")
    .max(50, "Mã không được quá 50 ký tự"),
  promotionName: z
    .string()
    .min(1, "Vui lòng nhập tên khuyến mãi")
    .max(200, "Tên không được quá 200 ký tự"),
  promotionType: z.enum([
    "percent_discount",
    "fixed_discount",
    "buy_x_get_y",
    "gift",
  ]),
  discountValue: z.number().min(0, "Giá trị giảm phải >= 0").optional(),
  maxDiscountValue: z.number().optional(),
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
  isRecurring: z.boolean().optional(),
  applicableTo: z.enum([
    "all",
    "category",
    "product_group",
    "specific_product",
    "customer_group",
  ]),
  minOrderValue: z.number().min(0).optional(),
  minQuantity: z.number().int().min(0).optional(),
  quantityLimit: z.number().int().positive().optional(),
  conditions: z.any().optional(),
  products: z
    .array(
      z.object({
        productId: z.union([z.literal(0), z.number().int().positive()]),
        discountValueOverride: z.number().optional(),
        minQuantity: z.number().int().min(1).optional(),
        giftProductId: z.number().int().positive().optional(),
        giftQuantity: z.number().int().min(0).optional(),
        note: z.string().optional(),
      })
    )
    .optional(),
});

// Update Promotion Schema
export const updatePromotionSchema = z
  .object({
    promotionName: z
      .string()
      .min(1, "Tên khuyến mãi là bắt buộc")
      .max(200, "Tên không được quá 200 ký tự")
      .optional(),
    discountValue: z.number().min(0, "Giá trị giảm phải >= 0").optional(),
    maxDiscountValue: z.number().min(0).optional(),
    startDate: z.string().min(1, "Ngày bắt đầu là bắt buộc").optional(),
    endDate: z.string().min(1, "Ngày kết thúc là bắt buộc").optional(),
    isRecurring: z.boolean().optional(),
    applicableTo: applicableToEnum.optional(),
    minOrderValue: z.number().min(0).optional(),
    minQuantity: z.number().int().min(0).optional(),
    quantityLimit: z.number().int().positive().optional(),
    conditions: promotionConditionsSchema,
    products: z.array(promotionProductSchema).optional(),
  })
  .refine(
    (data) => {
      // Validate date range if both provided
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return start <= end;
      }
      return true;
    },
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["endDate"],
    }
  );

// Promotion Filter Schema
export const promotionFilterSchema = z.object({
  promotionType: promotionTypeEnum.optional(),
  status: z
    .enum(["pending", "active", "expired", "cancelled"])
    .optional(),
  applicableTo: applicableToEnum.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
  isRecurring: z.boolean().optional(),
  hasProducts: z.boolean().optional(),
});

export type CreatePromotionFormData = z.infer<typeof createPromotionSchema>;
export type UpdatePromotionFormData = z.infer<typeof updatePromotionSchema>;
export type PromotionFilterFormData = z.infer<typeof promotionFilterSchema>;