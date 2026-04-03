import { z } from "zod";

// BOM Material Item Schema
export const bomMaterialItemSchema = z.object({
  id: z.number().optional(), 
  materialId: z.number({}).int("ID nguyên liệu phải là số nguyên").positive("ID nguyên liệu không hợp lệ"),
  materialName: z.string().optional(), 
  materialSku: z.string().optional(), 
  quantity: z.number({}).positive("Số lượng phải lớn hơn 0"),
  unit: z.string({}).min(1, "Đơn vị không được để trống"),
  materialType: z.enum(["raw_material", "packaging"])
    .refine((val) => !!val, { message: 'Loại nguyên liệu không hợp lệ' })
  ,
  notes: z.string().max(255, "Ghi chú không được quá 255 ký tự").optional(),
});

// Create BOM Schema
export const createBomSchema = z.object({
  bomCode: z
    .string({})
    .min(1, "Mã BOM không được để trống")
    .max(50, "Mã BOM không được quá 50 ký tự")
    .regex(
      /^[A-Z0-9-]+$/,
      "Mã BOM chỉ được chứa chữ hoa, số và dấu gạch ngang"
    ),
  finishedProductId: z.number({}).int().positive("ID sản phẩm không hợp lệ"),
  version: z
    .string()
    .max(20, "Phiên bản không được quá 20 ký tự")
    .default("1.0"),
  outputQuantity: z.number({}).positive("Sản lượng đầu ra phải lớn hơn 0"),
  efficiencyRate: z
    .number()
    .min(0, "Tỷ lệ hiệu suất phải từ 0 đến 100")
    .max(100, "Tỷ lệ hiệu suất không được vượt quá 100")
    .default(100),
  productionTime: z
    .number()
    .int("Thời gian sản xuất phải là số nguyên")
    .positive("Thời gian sản xuất phải lớn hơn 0")
    .optional(),
  notes: z.string().max(255, "Ghi chú không được quá 255 ký tự").optional(),
  materials: z
    .array(bomMaterialItemSchema)
    .min(1, "Phải có ít nhất một nguyên liệu")
    .max(100, "Tối đa 100 nguyên liệu cho mỗi BOM"),
});

// Update BOM Schema
export const updateBomSchema = z.object({
  bomCode: z
    .string()
    .min(1, "Mã BOM không được để trống")
    .max(50, "Mã BOM không được quá 50 ký tự")
    .regex(
      /^[A-Z0-9-]+$/,
      "Mã BOM chỉ được chứa chữ hoa, số và dấu gạch ngang"
    ),
  finishedProductId: z.number().int().positive("ID sản phẩm không hợp lệ"),
  version: z.string().max(20, "Phiên bản không được quá 20 ký tự"),
  outputQuantity: z.number().positive("Sản lượng đầu ra phải lớn hơn 0"),
  efficiencyRate: z.number().min(0, "Tỷ lệ hiệu suất phải từ 0 đến 100").max(100, "Tỷ lệ hiệu suất không được vượt quá 100"),
  productionTime: z
    .number()
    .int()
    .positive()
    .optional(),
  notes: z.string().max(255, "Ghi chú không được quá 255 ký tự").optional(),
  materials: z.array(bomMaterialItemSchema).min(1, "Phải có ít nhất một nguyên liệu").max(100, "Tối đa 100 nguyên liệu cho mỗi BOM"),
});

// Calculate Materials Schema
export const calculateMaterialsSchema = z.object({
  bomId: z.number({}).int().positive("ID BOM không hợp lệ"),
  productionQuantity: z.number({}).positive("Số lượng sản xuất phải lớn hơn 0"),
});

// Approve BOM Schema
export const approveBomSchema = z.object({
  notes: z.string().max(500, "Ghi chú không được quá 500 ký tự").optional(),
});

// Export types
export type BomMaterialItemFormData = z.infer<typeof bomMaterialItemSchema>;
export type CreateBomFormData = z.infer<typeof createBomSchema>;
export type UpdateBomFormData = z.infer<typeof updateBomSchema>;
export type CalculateMaterialsFormData = z.infer<typeof calculateMaterialsSchema>;
export type ApproveBomFormData = z.infer<typeof approveBomSchema>;
