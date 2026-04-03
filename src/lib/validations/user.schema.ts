import { z } from "zod";

// Gender Enum
export const genderEnum = z.enum(["male", "female", "other"]);

// User Status Enum
export const userStatusEnum = z.enum(["active", "inactive", "locked"]);

// Create User Schema
export const createUserSchema = z.object({
  employeeCode: z
    .string()
    .min(1, "Mã nhân viên là bắt buộc")
    .max(50, "Mã nhân viên không được quá 50 ký tự")
    .regex(
      /^[A-Z0-9-]+$/,
      "Mã nhân viên chỉ được chứa chữ in hoa, số và dấu gạch ngang"
    ),
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ")
    .max(100, "Email không được quá 100 ký tự"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(100, "Mật khẩu không được quá 100 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải chứa chữ thường, chữ hoa và số"
    ),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  fullName: z
    .string()
    .min(1, "Họ tên là bắt buộc")
    .max(200, "Họ tên không được quá 200 ký tự")
    .regex(/^[\p{L}\s]+$/u, "Họ tên chỉ được chứa chữ cái và khoảng trắng"),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
  address: z.string().max(255, "Địa chỉ không được quá 255 ký tự").optional(),
  cccd: z
    .string()
    .max(20, "CCCD không được quá 20 ký tự")
    .optional()
    .or(z.literal("")),
  issuedAt: z.string().optional(),
  issuedBy: z
    .string()
    .max(100, "Nơi cấp không được quá 100 ký tự")
    .optional()
    .or(z.literal("")),
  gender: genderEnum.optional(),
  dateOfBirth: z.string().optional(),
  roleId: z.number({}).int().positive("Vui lòng chọn vai trò"),
  warehouseId: z.number().int().positive().optional(),
  status: userStatusEnum.default("active"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});


// Update User Schema
export const updateUserSchema = z.object({
  email: z
    .string()
    .email("Email không hợp lệ")
    .max(100, "Email không được quá 100 ký tự")
    .optional(),
  fullName: z
    .string()
    .min(1, "Họ tên là bắt buộc")
    .max(200, "Họ tên không được quá 200 ký tự")
    .regex(/^[\p{L}\s]+$/u, "Họ tên chỉ được chứa chữ cái và khoảng trắng")
    .optional(),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
  address: z.string().max(255, "Địa chỉ không được quá 255 ký tự").optional(),
  cccd: z
    .string()
    .max(20, "CCCD không được quá 20 ký tự")
    .optional()
    .or(z.literal("")),
  issuedAt: z.string().optional(),
  issuedBy: z
    .string()
    .max(100, "Nơi cấp không được quá 100 ký tự")
    .optional()
    .or(z.literal("")),
  gender: genderEnum.optional(),
  dateOfBirth: z.string().optional(),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(100, "Mật khẩu không được quá 100 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải chứa chữ thường, chữ hoa và số"
    )
    .optional()
    .or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
  roleId: z.number().int().positive().optional(),
  warehouseId: z.number().int().positive().optional(),
  status: userStatusEnum.optional(),
}).refine(
  (data) => {
    if (data.password && data.password.trim() !== "") {
      return data.password === data.confirmPassword;
    }
    return true;
  },
  {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  }
);

// User Filter Schema
export const userFilterSchema = z.object({
  search: z.string().optional(),
  roleId: z.number().int().positive().optional(),
  warehouseId: z.number().int().positive().optional(),
  status: userStatusEnum.optional(),
  gender: genderEnum.optional(),
});

export type UserFilterFormData = z.infer<typeof userFilterSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
