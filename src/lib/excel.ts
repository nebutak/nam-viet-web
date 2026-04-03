import { ProductionOrder, User, UserStatus, Attendance, Product, Inventory, StockTransaction, TransactionType, TransactionStatus } from "@/types";
import { format } from "date-fns";
import { PRODUCTION_STATUS_LABELS } from "./constants";
import * as XLSX from "xlsx";

const getGenderLabel = (gender?: "male" | "female" | "other") => {
  if (!gender) return "—";
  const labels = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
  };
  return labels[gender];
};

const getStatusLabel = (status: UserStatus) => {
  const labels: Record<UserStatus, string> = {
    active: "Hoạt động",
    inactive: "Ngưng hoạt động",
    locked: "Bị khóa",
  };
  return labels[status];
};

export const handleExportExcel = (productionOrders: ProductionOrder[]) => {
  if (productionOrders && productionOrders.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  const exportData = productionOrders.map((order) => ({
    "Mã lệnh": order.orderCode,
    "Sản phẩm": order.finishedProduct?.productName || "",
    "SKU": order.finishedProduct?.sku || "",
    "BOM": order.bom?.bomCode || "",
    "Phiên bản BOM": order.bom?.version || "1.0",
    "SL Kế hoạch": order.plannedQuantity,
    "SL Thực tế": order.actualQuantity || 0,
    "Đơn vị": order.finishedProduct?.unit || "",
    "Ngày bắt đầu": format(new Date(order.startDate), "dd/MM/yyyy"),
    "Ngày kết thúc": order.endDate ? format(new Date(order.endDate), "dd/MM/yyyy") : "",
    "Trạng thái": PRODUCTION_STATUS_LABELS[order.status] || order.status,
    "Kho đích": order.warehouse?.warehouseName || "",
    "Ghi chú": order.notes || "",
  })) || [];

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  const columnWidths = [
    { wch: 15 }, // Mã lệnh
    { wch: 25 }, // Sản phẩm
    { wch: 12 }, // SKU
    { wch: 12 }, // BOM
    { wch: 12 }, // Phiên bản BOM
    { wch: 12 }, // SL Kế hoạch
    { wch: 12 }, // SL Thực tế
    { wch: 10 }, // Đơn vị
    { wch: 15 }, // Ngày bắt đầu
    { wch: 15 }, // Ngày kết thúc
    { wch: 15 }, // Trạng thái
    { wch: 15 }, // Kho đích
    { wch: 20 }, // Ghi chú
  ];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Lệnh sản xuất");

  const fileName = `Lenh_san_xuat_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};


export const handleExportExcelUsers = (users: User[]) => {
  if (!users || users.length === 0) {
    alert("Không có dữ liệu để xuất");
    return;
  }

  // Prepare data for export
  const exportData = users.map(user => ({
    "Mã NV": user.employeeCode,
    "Họ Tên": user.fullName,
    "Email": user.email,
    "Số Điện Thoại": user.phone || "",
    "Giới Tính": getGenderLabel(user.gender),
    "Vai Trò": user.role?.roleName || "",
    "Kho": user.warehouse?.warehouseName || "",
    "Địa Chỉ": user.address || "",
    "Trạng Thái": getStatusLabel(user.status),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 12 }, // Mã NV
    { wch: 20 }, // Họ Tên
    { wch: 25 }, // Email
    { wch: 15 }, // Số Điện Thoại
    { wch: 10 }, // Giới Tính
    { wch: 20 }, // Vai Trò
    { wch: 20 }, // Kho
    { wch: 30 }, // Địa Chỉ
    { wch: 15 }, // Trạng Thái
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Nhân viên");

  // Export file
  const fileName = `Danh_sach_nhan_vien_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  XLSX.writeFile(workbook, fileName);
};


const getAttendanceStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    present: "Đủ công",
    absent: "Vắng mặt",
    late: "Đi muộn",
    leave: "Nghỉ phép",
    work_from_home: "WFH",
  };
  return labels[status] || status;
};

