import { z } from "zod";

export const calculateSalarySchema = z.object({
  userId: z
    .number({})
    .min(1, "Vui lòng chọn nhân viên"),
  month: z
    .string({})
    .regex(/^\d{6}$/, "Tháng phải có định dạng YYYYMM (ví dụ: 202501)"),
  basicSalary: z
    .number({})
    .min(0, "Lương cơ bản phải >= 0")
    .optional(),
  allowance: z
    .number({})
    .min(0, "Phụ cấp phải >= 0")
    .optional(),
  bonus: z
    .number({})
    .min(0, "Thưởng phải >= 0")
    .optional(),
  advance: z
    .number({})
    .min(0, "Tạm ứng phải >= 0")
    .optional(),
  notes: z
    .string()
    .max(255, "Ghi chú không được vượt quá 255 ký tự")
    .optional(),
});

export const updateSalarySchema = z.object({
  basicSalary: z
    .number({})
    .min(0, "Lương cơ bản phải >= 0")
    .optional(),
  allowance: z
    .number({})
    .min(0, "Phụ cấp phải >= 0")
    .optional(),
  overtimePay: z
    .number({})
    .min(0, "Lương làm thêm phải >= 0")
    .optional(),
  bonus: z
    .number({})
    .min(0, "Thưởng phải >= 0")
    .optional(),
  commission: z
    .number({})
    .min(0, "Hoa hồng phải >= 0")
    .optional(),
  deduction: z
    .number({})
    .min(0, "Khấu trừ phải >= 0")
    .optional(),
  advance: z
    .number({})
    .min(0, "Tạm ứng phải >= 0")
    .optional(),
  notes: z
    .string()
    .max(255, "Ghi chú không được vượt quá 255 ký tự")
    .optional(),
});

//----------------------------------------------
// Approve Salary Schema
//----------------------------------------------
export const approveSalarySchema = z.object({
  notes: z
    .string()
    .max(500, "Ghi chú không được vượt quá 500 ký tự")
    .optional(),
});


//----------------------------------------------
// Pay Salary Schema
//----------------------------------------------
export const paySalarySchema = z.object({
  paymentDate: z
    .string({})
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Ngày thanh toán không hợp lệ",
    }),
  paymentMethod: z.enum(["cash", "transfer"])
    .refine((val) => !!val, { message: "Phương thức thanh toán la bát buộc" })
  ,
  notes: z
    .string()
    .max(500, "Ghi chú không được vượt quá 500 ký tự")
    .optional(),
});

//----------------------------------------------
// Salary Filters Schema
//----------------------------------------------
export const salaryFilterSchema = z.object({
  userId: z.number().optional(),
  month: z.string().regex(/^\d{6}$/).optional(),
  status: z.enum(["pending", "approved", "paid"]).optional(),
  fromMonth: z.string().regex(/^\d{6}$/).optional(),
  toMonth: z.string().regex(/^\d{6}$/).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type CalculateSalaryFormValues = z.infer<typeof calculateSalarySchema>;
export type SalaryFilterFormValues = z.infer<typeof salaryFilterSchema>;
export type UpdateSalaryFormValues = z.infer<typeof updateSalarySchema>;
export type ApproveSalaryFormValues = z.infer<typeof approveSalarySchema>;
export type PaySalaryFormValues = z.infer<typeof paySalarySchema>;