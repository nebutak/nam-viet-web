import { z } from "zod";

// Purchase Order Detail Schema
const purchaseOrderDetailSchema = z.object({
  productId: z.number().int().positive("Vui lòng chọn sản phẩm"),
  quantity: z.number().positive("Số lượng phải > 0"),
  unitPrice: z.number().nonnegative("Giá phải >= 0"),
  notes: z.string().optional(),
});

// Create Purchase Order Schema
export const createPurchaseOrderSchema = z.object({
  supplierId: z.number().int().positive("Vui lòng chọn nhà cung cấp"),
  warehouseId: z.number().int().positive("Vui lòng chọn kho"),
  orderDate: z.string().min(1, "Vui lòng chọn ngày đặt hàng"),
  expectedDeliveryDate: z.string().optional(),
  taxRate: z.number().min(0).max(100, "Thuế suất phải từ 0-100").default(0),
  notes: z.string().optional(),
  details: z
    .array(purchaseOrderDetailSchema)
    .min(1, "Phải thêm ít nhất 1 sản phẩm"),
});

// Update Purchase Order Schema (same as create but details can be updated)
export const updatePurchaseOrderSchema = z.object({
  supplierId: z.number().int().positive("Vui lòng chọn nhà cung cấp").optional(),
  warehouseId: z.number().int().positive("Vui lòng chọn kho").optional(),
  orderDate: z.string().min(1, "Vui lòng chọn ngày đặt hàng").optional(),
  expectedDeliveryDate: z.string().optional(),
  taxRate: z.number().min(0).max(100, "Thuế suất phải từ 0-100").default(0),
  notes: z.string().optional(),
  details: z
    .array(
      z.object({
        id: z.number().int().positive().optional(), // For existing details
        productId: z.number().int().positive("Vui lòng chọn sản phẩm"),
        quantity: z.number().positive("Số lượng phải > 0"),
        unitPrice: z.number().nonnegative("Giá phải >= 0"),
        notes: z.string().optional(),
      })
    )
    .min(1, "Phải thêm ít nhất 1 sản phẩm")
    .optional(),
});

// Receive Purchase Order Schema (includes batch and expiry for stock transaction)
export const receivePurchaseOrderSchema = z.object({
  id: z.number().int().positive("Vui lòng chọn đơn hàng"),
  notes: z.string().optional(),
  details: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().positive("Số lượng phải > 0"),
        unitPrice: z.number().nonnegative("Giá phải >= 0"),
        batchNumber: z.string().optional(),
        expiryDate: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .min(1, "Phải thêm ít nhất 1 sản phẩm")
    .optional(),
});

export const purchaseOrderQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'received', 'cancelled']).optional(),
  supplierId: z.number().optional(),
  warehouseId: z.number().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  sortBy: z
    .string()
    .optional(),
  sortOrder: z.string().optional(),
})

// Export types
export type purchaseOrderDetailSchemaType = z.infer<typeof purchaseOrderDetailSchema>;
export type CreatePurchaseOrderFormData = z.infer<typeof createPurchaseOrderSchema>;
export type UpdatePurchaseOrderFormData = z.infer<typeof updatePurchaseOrderSchema>;
export type ReceivePurchaseOrderFormData = z.infer<typeof receivePurchaseOrderSchema>;
export type PurchaseOrderFilters = z.infer<typeof purchaseOrderQuerySchema>;