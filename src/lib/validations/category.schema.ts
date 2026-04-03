import { z } from "zod";

export const categorySchema = z.object({
  categoryCode: z.string()
    .min(1, "Mã danh mục không được để trống")
    .max(50, "Mã danh mục không được quá 50 ký tự"),
  categoryName: z
    .string()
    .min(1, "Tên danh mục là bắt buộc")
    .max(200, "Tên danh mục không được quá 200 ký tự"),
  slug: z.string()
    .min(1, "Slug không được để trống")
    .max(200, "Slug không được quá 200 ký tự"),
  parentId: z.number().int().positive().optional().nullable(),
  description: z.string().max(500).optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const filterCategoriesSchema = z.object({
  parentId: z.number().int().positive('Invalid parent category ID').nullable().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  search: z.string().trim().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
export type FilterCategoriesData = z.infer<typeof filterCategoriesSchema>;