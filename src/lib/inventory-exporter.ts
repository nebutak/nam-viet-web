import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

export interface InventoryItem {
  productId: number;
  sku: string;
  productName: string;
  unit: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minStockLevel: number;
  unitPrice: number;
  totalValue: number;
  status: "safe" | "low" | "critical";
}

export const exportInventoryToExcel = (
  items: InventoryItem[],
  summary?: { totalValue: number; totalItems: number }
) => {
  if (!items || items.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  // Prepare data
  const exportData = items.map((item, idx) => ({
    "STT": idx + 1,
    "Mã SKU": item.sku,
    "Tên Sản Phẩm": item.productName,
    "Đơn Vị": item.unit,
    "Tồn Kho": item.quantity,
    "Đang Giữ": item.reservedQuantity,
    "Có Sẵn": item.availableQuantity,
    "Min": item.minStockLevel,
    "Đơn Giá": item.unitPrice.toLocaleString("vi-VN"),
    "Tổng Giá Trị": item.totalValue.toLocaleString("vi-VN"),
    "Trạng Thái": getStatusLabel(item.status),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Set column widths
  worksheet["!cols"] = [
    { wch: 6 },   // STT
    { wch: 18 },  // Mã SKU
    { wch: 35 },  // Tên Sản Phẩm
    { wch: 10 },  // Đơn Vị
    { wch: 12 },  // Tồn Kho
    { wch: 12 },  // Đang Giữ
    { wch: 12 },  // Có Sẵn
    { wch: 8 },   // Min
    { wch: 14 },  // Đơn Giá
    { wch: 14 },  // Tổng Giá Trị
    { wch: 12 },  // Trạng Thái
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tồn Kho");

  // Add summary sheet if provided
  if (summary) {
    const summaryData = [
      { "Chỉ Số": "Tổng Sản Phẩm", "Giá Trị": summary.totalItems },
      { "Chỉ Số": "Tổng Giá Trị Kho", "Giá Trị": summary.totalValue.toLocaleString("vi-VN") + " ₫" },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet["!cols"] = [{ wch: 20 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Tóm Tắt");
  }

  // Export
  XLSX.writeFile(workbook, `Báo-cáo-tồn-kho-${format(new Date(), "dd-MM-yyyy")}.xlsx`);
};

export const exportInventoryToPDF = (
  items: InventoryItem[],
  summary?: { totalValue: number; totalItems: number }
) => {
  if (!items || items.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add title
  pdf.setFontSize(16);
  pdf.text("BÁO CÁO TỒN KHO", pdf.internal.pageSize.getWidth() / 2, 15, {
    align: "center",
  });

  // Add date
  pdf.setFontSize(10);
  pdf.text(`Ngày xuất: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 10, 25);

  // Add summary
  if (summary) {
    pdf.setFontSize(10);
    pdf.text(`Tổng Sản Phẩm: ${summary.totalItems}`, 10, 32);
    pdf.text(
      `Tổng Giá Trị: ${summary.totalValue.toLocaleString("vi-VN")} ₫`,
      10,
      39
    );
  }

  // Prepare table data
  const tableData = items.map((item, idx) => [
    (idx + 1).toString(),
    item.sku,
    item.productName.substring(0, 30),
    item.unit,
    item.quantity.toString(),
    item.availableQuantity.toString(),
    item.minStockLevel.toString(),
    `${item.unitPrice.toLocaleString("vi-VN")}`,
    `${item.totalValue.toLocaleString("vi-VN")}`,
    getStatusLabel(item.status),
  ]);

  // Add table
  (pdf as any).autoTable({
    head: [
      [
        "STT",
        "Mã SKU",
        "Tên Sản Phẩm",
        "ĐV",
        "Tồn",
        "Sẵn",
        "Min",
        "Đơn Giá",
        "Tổng Giá",
        "Trạng Thái",
      ],
    ],
    body: tableData,
    startY: summary ? 46 : 32,
    styles: {
      font: "times",
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 10, right: 10 },
  });

  // Save PDF
  pdf.save(`Báo-cáo-tồn-kho-${format(new Date(), "dd-MM-yyyy")}.pdf`);
};

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    safe: "An toàn",
    low: "Tồn kho thấp",
    critical: "Cảnh báo",
  };
  return labels[status] || status;
}