const getLeaveTypeLabel = (leaveType?: string) => {
  const labels: Record<string, string> = {
    none: "Không phải nghỉ",
    annual: "Nghỉ phép năm",
    sick: "Nghỉ ốm",
    unpaid: "Nghỉ không lương",
    other: "Khác",
  };
  return labels[leaveType || "none"] || leaveType || "";
};

export const handleExportAttendance = (
  attendances: Attendance[],
  users: User[],
  month: string
) => {
  if (!attendances || attendances.length === 0) {
    alert("Không có dữ liệu chấm công để xuất!");
    return;
  }

  // Create user map for quick lookup
  const userMap = new Map<number, User>();
  users.forEach((user) => {
    userMap.set(user.id, user);
  });

  const exportData = attendances.map((att) => {
    const user = userMap.get(att.userId);
    return {
      "Mã NV": user?.employeeCode || "",
      "Họ Tên": user?.fullName || "",
      "Ngày": format(new Date(att.date), "dd/MM/yyyy"),
      "Giờ vào": att.checkInTime
        ? att.checkInTime.toString().substring(0, 5)
        : "—",
      "Giờ ra": att.checkOutTime
        ? att.checkOutTime.toString().substring(0, 5)
        : "—",
      "Giờ công": att.workHours ? att.workHours.toFixed(2) : "—",
      "Tăng ca": att.overtimeHours ? att.overtimeHours.toFixed(2) : "—",
      "Trạng thái": getAttendanceStatusLabel(att.status),
      "Loại nghỉ": getLeaveTypeLabel(att.leaveType),
      "Ghi chú": att.notes || "",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  const columnWidths = [
    { wch: 12 }, // Mã NV
    { wch: 20 }, // Họ Tên
    { wch: 12 }, // Ngày
    { wch: 10 }, // Giờ vào
    { wch: 10 }, // Giờ ra
    { wch: 10 }, // Giờ công
    { wch: 10 }, // Tăng ca
    { wch: 15 }, // Trạng thái
    { wch: 15 }, // Loại nghỉ
    { wch: 30 }, // Ghi chú
  ];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Chấm công");

  const fileName = `Bang_cong_${month}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const handleExportExcelMaterial = (products: Product[]) => {
  if (products.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  // Prepare data for export
  const exportData = products.map((product) => ({
    SKU: product.sku,
    "Tên sản phẩm": product.productName,
    "Loại sản phẩm": "Nguyên liệu",
    "Danh mục": product.category?.categoryName || "",
    "Nhà cung cấp": product.supplier?.supplierName || "",
    "Đơn vị": product.unit,
    Barcode: product.barcode || "",
    "Giá nhập": product.purchasePrice || 0,
    "Giá bán lẻ": product.sellingPriceRetail || 0,
    "Giá bán sỉ": product.sellingPriceWholesale || 0,
    "Giá VIP": product.sellingPriceVip || 0,
    "Tồn tối thiểu": product.minStockLevel || 0,
    "Trạng thái":
      product.status === "active"
        ? "Hoạt động"
        : product.status === "inactive"
        ? "Tạm ngưng"
        : "Ngừng kinh doanh",
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 15 }, // SKU
    { wch: 30 }, // Tên sản phẩm
    { wch: 15 }, // Loại sản phẩm
    { wch: 20 }, // Danh mục
    { wch: 20 }, // Nhà cung cấp
    { wch: 10 }, // Đơn vị
    { wch: 15 }, // Barcode
    { wch: 12 }, // Giá nhập
    { wch: 12 }, // Giá bán lẻ
    { wch: 12 }, // Giá bán sỉ
    { wch: 12 }, // Giá VIP
    { wch: 12 }, // Tồn tối thiểu
    { wch: 15 }, // Trạng thái
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sản phẩm");

  // Export file
  const fileName = `Danh_sach_san_pham_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const handleExportExcelPackaging = (products: Product[]) => {
  if (products.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  // Prepare data for export
  const exportData = products.map((product) => ({
    SKU: product.sku,
    "Tên sản phẩm": product.productName,
    "Loại sản phẩm": "Bao bì",
    "Danh mục": product.category?.categoryName || "",
    "Nhà cung cấp": product.supplier?.supplierName || "",
    "Đơn vị": product.unit,
    Barcode: product.barcode || "",
    "Giá nhập": product.purchasePrice || 0,
    "Giá bán lẻ": product.sellingPriceRetail || 0,
    "Giá bán sỉ": product.sellingPriceWholesale || 0,
    "Giá VIP": product.sellingPriceVip || 0,
    "Tồn tối thiểu": product.minStockLevel || 0,
    "Trạng thái":
      product.status === "active"
        ? "Hoạt động"
        : product.status === "inactive"
        ? "Tạm ngưng"
        : "Ngừng kinh doanh",
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 15 }, // SKU
    { wch: 30 }, // Tên sản phẩm
    { wch: 15 }, // Loại sản phẩm
    { wch: 20 }, // Danh mục
    { wch: 20 }, // Nhà cung cấp
    { wch: 10 }, // Đơn vị
    { wch: 15 }, // Barcode
    { wch: 12 }, // Giá nhập
    { wch: 12 }, // Giá bán lẻ
    { wch: 12 }, // Giá bán sỉ
    { wch: 12 }, // Giá VIP
    { wch: 12 }, // Tồn tối thiểu
    { wch: 15 }, // Trạng thái
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sản phẩm");

  // Export file
  const fileName = `Danh_sach_san_pham_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export interface ImportPackagingResult {
  successful: number;
  failed: number;
  duplicates: number;
  errors: Array<{
    row: number;
    sku: string;
    message: string;
  }>;
}

export const handleImportExcelPackaging = async (
  file: File,
  existingSkus: Set<string>,
  categories: Array<{ id: number; categoryName: string }>,
  suppliers: Array<{ id: number; supplierName: string }>
): Promise<{
  data: Array<any>;
  errors: Array<{ row: number; sku: string; message: string }>;
  duplicates: Array<{ row: number; sku: string }>;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const validProducts: any[] = [];
        const errors: Array<{ row: number; sku: string; message: string }> = [];
        const duplicates: Array<{ row: number; sku: string }> = [];
        const processedSkus = new Set<string>();

        // Map column names for flexibility
        const columnMapping: Record<string, string[]> = {
          sku: ["SKU", "sku", "Mã SKU"],
          productName: ["Tên sản phẩm", "productName", "Product Name"],
          categoryName: ["Danh mục", "categoryName", "Category"],
          supplierName: ["Nhà cung cấp", "supplierName", "Supplier"],
          unit: ["Đơn vị", "unit", "Unit"],
          barcode: ["Barcode", "barcode", "Mã vạch"],
          purchasePrice: ["Giá nhập", "purchasePrice", "Purchase Price"],
          sellingPriceRetail: ["Giá bán lẻ", "sellingPriceRetail", "Retail Price"],
          sellingPriceWholesale: ["Giá bán sỉ", "sellingPriceWholesale", "Wholesale Price"],
          sellingPriceVip: ["Giá VIP", "sellingPriceVip", "VIP Price"],
          minStockLevel: ["Tồn tối thiểu", "minStockLevel", "Min Stock"],
          status: ["Trạng thái", "status", "Status"],
        };

        const getColumnValue = (row: any, columnAlternatives: string[]) => {
          for (const alt of columnAlternatives) {
            if (row[alt] !== undefined && row[alt] !== null) {
              return row[alt];
            }
          }
          return undefined;
        };

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2; // Excel rows start from 1, plus header
          const sku = getColumnValue(row, columnMapping.sku);
          const productName = getColumnValue(row, columnMapping.productName);
          const unit = getColumnValue(row, columnMapping.unit);
          const categoryName = getColumnValue(row, columnMapping.categoryName);
          const supplierName = getColumnValue(row, columnMapping.supplierName);

          // Validations
          if (!sku || !sku.toString().trim()) {
            errors.push({
              row: rowNumber,
              sku: sku || "N/A",
              message: "SKU là bắt buộc",
            });
            return;
          }

          const skuStr = sku.toString().trim().toUpperCase();

          // Check for duplicates in existing data
          if (existingSkus.has(skuStr)) {
            duplicates.push({
              row: rowNumber,
              sku: skuStr,
            });
            return;
          }

          // Check for duplicates in current import
          if (processedSkus.has(skuStr)) {
            errors.push({
              row: rowNumber,
              sku: skuStr,
              message: "SKU bị trùng trong file nhập",
            });
            return;
          }

          if (!productName || !productName.toString().trim()) {
            errors.push({
              row: rowNumber,
              sku: skuStr,
              message: "Tên sản phẩm là bắt buộc",
            });
            return;
          }

          if (!unit || !unit.toString().trim()) {
            errors.push({
              row: rowNumber,
              sku: skuStr,
              message: "Đơn vị là bắt buộc",
            });
            return;
          }

          // Find category ID
          let categoryId = undefined;
          if (categoryName && categoryName.toString().trim()) {
            const category = categories.find(
              (c) => c.categoryName.toLowerCase() === categoryName.toString().trim().toLowerCase()
            );
            if (!category) {
              errors.push({
                row: rowNumber,
                sku: skuStr,
                message: `Danh mục "${categoryName}" không tồn tại`,
              });
              return;
            }
            categoryId = category.id;
          }

          // Find supplier ID
          let supplierId = undefined;
          if (supplierName && supplierName.toString().trim()) {
            const supplier = suppliers.find(
              (s) => s.supplierName.toLowerCase() === supplierName.toString().trim().toLowerCase()
            );
            if (!supplier) {
              errors.push({
                row: rowNumber,
                sku: skuStr,
                message: `Nhà cung cấp "${supplierName}" không tồn tại`,
              });
              return;
            }
            supplierId = supplier.id;
          }

          // Parse prices
          const parsePrice = (val: any) => {
            const num = parseFloat(val);
            return isNaN(num) || num < 0 ? 0 : num;
          };

          const purchasePrice = parsePrice(getColumnValue(row, columnMapping.purchasePrice) || 0);
          const sellingPriceRetail = parsePrice(
            getColumnValue(row, columnMapping.sellingPriceRetail) || 0
          );
          const sellingPriceWholesale = parsePrice(
            getColumnValue(row, columnMapping.sellingPriceWholesale) || 0
          );
          const sellingPriceVip = parsePrice(getColumnValue(row, columnMapping.sellingPriceVip) || 0);
          const minStockLevel = parsePrice(getColumnValue(row, columnMapping.minStockLevel) || 0);

          // Parse status
          let status: "active" | "inactive" | "discontinued" = "active";
          const statusVal = getColumnValue(row, columnMapping.status);
          if (statusVal) {
            const statusStr = statusVal.toString().toLowerCase().trim();
            if (statusStr === "tạm ngưng" || statusStr === "inactive") {
              status = "inactive";
            } else if (statusStr === "ngừng kinh doanh" || statusStr === "discontinued") {
              status = "discontinued";
            }
          }

          validProducts.push({
            sku: skuStr,
            productName: productName.toString().trim(),
            productType: "packaging",
            categoryId,
            supplierId,
            unit: unit.toString().trim(),
            barcode: getColumnValue(row, columnMapping.barcode)?.toString().trim() || undefined,
            purchasePrice,
            sellingPriceRetail,
            sellingPriceWholesale,
            sellingPriceVip,
            minStockLevel,
            status,
          });

          processedSkus.add(skuStr);
        });

        resolve({
          data: validProducts,
          errors,
          duplicates,
        });
      } catch (error: any) {
        reject(new Error(`Lỗi khi đọc file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Lỗi khi đọc file"));
    };

    reader.readAsBinaryString(file);
  });
};

export const handleExportInventory = (inventories: Inventory[]) => {
  if (!inventories || inventories.length === 0) {
    alert("Không có dữ liệu tồn kho để xuất!");
    return;
  }

  // Prepare data for export
  const exportData = inventories.map((item) => {
    let updatedAtStr = "—";
    try {
      if (item.updatedAt) {
        updatedAtStr = format(new Date(item.updatedAt), "dd/MM/yyyy HH:mm");
      }
    } catch (e) {
      updatedAtStr = "—";
    }

    return {
      "Mã sản phẩm": item.product?.sku || "",
      "Tên sản phẩm": item.product?.productName || "",
      "SKU": item.product?.sku || "",
      "Kho": item.warehouse?.warehouseName || "",
      "Số lượng tồn": Number(item.quantity || 0),
      "Số lượng đặt chỗ": Number(item.reservedQuantity || 0),
      "Số lượng khả dụng": Number(item.quantity || 0) - Number(item.reservedQuantity || 0),
      "Giá nhập": Number(item.product?.purchasePrice || 0),
      "Tồn kho tối thiểu": item.product?.minStockLevel || 0,
      "Ngày cập nhật": updatedAtStr,
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 15 }, // Mã sản phẩm
    { wch: 30 }, // Tên sản phẩm
    { wch: 12 }, // SKU
    { wch: 20 }, // Kho
    { wch: 15 }, // Số lượng tồn
    { wch: 15 }, // Số lượng đặt chỗ
    { wch: 18 }, // Số lượng khả dụng
    { wch: 12 }, // Giá nhập
    { wch: 15 }, // Tồn kho tối thiểu
    { wch: 18 }, // Ngày cập nhật
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tồn kho");

  // Export file
  const fileName = `ton_kho_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Helper function to get transaction type label
const getTransactionTypeLabel = (type: TransactionType): string => {
  const labels: Record<TransactionType, string> = {
    import: "Nhập kho",
    export: "Xuất kho",
    transfer: "Chuyển kho",
    disposal: "Xuất hủy",
    stocktake: "Kiểm kê",
  };
  return labels[type] || type;
};

// Helper function to get transaction status label
const getTransactionStatusLabel = (status: TransactionStatus): string => {
  const labels: Record<TransactionStatus, string> = {
    draft: "Nháp",
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  return labels[status] || status;
};

export const handleExportStockTransactions = (transactions: StockTransaction[]) => {
  if (!transactions || transactions.length === 0) {
    alert("Không có dữ liệu phiếu kho để xuất!");
    return;
  }

  // Prepare data for export
  const exportData = transactions.map((transaction) => ({
    "Mã phiếu": transaction.transactionCode || "",
    "Loại": getTransactionTypeLabel(transaction.transactionType),
    "Kho": transaction.warehouse?.warehouseName || "",
    "Trạng thái": getTransactionStatusLabel(transaction.status),
    "Người tạo": transaction.creator?.fullName || "",
    "Mã NV": transaction.creator?.employeeCode || "",
    "Ngày tạo": format(new Date(transaction.createdAt), "dd/MM/yyyy"),
    "Giờ tạo": format(new Date(transaction.createdAt), "HH:mm"),
    "Tổng giá trị": Number(transaction.totalValue || 0),
    "Lý do": transaction.reason || "",
    "Ghi chú": transaction.notes || "",
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 15 }, // Mã phiếu
    { wch: 15 }, // Loại
    { wch: 20 }, // Kho
    { wch: 15 }, // Trạng thái
    { wch: 20 }, // Người tạo
    { wch: 12 }, // Mã NV
    { wch: 12 }, // Ngày tạo
    { wch: 10 }, // Giờ tạo
    { wch: 15 }, // Tổng giá trị
    { wch: 20 }, // Lý do
    { wch: 30 }, // Ghi chú
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Phiếu Kho");

  // Export file
  const fileName = `phieu_kho_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Export suppliers data to Excel
export const handleExportSuppliers = (suppliers: any[]) => {
  if (!suppliers || suppliers.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  const exportData = suppliers.map((supplier) => ({
    "Mã NCC": supplier.supplierCode,
    "Tên NCC": supplier.supplierName,
    "Người liên hệ": supplier.contactName || "-",
    "Loại": supplier.supplierType === "local" ? "Trong nước" : "Nước ngoài",
    "MST": supplier.taxCode || "-",
    "Số điện thoại": supplier.phone || "-",
    "Email": supplier.email || "-",
    "Địa chỉ": supplier.address || "-",
    "Điều khoản TT": supplier.paymentTerms || "-",
    "Nợ phải trả": supplier.totalPayable || 0,
    "Trạng thái": supplier.status === "active" ? "Hoạt động" : "Không hoạt động",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  const columnWidths = [
    { wch: 12 },
    { wch: 25 },
    { wch: 18 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 25 },
    { wch: 18 },
    { wch: 15 },
    { wch: 12 },
  ];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Nhà cung cấp");

  const fileName = `nhaccungcap_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};



// Import suppliers from Excel
export const handleImportSuppliers = async (
  file: File
): Promise<{
  data: Array<any>;
  errors: Array<{ row: number; supplierName: string; message: string }>;
  duplicates: Array<{ row: number; supplierCode: string }>;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const validSuppliers: any[] = [];
        const errors: Array<{ row: number; supplierName: string; message: string }> = [];
        const duplicates: Array<{ row: number; supplierCode: string }> = [];
        const processedCodes = new Set<string>();

        const columnMapping: Record<string, string[]> = {
          supplierCode: ["Mã NCC", "supplierCode", "Code"],
          supplierName: ["Tên NCC", "supplierName", "Supplier Name"],
          contactName: ["Người liên hệ", "contactName", "Contact"],
          supplierType: ["Loại", "supplierType", "Type"],
          taxCode: ["MST", "taxCode", "Tax Code"],
          phone: ["Số điện thoại", "phone", "Phone"],
          email: ["Email", "email", "Email"],
          address: ["Địa chỉ", "address", "Address"],
          paymentTerms: ["Điều khoản TT", "paymentTerms", "Payment Terms"],
          status: ["Trạng thái", "status", "Status"],
        };

        const getColumnValue = (row: any, columnAlternatives: string[]) => {
          for (const alt of columnAlternatives) {
            if (row[alt] !== undefined && row[alt] !== null && row[alt] !== "") {
              return row[alt];
            }
          }
          return undefined;
        };

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2;
          const supplierCode = getColumnValue(row, columnMapping.supplierCode);
          const supplierName = getColumnValue(row, columnMapping.supplierName);

          // Validate required fields
          if (!supplierCode || !supplierCode.toString().trim()) {
            errors.push({
              row: rowNumber,
              supplierName: supplierName || "Unknown",
              message: "Mã NCC là bắt buộc",
            });
            return;
          }

          const codeStr = supplierCode.toString().trim().toUpperCase();

          if (processedCodes.has(codeStr)) {
            duplicates.push({
              row: rowNumber,
              supplierCode: codeStr,
            });
            return;
          }

          if (!supplierName || !supplierName.toString().trim()) {
            errors.push({
              row: rowNumber,
              supplierName: codeStr,
              message: "Tên NCC là bắt buộc",
            });
            return;
          }

          let supplierType: "local" | "foreign" = "local";
          const typeVal = getColumnValue(row, columnMapping.supplierType);
          if (typeVal && typeVal.toString().includes("Nước ngoài")) {
            supplierType = "foreign";
          }

          let status: "active" | "inactive" = "active";
          const statusVal = getColumnValue(row, columnMapping.status);
          if (statusVal && statusVal.toString().includes("Không hoạt động")) {
            status = "inactive";
          }

          validSuppliers.push({
            supplierCode: codeStr,
            supplierName: supplierName.toString().trim(),
            contactName: getColumnValue(row, columnMapping.contactName)?.toString().trim(),
            supplierType,
            taxCode: getColumnValue(row, columnMapping.taxCode)?.toString().trim(),
            phone: getColumnValue(row, columnMapping.phone)?.toString().trim(),
            email: getColumnValue(row, columnMapping.email)?.toString().trim(),
            address: getColumnValue(row, columnMapping.address)?.toString().trim(),
            paymentTerms: getColumnValue(row, columnMapping.paymentTerms)?.toString().trim(),
            status,
          });

          processedCodes.add(codeStr);
        });

        resolve({
          data: validSuppliers,
          errors,
          duplicates,
        });
      } catch (error: any) {
        reject(new Error(`Lỗi khi đọc file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Lỗi khi đọc file"));
    };

    reader.readAsBinaryString(file);
  });
};