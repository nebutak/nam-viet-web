import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { RevenueReport } from "@/types/report.types";
import { formatPercentage } from "@/types/report.types";
import { formatCurrency, formatNumber } from "./utils";

interface ExportOptions {
  title: string;
  subtitle?: string;
  fromDate?: string;
  toDate?: string;
}

export class RevenueReportExporter {
  static exportToExcel(data: RevenueReport, options: ExportOptions) {
    try {
      const wb = XLSX.utils.book_new();
      const timestamp = new Date().toISOString().split("T")[0];

      // Sheet 1: Summary
      this.addSummarySheet(wb, data, options);

      // Sheet 2: Orders
      this.addOrdersSheet(wb, data);

      // Sheet 3: Products
      this.addProductsSheet(wb, data);

      // Sheet 4: Customers
      this.addCustomersSheet(wb, data);

      // Sheet 5: Channel Analysis
      this.addChannelSheet(wb, data);

      // Sheet 6: Trend Data
      this.addTrendSheet(wb, data);

      const filename = `${options.title.replace(/\s+/g, "_")}_${timestamp}.xlsx`;
      XLSX.writeFile(wb, filename);

      return { success: true, filename };
    } catch (error) {
      console.error("Excel export error:", error);
      throw error;
    }
  }

  static exportToPDFA4(data: RevenueReport, options: ExportOptions) {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const timestamp = new Date().toISOString().split("T")[0];

      // Page 1: Summary & Charts Summary
      this.addPDFCoverPage(doc, data, options);

      // Add more pages for details
      doc.addPage();
      this.addPDFOrdersTable(doc, data);

      doc.addPage();
      this.addPDFProductsTable(doc, data);

      doc.addPage();
      this.addPDFCustomersTable(doc, data);

      // Add page numbers
      const pageCount = (doc as any).internal.getNumberOfPages?.();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Trang ${i}/${pageCount}`,
          doc.internal.pageSize.getWidth() - 20,
          doc.internal.pageSize.getHeight() - 5
        );
      }

      const filename = `${options.title.replace(/\s+/g, "_")}_${timestamp}.pdf`;
      doc.save(filename);

      return { success: true, filename };
    } catch (error) {
      console.error("PDF export error:", error);
      throw error;
    }
  }

  static exportToPDFA5(data: RevenueReport, options: ExportOptions) {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5",
      });

      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 5;

      // Page 1: Summary
      let currentY = margin;

      // Title
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(options.title, margin, currentY);
      currentY += 5;

      // Date range
      if (options.fromDate && options.toDate) {
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(`Kỳ báo cáo: ${options.fromDate} đến ${options.toDate}`, margin, currentY);
        currentY += 4;
      }

      // Export date
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(`Xuất: ${new Date().toLocaleDateString("vi-VN")}`, margin, currentY);
      currentY += 4;
      doc.setTextColor(0, 0, 0);

      // Summary KPIs (compact)
      currentY += 1;
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("Chỉ số chính:", margin, currentY);
      currentY += 4;

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      const kpis = [
        ["Tổng doanh thu:", formatCurrency(data.summary.grossRevenue)],
        ["Thực thu:", formatCurrency(data.summary.netRevenue)],
        ["Lợi nhuận:", formatCurrency(data.summary.paidAmount)],
        ["Tổng đơn hàng:", formatNumber(data.summary.totalOrders)],
        ["Công nợ:", formatCurrency(data.summary.debtAmount)],
      ];

      kpis.forEach(([label, value]) => {
        doc.text(label, margin + 2, currentY);
        doc.text(value, pageWidth - margin - 20, currentY);
        currentY += 3;
      });

      currentY += 2;

      // Top 8 Products
      if (data.topProducts && data.topProducts.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("Top Sản phẩm:", margin, currentY);
        currentY += 3;

        const topProducts = data.topProducts.slice(0, 8);
        const tableData = topProducts.map((p) => [
          p.productName.substring(0, 12),
          formatNumber(p.quantity),
          formatCurrency(p.revenue).substring(0, 12),
        ]);

        autoTable(doc, {
          head: [["Sản phẩm", "Số lượng", "Doanh số"]],
          body: tableData,
          startY: currentY,
          styles: {
            font: "helvetica",
            fontSize: 6,
            cellPadding: 1,
            overflow: "hidden",
            halign: "left",
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontStyle: "bold",
            fontSize: 6,
          },
          columnStyles: {
            0: { halign: "left", cellWidth: 40 },
            1: { halign: "right", cellWidth: 25 },
            2: { halign: "right", cellWidth: 35 },
          },
          margin: { left: margin, right: margin },
          tableWidth: "wrap",
        });
      }

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `${options.title.replace(/\s+/g, "_")}_A5_${timestamp}.pdf`;
      doc.save(filename);

      return { success: true, filename };
    } catch (error) {
      console.error("A5 PDF export error:", error);
      throw error;
    }
  }

  // ==================== Private Methods ====================

  private static addSummarySheet(wb: XLSX.WorkBook, data: RevenueReport, options: ExportOptions) {
    const timestamp = new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN");
    
    const summaryData: string[][] = [
      ["BÁOCÁO DOANH THU BÁN HÀNG", ""],
      ["", ""],
      ["Kỳ báo cáo:", `${options.fromDate} đến ${options.toDate}`],
      ["Ngày xuất:", timestamp],
      ["", ""],
      ["", ""],
      ["Chỉ Số", "Giá Trị"],
      ["─────────────────────────────────", "─────────────────────────"],
      ["Doanh Thu Tổng", formatCurrency(data.summary.grossRevenue)],
      ["Chiết Khấu", formatCurrency(data.summary.totalDiscount)],
      ["Thuế", formatCurrency(data.summary.totalTax)],
      ["Phí Vận Chuyển", formatCurrency(data.summary.shippingFee || 0)],
      ["Thực Thu", formatCurrency(data.summary.netRevenue)],
      ["Đã Thanh Toán", formatCurrency(data.summary.paidAmount)],
      ["Công Nợ Phải Thu", formatCurrency(data.summary.debtAmount)],
      ["Giá Trị Trung Bình/Đơn", formatCurrency(data.summary.averageOrderValue)],
      ["Tổng Số Đơn Hàng", formatNumber(data.summary.totalOrders)],
      ["", ""],
      ["Ghi Chú:", ""],
      ["- Doanh Thu Tổng = Giá trị đơn hàng trước chiết khấu", ""],
      ["- Thực Thu = Doanh thu - Chiết khấu + Thuế + Phí vận chuyển", ""],
      ["- Công Nợ = Thực thu - Đã thanh toán", ""],
    ];

    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    ws["!cols"] = [{ wch: 35 }, { wch: 30 }];
    
    // Styling: Bold title rows
    ws["A1"] = { ...ws["A1"], font: { bold: true, size: 14 } };
    ws["A7"] = { ...ws["A7"], font: { bold: true } };
    ws["B7"] = { ...ws["B7"], font: { bold: true } };
    
    XLSX.utils.book_append_sheet(wb, ws, "Tóm tắt");
  }

  private static addOrdersSheet(wb: XLSX.WorkBook, data: RevenueReport) {
    const ordersData = (data.orders || []).map((order) => ({
      "Mã Đơn": order.orderCode,
      "Ngày Bán": order.orderDate,
      "Hoàn Thành": order.completedAt || "N/A",
      "Khách Hàng": order.customerName,
      "Nhân Viên": order.staffName,
      "Kênh Bán": order.salesChannel ? this.getChannelLabel(order.salesChannel) : "N/A",
      "Doanh Thu": formatCurrency(order.totalAmount),
      "Chiết Khấu": formatCurrency(order.discountAmount),
      "Thuế": formatCurrency(order.taxAmount),
      "Phí Vận Chuyển": formatCurrency(order.shippingFee),
      "Thực Thu": formatCurrency(order.finalAmount),
      "Đã Thanh Toán": formatCurrency(order.paidAmount),
      "Công Nợ": formatCurrency(order.debtAmount),
      "Trạng Thái TT": this.getPaymentStatusLabel(order.paymentStatus),
      "Hình Thức TT": order.paymentMethod || "N/A",
      "Trạng Thái Đơn": this.getOrderStatusLabel(order.orderStatus),
      "Địa Chỉ Giao": order.deliveryAddress || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(ordersData);
    ws["!cols"] = [
      { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 18 }, { wch: 15 },
      { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 13 },
      { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 20 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Chi tiết đơn hàng");
  }

  private static addProductsSheet(wb: XLSX.WorkBook, data: RevenueReport) {
    const productsData = (data.productPerformance || []).map((p) => ({
      "Mã SKU": p.sku,
      "Tên Sản Phẩm": p.productName,
      "Đơn Vị Tính": p.unit,
      "Số Lượng Bán": formatNumber(p.quantity),
      "Doanh Thu": formatCurrency(p.revenue),
      "Tỷ Trọng %": formatPercentage(p.percentage),
    }));

    const ws = XLSX.utils.json_to_sheet(productsData);
    ws["!cols"] = [{ wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws, "Chi tiết sản phẩm");
  }

  private static addCustomersSheet(wb: XLSX.WorkBook, data: RevenueReport) {
    const customersData = (data.customerAnalysis || []).map((c) => ({
      "Mã Khách": c.customerCode,
      "Tên Khách Hàng": c.customerName,
      "Số Đơn": formatNumber(c.totalOrders),
      "Tổng Doanh Thu": formatCurrency(c.totalRevenue),
      "Công Nợ Hiện Tại": formatCurrency(c.currentDebt),
    }));

    const ws = XLSX.utils.json_to_sheet(customersData);
    ws["!cols"] = [{ wch: 15 }, { wch: 25 }, { wch: 10 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, "Chi tiết khách hàng");
  }

  private static addChannelSheet(wb: XLSX.WorkBook, data: RevenueReport) {
    const channelData = (data.byChannel || []).map((c) => ({
      "Kênh Bán": this.getChannelLabel(c.channel),
      "Doanh Thu": formatCurrency(c.revenue),
      "Số Đơn": formatNumber(c.orderCount),
      "Tỷ Trọng %": formatPercentage(c.percentage),
    }));

    const ws = XLSX.utils.json_to_sheet(channelData);
    ws["!cols"] = [{ wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws, "Phân tích kênh");
  }

  private static addTrendSheet(wb: XLSX.WorkBook, data: RevenueReport) {
    const trendData = (data.trendData || []).map((t) => ({
      "Ngày": t.date,
      "Doanh Thu": formatCurrency(t.revenue),
      "Số Đơn": formatNumber(t.orders),
    }));

    const ws = XLSX.utils.json_to_sheet(trendData);
    ws["!cols"] = [{ wch: 12 }, { wch: 15 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws, "Xu hướng");
  }

  private static addPDFCoverPage(doc: jsPDF, data: RevenueReport, options: ExportOptions) {
    let y = 15;

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(options.title, 14, y);
    y += 10;

    // Date range
    if (options.fromDate && options.toDate) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Kỳ báo cáo: ${options.fromDate} đến ${options.toDate}`, 14, y);
      y += 8;
    }

    // Export date
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`, 14, y);
    doc.setTextColor(0, 0, 0);
    y += 15;

    // KPIs Grid
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Chỉ số Tổng quan", 14, y);
    y += 8;

    const kpis = [
      { label: "Tổng Doanh Thu", value: formatCurrency(data.summary.grossRevenue) },
      { label: "Thực Thu", value: formatCurrency(data.summary.netRevenue) },
      { label: "Lợi Nhuận", value: formatCurrency(data.summary.paidAmount) },
      { label: "Tổng Đơn Hàng", value: formatNumber(data.summary.totalOrders) },
      { label: "Tiền Chiết Khấu", value: formatCurrency(data.summary.totalDiscount) },
      { label: "Công Nợ", value: formatCurrency(data.summary.debtAmount) },
    ];

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    kpis.forEach((kpi, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const x = 14 + col * 120;
      const baseY = y + row * 12;

      doc.text(kpi.label + ":", x, baseY);
      doc.setFont("helvetica", "bold");
      doc.text(kpi.value, x + 60, baseY);
      doc.setFont("helvetica", "normal");
    });

    y += 30;

    // Channel summary
    if (data.byChannel && data.byChannel.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Phân tích Kênh bán hàng", 14, y);
      y += 8;

      const channelRows = data.byChannel.map((c) => [
        this.getChannelLabel(c.channel),
        formatCurrency(c.revenue),
        formatNumber(c.orderCount),
        formatPercentage(c.percentage),
      ]);

      autoTable(doc, {
        head: [["Kênh", "Doanh thu", "Đơn hàng", "Tỷ trọng"]],
        body: channelRows,
        startY: y,
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          1: { halign: "right" },
          2: { halign: "right" },
          3: { halign: "right" },
        },
      });
    }
  }

  private static addPDFOrdersTable(doc: jsPDF, data: RevenueReport) {
    let y = 15;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Chi tiết Đơn hàng", 14, y);
    y += 10;

    const orderRows = (data.orders || []).map((o) => [
      o.orderCode,
      o.orderDate,
      o.customerName,
      o.staffName,
      formatCurrency(o.totalAmount),
      formatCurrency(o.finalAmount),
      o.paymentStatus === "paid" ? "Đã thanh toán" : o.paymentStatus === "partial" ? "Thanh toán một phần" : "Chưa thanh toán",
    ]);

    autoTable(doc, {
      head: [["Mã đơn", "Ngày", "Khách hàng", "Nhân viên", "Tổng tiền", "Thành tiền", "Thanh toán"]],
      body: orderRows,
      startY: y,
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        4: { halign: "right" },
        5: { halign: "right" },
      },
    });
  }

  private static addPDFProductsTable(doc: jsPDF, data: RevenueReport) {
    let y = 15;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Chi tiết Sản phẩm", 14, y);
    y += 10;

    const productRows = (data.productPerformance || []).map((p) => [
      p.sku,
      p.productName,
      p.unit,
      formatNumber(p.quantity),
      formatCurrency(p.revenue),
      formatPercentage(p.percentage),
    ]);

    autoTable(doc, {
      head: [["SKU", "Sản phẩm", "Đơn vị", "Số lượng", "Doanh số", "Tỷ trọng"]],
      body: productRows,
      startY: y,
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
      },
    });
  }

  private static addPDFCustomersTable(doc: jsPDF, data: RevenueReport) {
    let y = 15;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Chi tiết Khách hàng", 14, y);
    y += 10;

    const customerRows = (data.customerAnalysis || []).map((c) => [
      c.customerCode,
      c.customerName,
      formatNumber(c.totalOrders),
      formatCurrency(c.totalRevenue),
      formatCurrency(c.currentDebt),
    ]);

    autoTable(doc, {
      head: [["Mã khách", "Tên khách", "Số đơn", "Tổng doanh số", "Công nợ"]],
      body: customerRows,
      startY: y,
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
    });
  }

  private static getChannelLabel(channel: string): string {
    const labels: Record<string, string> = {
      retail: "Bán lẻ",
      wholesale: "Bán sỉ",
      online: "Online",
      distributor: "Đại lý",
    };
    return labels[channel] || channel;
  }

  private static getPaymentStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      paid: "Đã thanh toán",
      partial: "Thanh toán một phần",
      unpaid: "Chưa thanh toán",
    };
    return labels[status] || status;
  }

  private static getOrderStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      preparing: "Đang chuẩn bị",
      delivering: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Hủy",
    };
    return labels[status] || status;
  }
}
