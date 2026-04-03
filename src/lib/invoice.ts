import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  companyName: 'Công Ty Cổ Phần Hoá Sinh Nam Việt',
  companyAddress: 'QL30/ấp Đông Mỹ, Mỹ Hội, Cao Lãnh, Đồng Tháp 81167',
  companyPhone: '0886 357 788',
  companyEmail: 'hoasinhnamviet@gmail.com',
  companyTax: 'MST: 1401226782',
};

export function generateInvoicePDF(order: SalesOrder, config: InvoiceConfig = DEFAULT_CONFIG) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set default font to support Vietnamese
  doc.setFont('helvetica');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  let currentY = margin;

  // Company Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(config.companyName || DEFAULT_CONFIG.companyName!, margin, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(config.companyAddress || DEFAULT_CONFIG.companyAddress!, margin, currentY);
  currentY += 5;
  doc.text(`ĐT: ${config.companyPhone || DEFAULT_CONFIG.companyPhone}`, margin, currentY);
  currentY += 5;
  doc.text(`Email: ${config.companyEmail || DEFAULT_CONFIG.companyEmail}`, margin, currentY);
  currentY += 8;

  // Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('HÓA ĐƠN BÁN HÀNG', pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;

  // Invoice Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Số HĐ: ${order.orderCode}`, margin, currentY);
  doc.text(`Ngày lập: ${new Date(order.orderDate || order.createdAt).toLocaleDateString('vi-VN')}`, pageWidth - margin - 50, currentY);
  currentY += 7;

  // Customer Info
  doc.setFont('helvetica', 'bold');
  doc.text('THÔNG TIN KHÁCH HÀNG:', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.text(`Tên KH: ${order.customer?.customerName || 'N/A'}`, margin, currentY);
  currentY += 5;
  doc.text(`Địa chỉ: ${order.customer?.address || order.deliveryAddress || 'N/A'}`, margin, currentY);
  currentY += 5;
  doc.text(`ĐT: ${order.customer?.phone || 'N/A'}`, margin, currentY);
  currentY += 8;

  // Order Details Table
  const tableColumn = ['STT', 'Sản phẩm', 'Đơn vị', 'SL', 'Đơn giá', 'Chiết khấu', 'Thành tiền'];
  const tableRows: any[] = [];

  order.details?.forEach((detail, index) => {
    const qty = parseFloat(String(detail.quantity)) || 0;
    const price = parseFloat(String(detail.unitPrice)) || 0;
    const discount = parseFloat(String(detail.discountPercent)) || 0;
    const tax = parseFloat(String(detail.taxRate)) || 0;

    const subtotal = price * qty;
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * tax) / 100;
    const lineTotal = taxableAmount + taxAmount;

    tableRows.push([
      index + 1,
      detail.product?.productName || 'N/A',
      detail.product?.unit || 'cái',
      qty.toFixed(2),
      formatCurrency(price),
      `${discount}%`,
      formatCurrency(lineTotal),
    ]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: currentY,
    margin: margin,
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { cellWidth: 60 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'right', cellWidth: 20 },
      4: { halign: 'right', cellWidth: 30 },
      5: { halign: 'center', cellWidth: 20 },
      6: { halign: 'right', cellWidth: 30 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Summary Section
  const summaryX = pageWidth - margin - 80;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Subtotal
  doc.text('Tổng tiền hàng:', summaryX, currentY);
  const totalSubtotal = order.details?.reduce((sum, d) => {
    const price = parseFloat(String(d.unitPrice)) || 0;
    const qty = parseFloat(String(d.quantity)) || 0;
    return sum + price * qty;
  }, 0) || 0;
  doc.text(formatCurrency(totalSubtotal), pageWidth - margin - 5, currentY, { align: 'right' });
  currentY += 6;

  // Discount
  if (order.details?.some(d => parseFloat(String(d.discountPercent)) > 0)) {
    const totalDiscount = order.details?.reduce((sum, d) => {
      const price = parseFloat(String(d.unitPrice)) || 0;
      const qty = parseFloat(String(d.quantity)) || 0;
      const discount = parseFloat(String(d.discountPercent)) || 0;
      const subtotal = price * qty;
      return sum + (subtotal * discount) / 100;
    }, 0) || 0;

    doc.text('Chiết khấu:', summaryX, currentY);
    doc.text(`-${formatCurrency(totalDiscount)}`, pageWidth - margin - 5, currentY, { align: 'right' });
    currentY += 6;
  }

  // Tax
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

  if (totalTax > 0) {
    doc.text('Thuế GTGT:', summaryX, currentY);
    doc.text(formatCurrency(totalTax), pageWidth - margin - 5, currentY, { align: 'right' });
    currentY += 6;
  }

  // Shipping
  if (order.shippingFee > 0) {
    doc.text('Phí vận chuyển:', summaryX, currentY);
    doc.text(formatCurrency(order.shippingFee), pageWidth - margin - 5, currentY, { align: 'right' });
    currentY += 6;
  }

  // Total (Bold)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TỔNG CỘNG:', summaryX, currentY);
  doc.text(formatCurrency(order.totalAmount), pageWidth - margin - 5, currentY, { align: 'right' });
  currentY += 8;

  // Payment Info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Phương thức TT: ${PAYMENT_METHOD_LABELS[order.paymentMethod] || 'N/A'}`, margin, currentY);
  currentY += 5;
  doc.text(`Trạng thái: ${order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}`, margin, currentY);
  currentY += 5;
  doc.text(`Kênh bán: ${SALES_CHANNEL_LABELS[order.salesChannel] || 'N/A'}`, margin, currentY);
  currentY += 8;

  // Notes
  if (order.notes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Ghi chú:', margin, currentY);
    currentY += 5;
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(order.notes, pageWidth - 2 * margin);
    doc.text(noteLines, margin, currentY);
    currentY += noteLines.length * 5 + 5;
  }

  // Footer
  currentY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi', pageWidth / 2, currentY, { align: 'center' });
  doc.text(`Được tạo ngày: ${new Date().toLocaleDateString('vi-VN')}`, pageWidth / 2, currentY + 5, { align: 'center' });

  return doc;
}

// Download PDF file
export function downloadInvoicePDF(order: SalesOrder, config?: InvoiceConfig) {
  const doc = generateInvoicePDF(order, config);
  const fileName = `HoaDon_${order.orderCode}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
}

// Print PDF
export function printInvoice(order: SalesOrder, config?: InvoiceConfig) {
  const doc = generateInvoicePDF(order, config);
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  const printWindow = window.open(pdfUrl, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
