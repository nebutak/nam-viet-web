// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Quản Lý Bán Hàng & Sản Xuất";

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

// Date Formats
export const DATE_FORMAT = "dd/MM/yyyy";
export const DATETIME_FORMAT = "dd/MM/yyyy HH:mm";
export const TIME_FORMAT = "HH:mm";

// Product Types
export const PRODUCT_TYPES = {
  RAW_MATERIAL: "raw_material",
  PACKAGING: "packaging",
  FINISHED_PRODUCT: "finished_product",
  GOODS: "goods",
} as const;

export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  raw_material: "Nguyên liệu",
  packaging: "Bao bì",
  finished_product: "Thành phẩm",
  goods: "Hàng hóa",
};

// Packaging Types
export const PACKAGING_TYPES = {
  BOTTLE: "bottle",
  BOX: "box",
  BAG: "bag",
  LABEL: "label",
  OTHER: "other",
} as const;

export const PACKAGING_TYPE_LABELS: Record<string, string> = {
  bottle: "Chai/Lọ",
  box: "Hộp",
  bag: "Túi",
  label: "Nhãn",
  other: "Khác",
};

// Warehouse Types
export const WAREHOUSE_TYPES = {
  RAW_MATERIAL: "raw_material",
  PACKAGING: "packaging",
  FINISHED_PRODUCT: "finished_product",
  GOODS: "goods",
} as const;

export const WAREHOUSE_TYPE_LABELS: Record<string, string> = {
  raw_material: "Kho nguyên liệu",
  packaging: "Kho bao bì",
  finished_product: "Kho thành phẩm",
  goods: "Kho hàng hóa",
};

// Transaction Types
export const TRANSACTION_TYPES = {
  IMPORT: "import",
  EXPORT: "export",
  TRANSFER: "transfer",
  DISPOSAL: "disposal",
  STOCKTAKE: "stocktake",
} as const;

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  import: "Nhập kho",
  export: "Xuất kho",
  transfer: "Chuyển kho",
  disposal: "Xuất hủy",
  stocktake: "Kiểm kê",
};

// Customer Types
export const CUSTOMER_TYPES = {
  INDIVIDUAL: "individual",
  COMPANY: "company",
} as const;

export const CUSTOMER_TYPE_LABELS: Record<string, string> = {
  individual: "Cá nhân",
  company: "Công ty",
};

// Customer Classifications
export const CUSTOMER_CLASSIFICATIONS = {
  RETAIL: "retail",
  WHOLESALE: "wholesale",
  VIP: "vip",
  DISTRIBUTOR: "distributor",
} as const;

export const CUSTOMER_CLASSIFICATION_LABELS: Record<string, string> = {
  retail: "Bán lẻ",
  wholesale: "Bán sỉ",
  vip: "VIP",
  distributor: "Đại lý",
};

// Customer Statuses
export const CUSTOMER_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  BLACKLISTED: "blacklisted",
} as const;

export const CUSTOMER_STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Tạm ngưng",
  blacklisted: "Danh sách đen",
};

export const CUSTOMER_STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  blacklisted: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

// Gender
export const GENDERS = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;

export const GENDER_LABELS: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

// Order Statuses - MATCH BACKEND DATABASE: pending, preparing, delivering, completed, cancelled
export const ORDER_STATUSES = {
  PENDING: "pending",
  PREPARING: "preparing",
  DELIVERING: "delivering",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  preparing: "Chuẩn bị hàng",
  delivering: "Đang giao hàng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  preparing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  delivering: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

// Production Statuses
export const PRODUCTION_STATUSES = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const PRODUCTION_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ phê duyệt",
  in_progress: "Đang sản xuất",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export const PRODUCTION_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

// Material Types
export const MATERIAL_TYPES = {
  RAW_MATERIAL: "raw_material",
  PACKAGING: "packaging",
} as const;

export const MATERIAL_TYPE_LABELS: Record<string, string> = {
  raw_material: "Nguyên liệu",
  packaging: "Bao bì",
};

// Payment Methods - MATCH BACKEND: cash, transfer, installment, credit
export const PAYMENT_METHODS = {
  CASH: "cash",
  TRANSFER: "transfer",
  INSTALLMENT: "installment",
  CREDIT: "credit",
} as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Tiền mặt",
  transfer: "Chuyển khoản",
  installment: "Trả góp",
  credit: "Ghi nợ",
};

export const PAYMENT_METHOD_COLORS: Record<string, string> = {
  cash: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  transfer: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  installment: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  credit: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

// Payment Statuses
export const PAYMENT_STATUSES = {
  UNPAID: "unpaid",
  PARTIAL: "partial",
  PAID: "paid",
} as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: "Chưa thanh toán",
  partial: "Thanh toán một phần",
  paid: "Đã thanh toán",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  unpaid: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

// Sales Channels
export const SALES_CHANNELS = {
  RETAIL: "retail",
  WHOLESALE: "wholesale",
  ONLINE: "online",
  DISTRIBUTOR: "distributor",
} as const;

export const SALES_CHANNEL_LABELS: Record<string, string> = {
  retail: "Bán lẻ",
  wholesale: "Bán sỉ",
  online: "Trực tuyến",
  distributor: "Đại lý",
};

// Delivery Statuses
export const DELIVERY_STATUSES = {
  PENDING: "pending",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  FAILED: "failed",
  RETURNED: "returned",
} as const;

export const DELIVERY_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ giao",
  in_transit: "Đang giao",
  delivered: "Đã giao",
  failed: "Giao thất bại",
  returned: "Đã trả lại",
};

export const DELIVERY_STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  in_transit: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  returned: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

// Roles
export const ROLES = {
  ADMIN: "admin",
  ACCOUNTANT: "accountant",
  WAREHOUSE_MANAGER: "warehouse_manager",
  WAREHOUSE_STAFF: "warehouse_staff",
  PRODUCTION_MANAGER: "production_manager",
  SALES_STAFF: "sales_staff",
  DELIVERY_STAFF: "delivery_staff",
} as const;

export const ROLE_LABELS: Record<string, string> = {
  admin: "Quản trị viên",
  accountant: "Kế toán",
  warehouse_manager: "Quản lý kho",
  warehouse_staff: "Nhân viên kho",
  production_manager: "Quản lý sản xuất",
  sales_staff: "Nhân viên bán hàng",
  delivery_staff: "Nhân viên giao hàng",
};

// Status
export const STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  LOCKED: "locked",
} as const;

export const STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  locked: "Đã khóa",
};

// Promotion Types
export const PROMOTION_TYPES = {
  PERCENT_DISCOUNT: "percent_discount",
  FIXED_DISCOUNT: "fixed_discount",
  BUY_X_GET_Y: "buy_x_get_y",
  GIFT: "gift",
} as const;

export const PROMOTION_TYPE_LABELS: Record<string, string> = {
  percent_discount: "Giảm giá %",
  fixed_discount: "Giảm giá cố định",
  buy_x_get_y: "Mua X tặng Y",
  gift: "Tặng quà",
};

// Tax Rates
export const TAX_RATES = [0, 5, 8, 10];

// Notification Types
export const NOTIFICATION_TYPES = {
  LOW_STOCK: "low_stock",
  EXPIRING_PRODUCT: "expiring_product",
  DEBT_OVERDUE: "debt_overdue",
  NEW_ORDER: "new_order",
  APPROVAL_REQUIRED: "approval_required",
  MATERIAL_SHORTAGE: "material_shortage",
  PRODUCTION_COMPLETED: "production_completed",
  SYSTEM: "system",
} as const;

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  low_stock: "Tồn kho thấp",
  expiring_product: "Sản phẩm sắp hết hạn",
  debt_overdue: "Công nợ quá hạn",
  new_order: "Đơn hàng mới",
  approval_required: "Cần phê duyệt",
  material_shortage: "Thiếu nguyên liệu",
  production_completed: "Hoàn thành sản xuất",
  system: "Thông báo hệ thống",
};

// BOM Statuses
export const BOM_STATUSES = {
  DRAFT: "draft",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const BOM_STATUS_LABELS: Record<string, string> = {
  draft: "Nháp",
  active: "Đang sử dụng",
  inactive: "Không sử dụng",
};

// BOM Material Types
export const BOM_MATERIAL_TYPES = {
  RAW_MATERIAL: "raw_material",
  PACKAGING: "packaging",
} as const;

export const BOM_MATERIAL_TYPE_LABELS: Record<string, string> = {
  raw_material: "Nguyên liệu",
  packaging: "Bao bì",
};

// Production Order Statuses
export const PRODUCTION_ORDER_STATUSES = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const PRODUCTION_ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý",
  in_progress: "Đang sản xuất",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};