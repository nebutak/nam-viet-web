import { z } from "zod";

export const supplierSchema = z.object({
  supplierCode: z
    .string()
    .min(1, "Mã nhà cung cấp là bắt buộc")
    .max(50, "Mã nhà cung cấp không được quá 50 ký tự"),
  supplierName: z
    .string()
    .min(1, "Tên nhà cung cấp là bắt buộc")
    .max(200, "Tên nhà cung cấp không được quá 200 ký tự"),
  supplierType: z.enum(["local", "foreign"])
    .refine((val) => val, { message: "Loại nhà cung cấp là bắt buộc" }),
  contactName: z.string().max(100).optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{10,11}$/.test(val),
      "Số điện thoại không hợp lệ"
    ),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().max(255).optional(),
  taxCode: z.string().max(50).optional(),
  paymentTerms: z.string().max(255).optional(),
  notes: z.string().max(500).optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const filterSupplierSchema = z.object({
  status: z.enum(["active", "inactive"]).optional(),
  supplierType: z.enum(["local", "foreign"]).optional(),
  search: z.string().max(100).optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
export type SupplierFilterData = z.infer<typeof filterSupplierSchema>;