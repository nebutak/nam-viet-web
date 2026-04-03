import { z } from "zod";

// Create Customer Schema
export const createCustomerSchema = z.object({
  customerCode: z
    .string()
    .min(1, "Mã khách hàng là bắt buộc")
    .max(50, "Mã khách hàng không được quá 50 ký tự")
    .optional(),

  customerName: z
    .string({})
    .min(1, "Tên khách hàng là bắt buộc")
    .max(200, "Tên khách hàng không được quá 200 ký tự"),

  customerType: z.enum(["individual", "company"])
    .refine((val) => !!val, { message: "Loại khách hàng là bắt buộc" })
  ,
  classification: z.enum(["retail", "wholesale", "vip", "distributor"])
    .refine((val) => !!val, { message: "Loại khách hàng là bắt buộc" })
  ,

  gender: z.enum(["male", "female", "other"]).refine((val) => !!val, { message: "Giới tính không hợp lệ" }),

  contactPerson: z
    .string()
    .max(100, "Tên người liên hệ không được quá 100 ký tự")
    .optional(),

  phone: z
    .string({})
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),

  email: z
    .string()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(255, "Địa chỉ không được quá 255 ký tự")
    .optional(),

  province: z
    .string()
    .max(100, "Tỉnh/Thành phố không được quá 100 ký tự")
    .optional(),

  district: z
    .string()
    .max(100, "Quận/Huyện không được quá 100 ký tự")
    .optional(),

  taxCode: z
    .string()
    .max(50, "Mã số thuế không được quá 50 ký tự")
    .optional(),

  cccd: z
    .string()
    .max(20, "CCCD không được quá 20 ký tự")
    .optional()
    .or(z.literal("")),

  issuedAt: z
    .string()
    .optional(),

  issuedBy: z
    .string()
    .max(100, "Nơi cấp không được quá 100 ký tự")
    .optional()
    .or(z.literal("")),

  creditLimit: z
    .number()
    .nonnegative("Hạn mức công nợ phải >= 0")
    .default(0),

  notes: z
    .string()
    .max(255, "Ghi chú không được quá 255 ký tự")
    .optional(),

  rewardPoints: z
    .number()
    .int("Điểm thưởng phải là số nguyên")
    .nonnegative("Điểm thưởng phải >= 0")
    .default(0),

  rewardCode: z
    .string()
    .max(50, "Mã thưởng không được quá 50 ký tự")
    .optional()
    .or(z.literal("")),

  status: z.enum(["active", "inactive", "blacklisted"]).default("active"),
}).refine(
  (data) => {
    // Nếu là company thì taxCode và contactPerson là bắt buộc
    if (data.customerType === "company") {
      if (!data.taxCode) return false;
      if (!data.contactPerson) return false;
    }
    return true;
  },
  {
    message: "Mã số thuế và người liên hệ là bắt buộc đối với công ty",
    path: ["taxCode"],
  }
);

// Update Customer Schema
export const updateCustomerSchema = z.object({
  customerCode: z
    .string()
    .min(1, "Mã khách hàng là bắt buộc")
    .max(50, "Mã khách hàng không được quá 50 ký tự")
    .optional(),

  customerName: z
    .string()
    .min(1, "Tên khách hàng là bắt buộc")
    .max(200, "Tên khách hàng không được quá 200 ký tự")
    .optional(),

  customerType: z.enum(["individual", "company"]).optional(),

  classification: z.enum(["retail", "wholesale", "vip", "distributor"]).optional(),

  gender: z.enum(["male", "female", "other"]).optional(),

  contactPerson: z
    .string()
    .max(100, "Tên người liên hệ không được quá 100 ký tự")
    .optional(),

  phone: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .optional(),

  email: z
    .string()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(255, "Địa chỉ không được quá 255 ký tự")
    .optional(),

  province: z
    .string()
    .max(100, "Tỉnh/Thành phố không được quá 100 ký tự")
    .optional(),

  district: z
    .string()
    .max(100, "Quận/Huyện không được quá 100 ký tự")
    .optional(),

  taxCode: z
    .string()
    .max(50, "Mã số thuế không được quá 50 ký tự")
    .optional(),

  cccd: z
    .string()
    .max(20, "CCCD không được quá 20 ký tự")
    .optional()
    .or(z.literal("")),

  issuedAt: z
    .string()
    .optional(),

  issuedBy: z
    .string()
    .max(100, "Nơi cấp không được quá 100 ký tự")
    .optional()
    .or(z.literal("")),

  creditLimit: z
    .number()
    .nonnegative("Hạn mức công nợ phải >= 0")
    .optional(),

  notes: z
    .string()
    .max(255, "Ghi chú không được quá 255 ký tự")
    .optional(),

  rewardPoints: z
    .number()
    .int("Điểm thưởng phải là số nguyên")
    .nonnegative("Điểm thưởng phải >= 0")
    .optional(),

  rewardCode: z
    .string()
    .max(50, "Mã thưởng không được quá 50 ký tự")
    .optional()
    .or(z.literal("")),

  status: z.enum(["active", "inactive", "blacklisted"]).optional(),
});

// Update Credit Limit Schema
export const updateCreditLimitSchema = z.object({
  creditLimit: z
    .number({})
    .nonnegative("Hạn mức công nợ phải >= 0"),

  reason: z
    .string()
    .max(255, "Lý do không được quá 255 ký tự")
    .optional(),
});

// Update Status Schema
export const updateCustomerStatusSchema = z.object({
  status: z.enum(["active", "inactive", "blacklisted"])
    .refine((val) => val !== "active", "Khách hàng hóa đơn nây khóa, không thị hành chính sách")
  ,
  reason: z
    .string()
    .max(255, "Lý do không được quá 255 ký tự")
    .optional(),
});

// Export types
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type UpdateCreditLimitInput = z.infer<typeof updateCreditLimitSchema>;
export type UpdateCustomerStatusInput = z.infer<typeof updateCustomerStatusSchema>;
