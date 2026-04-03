import * as XLSX from "xlsx";
import type { RevenueReport } from "@/types/report.types";
import { formatCurrency, formatNumber } from "./utils";
interface ExportOptions {
  title: string;
  fromDate?: string;
  toDate?: string;
}

export class RevenueReportExporterV2 {
  static exportToExcel(data: RevenueReport, options: ExportOptions) {
    try {
      const wb = XLSX.utils.book_new();
      const timestamp = new Date().toISOString().split("T")[0];

      // Sheet 1: Báo Cáo Tổng Hợp Đơn Hàng
      this.addSalesOverviewSheet(wb, data, options);

      // Sheet 2: Chi Tiết Doanh Thu Theo Sản Phẩm
      this.addProductDetailsSheet(wb, data, options);

      const filename = `${options.title.replace(/\s+/g, "_")}_${timestamp}.xlsx`;
      XLSX.writeFile(wb, filename);

      return { success: true, filename };
    } catch (error) {
      console.error("Excel export error:", error);
      throw error;
    }
  }

  private static addSalesOverviewSheet(wb: XLSX.WorkBook, data: RevenueReport, options: ExportOptions) {
    const timestamp = new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN");

    // Header info
    const headerData = [
      ["BÁO CÁO TỔNG HỢP ĐƠN HÀNG"],
      [`Kỳ báo cáo: ${options.fromDate} đến ${options.toDate}`],
      [`Ngày xuất: ${timestamp}`],
      [],
    ];

    // Column headers
    const columns = [
      "STT",
      "Mã Đơn Hàng",
      "Mã Khách",
      "Ngày Lập",
      "Khách Hàng",
      "Kênh Bán",
      "Nhân Viên",
      "Tổng Tiền",
      "Chiết Khấu",
      "Thuế",
      "Phí Vận Chuyển",
      "Thực Thu",
      "Đã Thanh Toán",
      "Còn Nợ",
      "Trạng Thái",
      "TT Thanh Toán"
    ];

    // Data rows
    const rows = (data.orders || []).map((order, idx) => [
      idx + 1,
      order.orderCode,
      "C001",
      new Date(order.orderDate).toLocaleDateString("vi-VN"),
      order.customerName,
      this.getChannelLabel(order.salesChannel),
      order.staffName,
      formatCurrency(order.totalAmount),
      formatCurrency(order.discountAmount),
      formatCurrency(order.taxAmount),
      formatCurrency(order.shippingFee),
      formatCurrency(order.finalAmount),
      formatCurrency(order.paidAmount),
      formatCurrency(order.debtAmount),
      this.getOrderStatusLabel(order.orderStatus),
      this.getPaymentStatusLabel(order.paymentStatus),
    ]);

    // Footer - Totals
    const totals = [
      "",
      "TỔNG CỘNG",
      "",
      "",
      "",
      "",
      "",
      formatCurrency(data.summary.grossRevenue),
      formatCurrency(data.summary.totalDiscount),
      formatCurrency(data.summary.totalTax),
      formatCurrency(data.summary.shippingFee || 0),
      formatCurrency(data.summary.netRevenue),
      formatCurrency(data.summary.paidAmount),
      formatCurrency(data.summary.debtAmount),
      "",
      ""
    ];

    // Combine all data
    const allData = [...headerData, columns, ...rows, totals];

    // Create sheet
    const ws = XLSX.utils.aoa_to_sheet(allData);

    // Set column widths
    ws["!cols"] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 18 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 13 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 13 },
      { wch: 12 },
      { wch: 15 },
    ];

    // Apply center alignment to ALL cells
    for (let rowIdx = 0; rowIdx < allData.length; rowIdx++) {
      for (let colIdx = 0; colIdx < 16; colIdx++) {
        const cellRef = XLSX.utils.encode_col(colIdx) + (rowIdx + 1);
        
        if (!ws[cellRef]) {
          ws[cellRef] = { v: "", t: "s" };
        }
        
        ws[cellRef].alignment = { horizontal: "center", vertical: "center", wrapText: true };
        
        // Style header titles (rows 0-2)
        if (rowIdx < 3) {
          ws[cellRef].font = { name: "Times New Roman", bold: true, size: 11 };
        }
        // Style column headers (row 4 - index 4)
        else if (rowIdx === 4) {
          ws[cellRef].font = { name: "Times New Roman", bold: true, size: 10 };
          ws[cellRef].fill = { type: "pattern", patternType: "solid", fgColor: { rgb: "D3D3D3" } };
        }
        // Style data rows
        else {
          ws[cellRef].font = { name: "Times New Roman", size: 10 };
        }
      }
    }

    // Merge cells for header titles
    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push(XLSX.utils.decode_range("A1:P1")); // Merge title row
    ws["!merges"].push(XLSX.utils.decode_range("A2:P2")); // Merge date range row
    ws["!merges"].push(XLSX.utils.decode_range("A3:P3")); // Merge export date row

    // Freeze panes
    ws["!freeze"] = { xSplit: 0, ySplit: 5 };

    XLSX.utils.book_append_sheet(wb, ws, "Báo Cáo Đơn Hàng");
  }

  private static addProductDetailsSheet(wb: XLSX.WorkBook, data: RevenueReport, options: ExportOptions) {
    const timestamp = new Date().toLocaleDateString("vi-VN");

    // Header info
    const headerData = [
      ["CHI TIẾT DOANH THU THEO SẢN PHẨM"],
      [`Kỳ báo cáo: ${options.fromDate} đến ${options.toDate}`],
      [`Ngày xuất: ${timestamp}`],
      [],
    ];

    // Column headers
    const columns = [
      "STT",
      "Mã Đơn Hàng",
      "Ngày Bán",
      "Mã SKU",
      "Tên Sản Phẩm",
      "Danh Mục",
      "Đơn Vị",
      "Số Lượng",
      "Đơn Giá",
      "Tỷ Lệ Giảm %",
      "Thành Tiền",
      "Giá Vốn",
      "Lợi Nhuận",
      "% Lợi Nhuận"
    ];

    // Prepare product data rows
    let stt = 1;
    const rows: any[] = [];

    if (data.orders && data.orders.length > 0) {
      (data.topProducts || []).forEach((product) => {
        rows.push([
          stt++,
          "",
          "",
          product.sku,
          product.productName,
          "",
          product.unit,
          formatNumber(product.quantity),
          "",
          "",
          formatCurrency(product.revenue),
          "",
          "",
          "",
        ]);
      });
    }

    // Footer - Totals
    const totals = [
      "",
      "",
      "",
      "TỔNG CỘNG",
      "",
      "",
      "",
      formatNumber(data.productPerformance?.reduce((sum, p) => sum + p.quantity, 0) || 0),
      "",
      "",
      formatCurrency(data.summary.netRevenue),
      "",
      "",
      ""
    ];

    // Combine all data
    const allData = [...headerData, columns, ...rows, totals];

    // Create sheet
    const ws = XLSX.utils.aoa_to_sheet(allData);

    // Set column widths
    ws["!cols"] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
      { wch: 13 },
      { wch: 13 },
    ];

    // Apply center alignment to ALL cells
    for (let rowIdx = 0; rowIdx < allData.length; rowIdx++) {
      for (let colIdx = 0; colIdx < 14; colIdx++) {
        const cellRef = XLSX.utils.encode_col(colIdx) + (rowIdx + 1);
        
        if (!ws[cellRef]) {
          ws[cellRef] = { v: "", t: "s" };
        }
        
        ws[cellRef].alignment = { horizontal: "center", vertical: "center", wrapText: true };
        
        // Style header titles (rows 0-2)
        if (rowIdx < 3) {
          ws[cellRef].font = { name: "Times New Roman", bold: true, size: 11 };
        }
        // Style column headers (row 4 - index 4)
        else if (rowIdx === 4) {
          ws[cellRef].font = { name: "Times New Roman", bold: true, size: 10 };
          ws[cellRef].fill = { type: "pattern", patternType: "solid", fgColor: { rgb: "D3D3D3" } };
        }
        // Style data rows
        else {
          ws[cellRef].font = { name: "Times New Roman", size: 10 };
        }
      }
    }

    // Merge cells for header titles
    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push(XLSX.utils.decode_range("A1:N1")); // Merge title row
    ws["!merges"].push(XLSX.utils.decode_range("A2:N2")); // Merge date range row
    ws["!merges"].push(XLSX.utils.decode_range("A3:N3")); // Merge export date row

    // Freeze panes
    ws["!freeze"] = { xSplit: 0, ySplit: 5 };

    XLSX.utils.book_append_sheet(wb, ws, "Chi Tiết Sản Phẩm");
  }

  private static getChannelLabel(channel: string): string {
    const labels: Record<string, string> = {
      retail: "Bán Lẻ",
      wholesale: "Bán Sỉ",
      online: "Bán Online",
      distributor: "Bán Đại Lý",
    };
    return labels[channel] || channel;
  }

  private static getOrderStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: "Chờ Xử Lý",
      confirmed: "Đã Xác Nhận",
      preparing: "Đang Chuẩn Bị",
      delivering: "Đang Giao",
      completed: "Hoàn Thành",
      cancelled: "Hủy",
    };
    return labels[status] || status;
  }

  private static getPaymentStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      paid: "Đã Thanh Toán",
      partial: "Thanh Toán Một Phần",
      unpaid: "Chưa Thanh Toán",
    };
    return labels[status] || status;
  }
}
