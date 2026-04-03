import { ProductionOrder } from "@/types";
import { PRODUCTION_STATUS_LABELS } from "./constants";
import { formatNumber } from "./utils";
import { format } from "date-fns";

export const handleExportPDF = (productionOrders: ProductionOrder[]) => {
    if (productionOrders.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    // Create table HTML
    let tableHTML = `
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Mã lệnh</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Sản phẩm</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">BOM</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">SL Kế hoạch</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">SL Thực tế</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Ngày bắt đầu</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
    `;

    productionOrders.forEach((order) => {
      const statusLabel = PRODUCTION_STATUS_LABELS[order.status] || order.status;
      tableHTML += `
        <tr>
          <td style="border: 1px solid #d1d5db; padding: 8px;">${order.orderCode}</td>
          <td style="border: 1px solid #d1d5db; padding: 8px;">
            ${order.finishedProduct?.productName || "—"}<br/>
            <small>${order.finishedProduct?.sku || ""}</small>
          </td>
          <td style="border: 1px solid #d1d5db; padding: 8px;">
            ${order.bom?.bomCode || "—"}<br/>
            <small>v${order.bom?.version || "1.0"}</small>
          </td>
          <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">
            ${formatNumber(order.plannedQuantity)} ${order.finishedProduct?.unit || ""}
          </td>
          <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">
            ${formatNumber(order.actualQuantity)} ${order.finishedProduct?.unit || ""}
          </td>
          <td style="border: 1px solid #d1d5db; padding: 8px;">
            ${format(new Date(order.startDate), "dd/MM/yyyy")}
          </td>
          <td style="border: 1px solid #d1d5db; padding: 8px;">
            ${statusLabel}
          </td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
      </table>
    `;

    // Create complete HTML document
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Kế hoạch sản xuất</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          h1 { text-align: center; color: #1f2937; margin-bottom: 10px; }
          .info { text-align: center; font-size: 12px; color: #666; margin-bottom: 20px; }
          table { margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Kế Hoạch Sản Xuất</h1>
        <div class="info">
          <p>Ngày in: ${format(new Date(), "dd/MM/yyyy HH:mm")}</p>
          <p>Tổng lệnh: ${productionOrders.length}</p>
        </div>
        ${tableHTML}
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d1d5db; font-size: 12px; color: #666;">
          <p>Được in từ Hệ thống quản lý sản xuất</p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    // Open print dialog
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };