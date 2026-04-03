import { z } from "zod";

// =============================================================================
// 1. SCHEMA CHO HÀNH ĐỘNG SYNC (SINGLE)
// =============================================================================
export const syncDebtSchema = z.object({
  customerId: z.number().int().positive().optional(),
  supplierId: z.number().int().positive().optional(),
  
  // ✅ FIX: Bỏ object { invalid_type_error: ... } đi để tránh lỗi Type
  year: z.number()
    .int("Năm phải là số nguyên")
    .min(2000, "Năm tối thiểu là 2000")
    .max(2100, "Năm tối đa là 2100"),

  notes: z.string().max(500).optional(),

  // Logic assignedUserId giữ nguyên
  assignedUserId: z.number()
    .or(z.nan())
    .optional()
    .transform((val) => {
      if (!val || Number.isNaN(val)) {
        return undefined;
      }
      return val;
    }),

}).refine((data) => data.customerId || data.supplierId, {
  message: "Vui lòng chọn Khách hàng hoặc Nhà cung cấp",
  path: ["customerId"], 
});

// =============================================================================
// 2. SCHEMA CHO HÀNH ĐỘNG BATCH
// =============================================================================
export const syncBatchSchema = z.object({
  // ✅ FIX: Tương tự, bỏ tham số bên trong z.number()
  year: z.number()
    .int("Năm phải là số nguyên")
    .min(2000, "Năm tối thiểu là 2000")
    .max(2100, "Năm tối đa là 2100"),
});

// =============================================================================
// 3. SCHEMA GỬI EMAIL (Giữ nguyên)
// =============================================================================
export const sendDebtEmailSchema = z.object({
  recipientName: z.string().min(1, "Vui lòng nhập tên người nhận"),
  recipientEmail: z.string().email("Email không hợp lệ"),
  message: z.string().optional(),
  cc: z.array(z.string().email()).optional(),
});

// =============================================================================
// 4. EXPORT TYPES
// =============================================================================
export type SyncDebtForm = z.infer<typeof syncDebtSchema>;
export type SyncBatchForm = z.infer<typeof syncBatchSchema>;
export type SendDebtEmailForm = z.infer<typeof sendDebtEmailSchema>;