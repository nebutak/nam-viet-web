// USER, ROLE, PERMISSION TYPES

import type { BaseEntity, Gender, StatusCommon, UserStatus } from "./common.types";

// ------------------
// ROLES             
// ------------------
export interface Role extends BaseEntity {
  roleKey: string;
  roleName: string;
  description?: string;
  status: StatusCommon;
  permissions?: Permission[];
}

// ------------------
// PERMISSIONS       
// ------------------
export interface Permission extends BaseEntity {
  permissionKey: string;
  permissionName: string;
  description?: string;
  module: string;
}

// ------------------
// USERS             
// ------------------
export interface User extends BaseEntity {
  employeeCode: string;
  email: string;
  passwordHash?: string;
  fullName: string;
  cccd?: string;
  issuedAt?: string;
  issuedBy?: string;
  phone?: string;
  address?: string;
  gender?: Gender;
  dateOfBirth?: string;
  avatarUrl?: string;
  roleId: number;
  role?: Role;
  warehouseId?: number;
  warehouse?: WarehouseMinimal;
  canEditProfile?: boolean;
  status: UserStatus;
  createdBy?: number;
  updatedBy?: number;
  lastLogin?: string;
}

// Warehouse (minimal for user relation)
export interface WarehouseMinimal {
  id: number;
  warehouseCode: string;
  warehouseName: string;
  warehouseType: "raw_material" | "packaging" | "finished_product" | "goods";
}

// User Create DTO
export interface CreateUserDto {
  employee_code: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  gender?: "male" | "female" | "other";
  date_of_birth?: string;
  role_id: number;
  warehouse_id?: number;
  status?: UserStatus;
}

// User Update DTO
export interface UpdateUserDto {
  email?: string;
  full_name?: string;
  cccd?: string;
  issued_at?: string;
  issued_by?: string;
  phone?: string;
  address?: string;
  gender?: "male" | "female" | "other";
  date_of_birth?: string;
  role_id?: number;
  warehouse_id?: number;
  status?: UserStatus;
}

// Update User Status DTO
export interface UpdateUserStatusDto {
  status: UserStatus;
}

// Upload Avatar Response
export interface UploadAvatarResponse {
  avatarUrl: string;
}

// User Filters
export interface UserFilters {
  roleId?: number;
  warehouseId?: number;
  status?: UserStatus;
  gender?: Gender;
}

// Change Password DTO
export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// Login Credentials
export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

// Login Response (with OTP)
export interface LoginResponse {
  user: AuthUser;
  tokens: {
    accessToken: string;
    expiresIn: number;
    // ❌ refreshToken không có ở đây nữa (lưu trong HttpOnly cookie)
  };
}

// OTP Verification Response (trả về sau khi verify OTP)
export interface OTPVerificationResponse {
  user: AuthUser;
  tokens: {
    accessToken: string;
    expiresIn: number;
  };
}

// OTP Required Response
export interface OTPRequiredResponse {
  requireOTP: true;
  email: string;
  expiresIn: number;
  code?: string; // Only in development
}

// Verify OTP Request
export interface VerifyOTPRequest {
  email: string;
  code: string;
}

// Resend OTP Response
export interface ResendOTPResponse {
  expiresIn: number;
}

// Auth User (User hiện tại đang login)
export interface AuthUser extends User {
  permissions: string[];
}

// Activity Log
export interface ActivityLog extends BaseEntity {
  user_id: number;
  user?: User;
  action: "create" | "update" | "delete" | "approve";
  table_name: string;
  record_id: number;
  old_value?: any;
  new_value?: any;
  reason?: string;
  ip_address?: string;
  user_agent?: string;
  status: "success" | "failure";
}
