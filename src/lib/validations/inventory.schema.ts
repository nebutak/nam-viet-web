import { z } from "zod";

// Stock Transaction Schema
export const stockTransactionSchema = z.object({
  transaction_type: z.enum(["import", "export", "transfer", "disposal", "stocktake"])
    .refine((val) => !!val, { message: "Loại giao dịch là bắt buộc" })
  ,
  warehouse_id: z.number().int().positive("Vui lòng chọn kho").optional(),
  source_warehouse_id: z
    .number()
    .int()
    .positive("Vui lòng chọn kho nguồn")
    .optional(),
  destination_warehouse_id: z
    .number()
    .int()
    .positive("Vui lòng chọn kho đích")
    .optional(),
  reference_type: z.string().max(50).optional(),
  reference_id: z.number().int().positive().optional(),
  reason: z.string().max(255, "Lý do không được quá 255 ký tự").optional(),
  notes: z.string().max(500, "Ghi chú không được quá 500 ký tự").optional(),
  details: z
    .array(
      z.object({
        product_id: z.number().int().positive("Sản phẩm không hợp lệ"),
        quantity: z.number().positive("Số lượng phải lớn hơn 0"),
        unit_price: z.number().min(0, "Đơn giá không được âm").optional(),
        batch_number: z.string().max(50).optional(),
        expiry_date: z.string().optional(),
        notes: z.string().max(255).optional(),
      })
    )
    .min(1, "Giao dịch phải có ít nhất 1 sản phẩm"),
});

export type StockTransactionFormData = z.infer<typeof stockTransactionSchema>;

// Stock Transaction Validation dựa theo type
export const stockTransactionSchemaWithValidation = stockTransactionSchema.superRefine(
  (data, ctx) => {
    // Import: cần warehouse_id
    if (data.transaction_type === "import" && !data.warehouse_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nhập kho cần chọn kho đích",
        path: ["warehouse_id"],
      });
    }

    // Export: cần warehouse_id
    if (data.transaction_type === "export" && !data.warehouse_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Xuất kho cần chọn kho nguồn",
        path: ["warehouse_id"],
      });
    }

    // Transfer: cần cả source và destination
    if (data.transaction_type === "transfer") {
      if (!data.source_warehouse_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Chuyển kho cần chọn kho nguồn",
          path: ["source_warehouse_id"],
        });
      }
      if (!data.destination_warehouse_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Chuyển kho cần chọn kho đích",
          path: ["destination_warehouse_id"],
        });
      }
      if (
        data.source_warehouse_id &&
        data.destination_warehouse_id &&
        data.source_warehouse_id === data.destination_warehouse_id
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Kho nguồn và kho đích không được trùng nhau",
          path: ["destination_warehouse_id"],
        });
      }
    }

    // Disposal: cần warehouse_id và reason
    if (data.transaction_type === "disposal") {
      if (!data.warehouse_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Xuất hủy cần chọn kho",
          path: ["warehouse_id"],
        });
      }
      if (!data.reason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Xuất hủy cần nhập lý do",
          path: ["reason"],
        });
      }
    }
  }
);

// Inventory Adjustment Schema
export const inventoryAdjustmentSchema = z.object({
  warehouse_id: z.number().int().positive("Vui lòng chọn kho"),
  product_id: z.number().int().positive("Vui lòng chọn sản phẩm"),
  quantity_change: z.number().refine((val) => val !== 0, {
    message: "Số lượng thay đổi không được bằng 0",
  }),
  reason: z
    .string()
    .min(1, "Lý do là bắt buộc")
    .max(255, "Lý do không được quá 255 ký tự"),
  notes: z.string().max(500, "Ghi chú không được quá 500 ký tự").optional(),
});

export type InventoryAdjustmentFormData = z.infer<typeof inventoryAdjustmentSchema>;

// Inventory Filter Schema
export const inventoryFilterSchema = z.object({
  warehouse_id: z.number().int().positive().optional(),
  warehouse_type: z
    .enum(["raw_material", "packaging", "finished_product", "goods"])
    .optional(),
  product_id: z.number().int().positive().optional(),
  product_type: z
    .enum(["raw_material", "packaging", "finished_product", "goods"])
    .optional(),
  category_id: z.number().int().positive().optional(),
  low_stock: z.boolean().optional(),
  out_of_stock: z.boolean().optional(),
});

export type InventoryFilterFormData = z.infer<typeof inventoryFilterSchema>;
