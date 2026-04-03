// ------------------
// COMMON TYPES      
// ------------------

// Status Types
export type StatusCommon = "active" | "inactive";
export type UserStatus = "active" | "inactive" | "locked";

// Gender
export type Gender = 'male' | 'female' | 'other';

// API Response Structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  timestamp?: string;
}

// API Error Structure
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ValidationError[];
    timestamp?: string;
    path?: string;
  };
}

// Validation Error
export interface ValidationError {
  field: string;
  message: string;
}

// Pagination Meta
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Paginated Response Interface
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Pagination Params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

// Base Entity Interface
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// Select Option (cho dropdowns, selects)
export interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
}

// File Upload
export interface UploadedFile {
  id: number;
  url: string;
  filename: string;
  size: number;
  mimetype: string;
  uploaded_at: string;
}

// Table Column Definition
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
}

// Filter Config
export interface FilterConfig {
  field: string;
  operator: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "like" | "in" | "between";
  value: any;
}

// Date Range
export interface DateRange {
  startDate: string | Date;
  endDate: string | Date;
}

// Address
export interface Address {
  street?: string;
  ward?: string;
  district?: string;
  city: string;
  country?: string;
  zipCode?: string;
}

// Contact Info
export interface ContactInfo {
  phone?: string;
  email?: string;
  fax?: string;
  website?: string;
}

// Price Info
export interface PriceInfo {
  amount: number;
  currency: string;
  taxIncluded?: boolean;
}

// Money Amount (sử dụng với dinero.js)
export interface MoneyAmount {
  amount: number;
  currency: string;
  precision?: number;
}

