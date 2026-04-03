import { z } from "zod";

// Leave Type Enum
export const leaveTypeEnum = z.enum(["none", "annual", "sick", "unpaid", "other"]);

// Attendance Status Enum
export const attendanceStatusEnum = z.enum([
  "present",
  "absent",
  "late",
  "leave",
  "work_from_home",
]);

// Check In Schema
export const checkInSchema = z.object({
  location: z.string().max(255).optional(),
  notes: z.string().max(255).optional(),
});

// Check Out Schema
export const checkOutSchema = z.object({
  location: z.string().max(255).optional(),
  notes: z.string().max(255).optional(),
});

// Request Leave Schema
export const requestLeaveSchema = z.object({
  date: z.string().min(1, "Vui lòng chọn ngày nghỉ"),
  leaveType: z.enum(["annual", "sick", "unpaid", "other"])
    .refine((val) => !!val, { message: "Vui lòng chọn loại nghi" })
  ,
  notes: z.string().max(255, "Ghi chú không được quá 255 ký tự").optional(),
});

// Update Attendance Schema (Admin)
export const updateAttendanceSchema = z.object({
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Định dạng giờ không hợp lệ (HH:MM:SS)").optional(),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Định dạng giờ không hợp lệ (HH:MM:SS)").optional(),
  overtimeHours: z.number().min(0, "Giờ tăng ca phải >= 0").max(24, "Giờ tăng ca không hợp lệ").optional(),
  status: attendanceStatusEnum.optional(),
  leaveType: leaveTypeEnum.optional(),
  notes: z.string().max(255, "Ghi chú không được quá 255 ký tự").optional(),
});

// Approve Leave Schema
export const approveLeaveSchema = z.object({
  approved: z.boolean(),
  notes: z.string().max(255, "Ghi chú không được quá 255 ký tự").optional(),
});

// Attendance Filter Schema
export const attendanceFilterSchema = z.object({
  userId: z.number().int().positive().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  status: attendanceStatusEnum.optional(),
  leaveType: leaveTypeEnum.optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Định dạng tháng không hợp lệ (YYYY-MM)").optional(),
});

export type CheckInFormData = z.infer<typeof checkInSchema>;
export type AttendanceFilterFormData = z.infer<typeof attendanceFilterSchema>;
export type CheckOutFormData = z.infer<typeof checkOutSchema>;
export type RequestLeaveFormData = z.infer<typeof requestLeaveSchema>;
export type UpdateAttendanceFormData = z.infer<typeof updateAttendanceSchema>;
export type ApproveLeaveFormData = z.infer<typeof approveLeaveSchema>;