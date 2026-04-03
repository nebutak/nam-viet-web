import { z } from "zod";

export const createImportSchema = z.object({
  warehouseId: z.number().int().positive("Vui lòng chọn kho"),
  referenceType: z.string().max(50).optional(),
  referenceId: z.number().int().positive().optional(),
  reason: z.string().optional().default("Nhập từ NCC"),
  notes: z.string().optional(),
  details: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().positive("Số lượng phải > 0"),
        unitPrice: z.number().nonnegative("Giá phải >= 0").optional(),
        batchNumber: z.string().optional(),
        expiryDate: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .min(1, "Phải thêm ít nhất 1 sản phẩm"),
});

export const createExportSchema = z.object({
  warehouseId: z.number().int().positive("Vui lòng chọn kho"),
  referenceType: z.string().max(50).optional(),
  referenceId: z.number().int().positive().optional(),
  reason: z.string().optional().default("Xuất bán"),
  notes: z.string().optional(),
  details: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().positive("Số lượng phải > 0"),
        unitPrice: z.number().nonnegative().optional(),
        batchNumber: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .min(1, "Phải thêm ít nhất 1 sản phẩm"),
});

export const createTransferSchema = z
  .object({
    sourceWarehouseId: z.number().int().positive("Vui lòng chọn kho nguồn"),
    destinationWarehouseId: z.number().int().positive("Vui lòng chọn kho đích"),
    referenceType: z.string().max(50).optional(),
    referenceId: z.number().int().positive().optional(),
    reason: z.string().optional().default("Chuyển kho"),
    notes: z.string().optional(),
    details: z
      .array(
        z.object({
          productId: z.number().int().positive(),
          quantity: z.number().positive("Số lượng phải > 0"),
          unitPrice: z.number().nonnegative().optional(),
          batchNumber: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .min(1, "Phải thêm ít nhất 1 sản phẩm"),
  })
  .refine((data) => data.sourceWarehouseId !== data.destinationWarehouseId, {
    message: "Kho nguồn và kho đích không được trùng nhau",
    path: ["destinationWarehouseId"],
  });

export type ImportFormData = z.infer<typeof createImportSchema>;
export type ExportFormData = z.infer<typeof createExportSchema>;
export type TransferFormData = z.infer<typeof createTransferSchema>;