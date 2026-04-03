import { SalesOrder } from '@/types';
import { formatCurrency } from './utils';
import { PAYMENT_METHOD_LABELS, SALES_CHANNEL_LABELS } from './constants';

export interface InvoiceConfig {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyTax?: string;
}

const DEFAULT_CONFIG: InvoiceConfig = {
  companyName: 'Công ty TNHH Quản Lý Bán Hàng',
  companyAddress: '123 Đường ABC, Quận 1, TP.HCM',
  companyPhone: '0123456789',
  companyEmail: 'info@company.com',
  companyTax: 'MST: 0123456789',
};

export function generateInvoiceHTML(order: SalesOrder, config: InvoiceConfig = DEFAULT_CONFIG) {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Calculate totals
  const subtotal = order.details?.reduce((sum, d) => {
    const price = parseFloat(String(d.unitPrice)) || 0;
    const qty = parseFloat(String(d.quantity)) || 0;
    return sum + price * qty;
  }, 0) || 0;

  const totalDiscount = order.details?.reduce((sum, d) => {
    const price = parseFloat(String(d.unitPrice)) || 0;
    const qty = parseFloat(String(d.quantity)) || 0;
    const discount = parseFloat(String(d.discountPercent)) || 0;
    const subtotal = price * qty;
    return sum + (subtotal * discount) / 100;
  }, 0) || 0;

  const totalTax = order.details?.reduce((sum, d) => {
    const price = parseFloat(String(d.unitPrice)) || 0;
    const qty = parseFloat(String(d.quantity)) || 0;
    const discount = parseFloat(String(d.discountPercent)) || 0;
    const tax = parseFloat(String(d.taxRate)) || 0;
    const subtotal = price * qty;
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    return sum + (taxableAmount * tax) / 100;
  }, 0) || 0;

  const detailsHTML = order.details?.map((detail, index) => {
    const qty = parseFloat(String(detail.quantity)) || 0;
    const price = parseFloat(String(detail.unitPrice)) || 0;
    const discount = parseFloat(String(detail.discountPercent)) || 0;
    const tax = parseFloat(String(detail.taxRate)) || 0;

    const subtotal = price * qty;
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * tax) / 100;
    const lineTotal = taxableAmount + taxAmount;

    return `
      <tr>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${detail.product?.productName || 'N/A'}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${detail.product?.unit || 'cái'}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${qty.toFixed(2)}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(price)}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${discount}%</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(lineTotal)}</td>
      </tr>
    `;
  }).join('') || '';

  const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hóa đơn ${order.orderCode}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          line-height: 1.6;
          color: #333;
          background: #f5f5f5;
          padding: 20px;
        }
        /* Hide theme color and blob URL in print */
        @media print {
          body::before,
          body::after {
            display: none !important;
          }
        }
        .invoice {
          background: white;
          max-width: 210mm;
          height: auto;
          margin: 0 auto;
          padding: 20mm;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #333;
          padding-bottom: 15px;
        }
        .company-info {
          font-size: 12px;
          color: #666;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #000;
          margin-bottom: 10px;
        }
        .invoice-info {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 15px;
        }
        .section {
          margin-bottom: 15px;
        }
        .section-title {
          font-weight: bold;
          font-size: 13px;
          margin-bottom: 8px;
          color: #333;
        }
        .customer-info {
          font-size: 12px;
          line-height: 1.8;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          font-size: 12px;
        }
        th {
          background-color: #2980b9 !important;
          color: white !important;
          padding: 10px !important;
          text-align: left;
          font-weight: bold;
          border: 1px solid #ddd !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        td {
          padding: 8px;
          border: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .summary {
          width: 50%;
          margin-left: auto;
          font-size: 12px;
          margin-bottom: 15px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #ddd;
        }
        .summary-row.total {
          font-weight: bold;
          font-size: 14px;
          border-bottom: 2px solid #333;
          padding-top: 10px;
          padding-bottom: 10px;
        }
        .payment-info {
          font-size: 11px;
          line-height: 1.8;
          margin-bottom: 15px;
        }
        .notes {
          font-size: 11px;
          margin-bottom: 15px;
        }
        .footer {
          text-align: center;
          font-size: 10px;
          color: #999;
          border-top: 1px solid #ddd;
          padding-top: 10px;
          margin-top: 20px;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          html, body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100%;
            height: 100%;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .invoice {
            box-shadow: none !important;
            max-width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 20mm !important;
            page-break-after: avoid;
          }
          th {
            background-color: #2980b9 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <!-- Header -->
        <div class="header">
          <div class="title">HÓA ĐƠN BÁN HÀNG</div>  
          <div class="company-info">
            <strong>${cfg.companyName}</strong><br>
            Địa chỉ: ${cfg.companyAddress}<br>
            ĐT: ${cfg.companyPhone} | Email: ${cfg.companyEmail}
          </div>
        </div>

        <!-- Invoice Info -->
        <div class="invoice-info">
          <div>
            <strong>Ngày lập:</strong> ${new Date(order.orderDate || order.createdAt).toLocaleDateString('vi-VN')}
          </div>
        </div>

        <!-- Customer Info -->
        <div class="section">
          <div class="section-title">THÔNG TIN KHÁCH HÀNG</div>
          <div class="customer-info">
            <strong>Tên KH:</strong> ${order.customer?.customerName || 'N/A'}<br>
            <strong>Địa chỉ:</strong> ${order.customer?.address || order.deliveryAddress || 'N/A'}<br>
            <strong>ĐT:</strong> ${order.customer?.phone || 'N/A'}
          </div>
        </div>

        <!-- Products Table -->
        <table>
          <thead>
            <tr>
              <th style="width: 5%;">STT</th>
              <th style="width: 35%;">Sản phẩm</th>
              <th style="width: 10%;">Đơn vị</th>
              <th style="width: 10%;">SL</th>
              <th style="width: 15%;">Đơn giá</th>
              <th style="width: 10%;">Chiết khấu</th>
              <th style="width: 15%;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${detailsHTML}
          </tbody>
        </table>

        <!-- Summary -->
        <div class="summary">
          <div class="summary-row">
            <span>Tổng tiền hàng:</span>
            <span>${formatCurrency(subtotal)}</span>
          </div>
          ${totalDiscount > 0 ? `
            <div class="summary-row">
              <span>Chiết khấu:</span>
              <span>-${formatCurrency(totalDiscount)}</span>
            </div>
          ` : ''}
          ${totalTax > 0 ? `
            <div class="summary-row">
              <span>Thuế GTGT:</span>
              <span>${formatCurrency(totalTax)}</span>
            </div>
          ` : ''}
          ${order.shippingFee > 0 ? `
            <div class="summary-row">
              <span>Phí vận chuyển:</span>
              <span>${formatCurrency(order.shippingFee)}</span>
            </div>
          ` : ''}
          <div class="summary-row total">
            <span>TỔNG CỘNG:</span>
            <span>${formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="payment-info">
          <strong>Phương thức TT:</strong> ${PAYMENT_METHOD_LABELS[order.paymentMethod] || 'N/A'}<br>
          <strong>Trạng thái:</strong> ${order.paymentStatus === 'paid' ? 'Đã thanh toán' : order.paymentStatus === 'partial' ? 'Thanh toán một phần' : 'Chưa thanh toán'}<br>
          <strong>Kênh bán:</strong> ${SALES_CHANNEL_LABELS[order.salesChannel] || 'N/A'}
        </div>

        <!-- Notes -->
        ${order.notes ? `
          <div class="notes">
            <strong>Ghi chú:</strong> ${order.notes}
          </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi<br>
          Được tạo ngày: ${new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Print Invoice
 */
export function printInvoice(order: SalesOrder, config?: InvoiceConfig) {
  const html = generateInvoiceHTML(order, config);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

/**
 * Export to PDF (using browser's print-to-PDF)
 */
export function downloadInvoicePDF(order: SalesOrder, config?: InvoiceConfig) {
  const html = generateInvoiceHTML(order, config);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
