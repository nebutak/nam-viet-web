import { z } from "zod";

export const warehouseSchema = z.object({
  warehouseCode: z
    .string()
    .min(1, "Mã kho là bắt buộc!")
    .max(50, "Mã kho không được quá 50 ký tự")
    .regex(/^[A-Z0-9-]+$/, "Mã kho chỉ chứa chữ in hoa, số và dấu gạch ngang"),
  warehouseName: z
    .string()
    .min(1, "Tên kho là bắt buộc!")
    .max(200, "Tên kho không được quá 200 ký tự"),
  warehouseType: z
    .string()
    .min(1, "Vui lòng chọn loại kho!")
    .refine(
      val => ["raw_material", "packaging", "finished_product", "goods"].includes(val),
      { message: "Loại kho không hợp lệ!" }
    ),
  address: z.string().max(255, "Địa chỉ không được quá 255 ký tự").optional(),
  city: z.string().max(100, "Thành phố không được quá 100 ký tự").optional(),
  region: z.string().max(100, "Khu vực không được quá 100 ký tự").optional(),
  description: z.string().max(255, "Mô tả không được quá 255 ký tự").optional(),
  managerId: z.number().int().positive("Quản lý kho không hợp lệ").optional(),
  capacity: z
    .preprocess(
      val => {
        if(val === "" || val === null || val === undefined || Number.isNaN(val)) {
          return undefined;
        }
        return Number(val);
      },
      z.number().positive("Sức chứa phải lớn hơn 0").optional()
    ),
  status: z.enum(["active", "inactive"]).optional().refine(
    val => val === undefined || ['active', 'inactive'].includes(val), {
        message: 'Trạng thái không hợp lệ'
    }
  ),
});

export const updateWarehouseSchema = warehouseSchema.partial();

export type WarehouseFormData = z.infer<typeof warehouseSchema>;
export type UpdateWarehouseFormData = z.infer<typeof updateWarehouseSchema>;
