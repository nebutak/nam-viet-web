import type { BaseEntity, Gender } from "./common.types";
import type { AuthUser } from "./user.types";

// Customer Type
export type CustomerType = "individual" | "company";

// Customer Classification
export type CustomerClassification = "retail" | "wholesale" | "vip" | "distributor";

// Customer Status
export type CustomerStatus = "active" | "inactive" | "blacklisted";

// Debt status
export type DebtStatus = "with-debt" | "no-debt" | "over-limit";

// Customer
export interface Customer extends BaseEntity {
  customerCode: string;
  customerName: string;
  customerType: CustomerType;
  classification: CustomerClassification;
  gender?: Gender;
  contactPerson?: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  address?: string;
  province?: string;
  district?: string;
  taxCode?: string;
  cccd?: string;
  issuedAt?: string;
  issuedBy?: string;
  creditLimit: number;
  currentDebt: number;
  debtUpdatedAt?: string;
  status: CustomerStatus;
  rewardPoints?: number;
  rewardCode?: string;
  notes?: string;
  createdBy?: number;
  creator?: AuthUser;
  updatedBy?: number;
  updater?: AuthUser;
}

// Create Customer DTO
export interface CreateCustomerDto {
  customerName: string;
  customerType: CustomerType;
  classification: CustomerClassification;
  gender?: Gender;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  province?: string;
  district?: string;
  taxCode?: string;
  cccd?: string;
  issuedAt?: string;
  issuedBy?: string;
  creditLimit?: number;
  notes?: string;
  status?: CustomerStatus;
}

// Update Customer DTO
export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

// Update Credit Limit DTO
export interface UpdateCreditLimitDto {
  creditLimit: number;
  reason?: string;
}

// Update Status DTO
export interface UpdateCustomerStatusDto {
  status: CustomerStatus;
  reason?: string;
}

// Customer Filters
export interface CustomerFilters {
  customerType?: CustomerType;
  classification?: CustomerClassification;
  province?: string;
  district?: string;
  status?: CustomerStatus;
  debtStatus?: DebtStatus;
}

// Customer with Debt Info
export interface CustomerWithDebt extends Customer {
  totalOrders?: number;
  totalRevenue?: number;
  lastOrderDate?: string;
  debtPercentage?: number; // (currentDebt / creditLimit) * 100
}

// Customer Debt Info
export interface CustomerDebtInfo {
  customerId: number;
  customerName: string;
  customerCode: string;
  currentDebt: number;
  creditLimit: number;
  availableCredit: number;
  debtPercentage: number;
  isOverLimit: boolean;
  isNearLimit: boolean;
  debtUpdatedAt?: string;
  unpaidOrders: any[];
  totalUnpaidOrders: number;
  totalRevenue: number;
  totalOrders: number;
  totalPaid: number;
}

// Customer Order History
export interface CustomerOrderHistory {
  orders: any[]; // Will be typed properly when SalesOrder is defined
  totalOrders: number;
  totalRevenue: number;
  totalDebt: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Customer Statistics
export interface CustomerStatistics {
  customerId: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];
}

// Card
export interface CustomerCard {
  newThisMonth: number,
  total: number,
  totalDebt: number,
  overLimit: number,
  byClassification: {
    retail: number;
    wholesale: number;
    vip: number;
    distributor: number;
  },
}

// Provinces in Vietnam (for select options)
export const VIETNAM_PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

