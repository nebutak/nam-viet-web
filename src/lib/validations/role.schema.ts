import { z } from "zod";

// Role Status Enum
export const roleStatusEnum = z.enum(["active", "inactive"]);

// Create Role Schema
export const createRoleSchema = z.object({
  roleKey: z
    .string()
    .min(1, "Mã vai trò là bắt buộc")
    .max(50, "Mã vai trò không được quá 50 ký tự")
    .regex(
      /^[a-z_]+$/,
      "Mã vai trò chỉ được chứa chữ thường và dấu gạch dưới"
    ),
  roleName: z
    .string()
    .min(1, "Tên vai trò là bắt buộc")
    .max(100, "Tên vai trò không được quá 100 ký tự"),
  description: z
    .string()
    .max(500, "Mô tả không được quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  status: roleStatusEnum.default("active"),
});

// Update Role Schema
export const updateRoleSchema = z.object({
  roleKey: z
    .string()
    .min(1, "Mã vai trò là bắt buộc")
    .max(50, "Mã vai trò không được quá 50 ký tự")
    .regex(
      /^[a-z_]+$/,
      "Mã vai trò chỉ được chứa chữ thường và dấu gạch dưới"
    )
    .optional(),
  roleName: z
    .string()
    .min(1, "Tên vai trò là bắt buộc")
    .max(100, "Tên vai trò không được quá 100 ký tự")
    .optional(),
  description: z
    .string()
    .max(500, "Mô tả không được quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  status: roleStatusEnum.optional(),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
