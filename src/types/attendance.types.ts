import type { BaseEntity } from "./common.types";
import { User } from "./user.types";

// Attendance Status
export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "leave"
  | "work_from_home";

// Leave Type
export type LeaveType = "none" | "annual" | "sick" | "unpaid" | "other";

export interface Attendance extends BaseEntity {
  userId: number;
  user?: User;
  date: string; // DATE
  checkInTime?: string; // TIME
  checkOutTime?: string; // TIME
  workHours?: number; // DECIMAL(5,2) - Generated field
  overtimeHours?: number;
  status: AttendanceStatus;
  leaveType: LeaveType;
  checkInLocation?: string;
  checkOutLocation?: string;
  approvedBy?: number;
  approver?: User;
  approvedAt?: string;
  notes?: string;
}

export interface CheckInDto {
  location?: string; 
  notes?: string;
}

export interface CheckOutDto {
  location?: string; // GPS location
  notes?: string;
}

export interface RequestLeaveDto {
  date: string;
  leaveType: Exclude<LeaveType, "none">;
  notes?: string;
}

export interface UpdateAttendanceDto {
  checkInTime?: string;
  checkOutTime?: string;
  overtimeHours?: number;
  status?: AttendanceStatus;
  leaveType?: LeaveType;
  notes?: string;
}

export interface ApproveLeaveDto {
  approved: boolean;
  notes?: string;
}

export interface AttendanceFilters {
  userId?: number;
  fromDate?: string;
  toDate?: string;
  status?: AttendanceStatus;
  leaveType?: LeaveType;
  month?: string; // YYYY-MM
  year?: number;
}

export interface AttendanceStatistics {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  workFromHomeDays: number;
  totalWorkHours: number;
  averageWorkHours: number;
  overtimeHours: number;
}

export interface MonthlyReport {
  userId: number;
  user: User;
  month: string; // YYYY-MM
  statistics: AttendanceStatistics;
  attendances: Attendance[];
}

export interface TodayAttendanceStatus {
  hasCheckedIn: boolean;
  hasCheckedOut: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  workHours?: number;
  status: AttendanceStatus;
}

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Có mặt",
  absent: "Vắng mặt",
  late: "Đi muộn",
  leave: "Nghỉ phép",
  work_from_home: "WFH",
};

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  none: "Không phải nghỉ",
  annual: "Nghỉ phép năm",
  sick: "Nghỉ ốm",
  unpaid: "Nghỉ không lương",
  other: "Khác",
};

export const WORK_CONFIG = {
  STANDARD_HOURS: 8,
  LATE_THRESHOLD_MINUTES: 15, 
  STANDARD_CHECK_IN: "08:00:00",
  STANDARD_CHECK_OUT: "17:00:00",
};
