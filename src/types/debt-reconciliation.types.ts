import type { User } from "./user.types"; 
// Nếu bạn có type Customer/Supplier riêng thì import, không thì dùng any tạm thời
// import type { Customer } from "./customer.types";

// =============================================================================
// 1. ENUMS & CONSTANTS
// =============================================================================

export type ReconciliationStatus = "paid" | "unpaid";
export type DebtType = 'customer' | 'supplier';

// =============================================================================
// 2. ENTITIES (Dữ liệu hiển thị lên UI)
// =============================================================================

// -----------------------------------------------------------------------------
// 2.1. LIST ITEM (Dùng cho bảng Danh sách)
// -----------------------------------------------------------------------------
export interface DebtListItem {
  // ✅ UPDATE: id có thể là string (virtual-ID) nếu chưa có DebtPeriod
  id: number | string;      
  
  type: DebtType;  // 'customer' | 'supplier'
  objId: number;   // ID gốc của Customer hoặc Supplier
  
  code: string;    // Mã KH/NCC
  name: string;    // Tên hiển thị
  phone?: string;
  avatar?: string;
  location?: string | null;
  
  assignedUser?: User; 

  periodName: string;         // "2026"
  
  // Số liệu tài chính
  openingBalance: number;     // Đầu kỳ
  increasingAmount: number;   // Tăng (Mua hàng)
  
  // ✅ UPDATE: Thêm 2 trường mới cho cột Trả hàng & Điều chỉnh
  returnAmount?: number;      // Trả hàng (-)
  adjustmentAmount?: number;  // Điều chỉnh (+/-)

  decreasingAmount: number;   // Giảm (Thanh toán)
  closingBalance: number;     // Cuối kỳ
  
  status: ReconciliationStatus;
  notes?: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// 2.2. DETAIL PAGE DTO (Dùng cho trang Chi tiết)
// -----------------------------------------------------------------------------

export interface ProductHistoryItem {
    orderId: number;
    orderCode: string;
    date: string;       
    productId: number;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
}

// ✅ UPDATE: Type cho các chứng từ khác
export interface ReturnHistoryItem {
    id: number;
    code: string;
    date: string;
    amount: number;
    note?: string;
}

export interface AdjustmentHistoryItem {
    id: number;
    code: string;
    date: string;
    amount: number;
    type: 'increase' | 'decrease';
    reason?: string;
}

export interface DebtDetailDTO {
    periodName: string;
    hasData: boolean;   
    
    info: {
        id: number;     
        type: DebtType;
        code: string;
        name: string;
        phone?: string;
        email?: string;
        avatar?: string;
        assignedUser?: User;

        // Địa chỉ: Supplier thường chỉ có address string, Customer có thêm province/district
        address?: string;
        province?: string;
        district?: string;
    };

    financials: {
        opening: number;
        increase: number;
        payment: number;  
        
        // ✅ UPDATE: Thêm trường chi tiết tài chính
        returnAmount?: number;
        adjustmentAmount?: number;

        closing: number;
        status: ReconciliationStatus;
    };

    history: {
        orders: any[];          
        payments: any[];        
        products: ProductHistoryItem[]; 
        
        // ✅ UPDATE: Thêm lịch sử trả hàng & điều chỉnh
        returns?: ReturnHistoryItem[];
        adjustments?: AdjustmentHistoryItem[];
    };
}

// =============================================================================
// 3. API PARAMS & PAYLOADS
// =============================================================================

export interface DebtReconciliationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReconciliationStatus;
  year?: number; 
  
  assignedUserId?: number;         
  province?: string;               
  type?: DebtType; 
}

export interface DebtSummary {
  opening: number;
  increase: number;
  payment: number;
  closing: number;
  // Có thể thêm return/adjust vào summary nếu backend tính toán
  returnAmount?: number;
  adjustmentAmount?: number;
}

export interface DebtListResponse {
  data: DebtListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    summary?: DebtSummary; 
  }
}

// Payload cho các hàm Sync (Snap & Full)
export interface SyncDebtPayload {
  customerId?: number;
  supplierId?: number;
  year?: number; 
  notes?: string;
  assignedUserId?: number; 
}

export interface SyncBatchDto {
  year: number;
}

// Payload gửi Email
export interface SendDebtNoticePayload {
  type: DebtType;     
  year?: number;      
  message?: string;
  customEmail?: string; 
}

export interface BackgroundJobResponse {
  success: boolean;
  message: string;
  background: boolean;
  jobType?: string;
}

// =============================================================================
// 4. INTEGRITY CHECK (Kiểm tra sai lệch)
// =============================================================================

export type DiscrepancyType = 'INTERNAL_MATH_ERROR' | 'CROSS_PERIOD_ERROR' | 'MISSING_DATA';
export type IntegritySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM';

export interface Discrepancy {
  type: DiscrepancyType;
  id: number;           
  typeObj: DebtType;    
  name: string;         
  reason: string;
  details: string;
  severity: IntegritySeverity;
}

export interface IntegrityData {
  year: number;
  totalChecked: number;
  discrepanciesCount: number;
  discrepancies: Discrepancy[];
}

export interface IntegrityResult {
  success: boolean;
  message: string;
  data: IntegrityData;
}