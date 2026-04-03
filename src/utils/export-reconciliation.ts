// src/lib/export-reconciliation.ts

import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { 
    Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, WidthType, BorderStyle, ImageRun, ShadingType 
} from 'docx';
import { format } from 'date-fns';

// Helper format tiền tệ cho Word (Excel dùng numFmt riêng)
const fmtMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// ============================================================================
// 1. XUẤT EXCEL (.xlsx) - PHIÊN BẢN NÂNG CẤP (Dùng ExcelJS)
// ============================================================================
// Hàm helper để load ảnh từ URL thành ArrayBuffer
const fetchImage = async (url: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return await blob.arrayBuffer();
    } catch (error) {
        console.error("Lỗi tải logo:", error);
        return null;
    }
};

export const exportToExcel = async (data: any, fileName: string) => {
    if (!data) return;
    const { info, financials, history } = data;

    // --- 1. CHUẨN BỊ DỮ LIỆU ---
    const allItems = [
        ...(history.products || []).map((p: any) => ({
            date: p.date,
            name: p.productName,
            unit: 'Cái',
            qty: p.quantity,
            price: p.price,
            amount: p.quantity * p.price,
            payment: 0,
            note: p.orderCode || ''
        })),
        ...(history.payments || []).map((pay: any) => ({
            date: pay.receiptDate || pay.paymentDate,
            name: `Thanh toán (${pay.receiptCode || pay.voucherCode})`,
            unit: '', qty: '', price: '',
            amount: 0,
            payment: pay.amount,
            note: pay.notes || ''
        }))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('DoiChieuCongNo');

    // Cấu hình cột
    sheet.columns = [
        { key: 'A', width: 20 }, // Cột A rộng chứa Logo
        { key: 'B', width: 40 }, 
        { key: 'C', width: 10 },  
        { key: 'D', width: 10 },  
        { key: 'E', width: 15 }, 
        { key: 'F', width: 18 }, 
        { key: 'G', width: 18 }, 
        { key: 'H', width: 25 }, 
    ];

    // --- 2. CHÈN LOGO ---
    const logoUrl = '/images/logo/logo-nobackground.png'; 
    const logoBuffer = await fetchImage(logoUrl);

    if (logoBuffer) {
        const logoId = workbook.addImage({
            buffer: logoBuffer,
            extension: 'png',
        });

        sheet.addImage(logoId, {
            tl: { col: 0, row: 0 }, 
            br: { col: 1, row: 5 }, 
            editAs: 'oneCell' 
        } as any);
    }

    // --- 3. HEADER CÔNG TY ---
    const row1 = sheet.getRow(1);
    row1.values = ['', 'CÔNG TY CỔ PHẦN HÓA SINH NAM VIỆT']; 
    sheet.mergeCells('B1:H1'); 
    row1.getCell(2).font = { name: 'Times New Roman', size: 16, bold: true, color: { argb: 'FF008000' } }; // Xanh lá đậm (theo code bạn gửi)
    row1.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };

    const row2 = sheet.getRow(2);
    row2.values = ['', 'Quốc Lộ 30, ấp Đông Mỹ, xã Mỹ Thọ, tỉnh Đồng Tháp'];
    sheet.mergeCells('B2:H2');
    row2.getCell(2).font = { name: 'Times New Roman', size: 11, color: { argb: 'FF002060' } }; // Xanh dương đậm
    row2.getCell(2).alignment = { horizontal: 'center' };

    const row3 = sheet.getRow(3);
    row3.values = ['', '088 635 7788 - 0868 759 588'];
    sheet.mergeCells('B3:H3');
    row3.getCell(2).font = { name: 'Times New Roman', size: 11, color: { argb: 'FFC00000' } }; // Đỏ đậm
    row3.getCell(2).alignment = { horizontal: 'center' };

    const row4 = sheet.getRow(4);
    row4.values = ['', 'TK Lê Trung Thành: 9 75 76 77 88 - NH ACB CN Đồng Tháp'];
    sheet.mergeCells('B4:H4');
    row4.getCell(2).font = { name: 'Times New Roman', size: 11, color: { argb: 'FF002060' } };
    row4.getCell(2).alignment = { horizontal: 'center' };

    const row5 = sheet.getRow(5);
    row5.values = ['', 'TK Lê Trung Thành: 09 75 76 77 88 - NH SACOMBANK CN Đồng Tháp'];
    sheet.mergeCells('B5:H5');
    row5.getCell(2).font = { name: 'Times New Roman', size: 11, color: { argb: 'FF002060' } };
    row5.getCell(2).alignment = { horizontal: 'center' };

    sheet.getRow(6).values = [];

    // --- 4. TIÊU ĐỀ ---
    const titleRow = sheet.addRow(['ĐỐI CHIẾU CÔNG NỢ KHÁCH HÀNG']);
    sheet.mergeCells(`A${titleRow.number}:H${titleRow.number}`);
    titleRow.getCell(1).font = { name: 'Times New Roman', size: 14, bold: true, color: { argb: 'FFFF0000' } }; // Đỏ tươi
    titleRow.getCell(1).alignment = { horizontal: 'center' };

    sheet.addRow([]);

    // --- 5. INFO KHÁCH HÀNG (CẬP NHẬT ĐỊA CHỈ) ---
    const addInfo = (label: string, value: string) => {
        const r = sheet.addRow([label, value]);
        r.getCell(1).font = { name: 'Times New Roman', size: 11 };
        r.getCell(2).font = { name: 'Times New Roman', size: 11, bold: true, color: { argb: 'FF0000FF' } }; // Xanh dương tươi
        sheet.mergeCells(`B${r.number}:H${r.number}`);
    };

    addInfo('Tên khách hàng:', info.name);
    
    // ✅ CẬP NHẬT: Nối chuỗi địa chỉ đầy đủ (Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành)
    const fullAddress = [info.address, info.district, info.province].filter(Boolean).join(', ');
    addInfo('Địa chỉ:', fullAddress || '');
    
    addInfo('Điện thoại:', info.phone || '');

    sheet.addRow([]);

    // --- 6. BẢNG CHI TIẾT ---
    const borderStyle: Partial<ExcelJS.Borders> = {
        top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
    };

    const header = sheet.addRow(['Ngày', 'Tên Sản Phẩm', 'ĐVT', 'SL', 'Giá', 'Thành tiền', 'Thanh toán', 'Ghi Chú']);
    header.eachCell((cell) => {
        cell.font = { name: 'Times New Roman', size: 11, bold: true, color: { argb: 'FF002060' } }; 
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } }; // Nền Vàng (theo code bạn gửi)
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = borderStyle;
    });

    // Nợ đầu kỳ
    const opening = sheet.addRow(['', 'Nợ Đầu Kỳ', '', '', '', financials.opening > 0 ? financials.opening : '', financials.opening < 0 ? Math.abs(financials.opening) : '', '']);
    opening.font = { name: 'Times New Roman', size: 11, italic: true, color: { argb: 'FFFF0000' } };
    opening.getCell(2).alignment = { horizontal: 'center' };
    opening.eachCell(cell => cell.border = borderStyle);
    [6, 7].forEach(c => opening.getCell(c).numFmt = '#,##0');

    // Dữ liệu
    let sumAmount = 0;
    let sumPayment = 0;

    allItems.forEach(item => {
        sumAmount += Number(item.amount);
        sumPayment += Number(item.payment);
        const r = sheet.addRow([
            format(new Date(item.date), 'dd/MM/yyyy'),
            item.name, item.unit, item.qty, item.price,
            item.amount || '', item.payment || '', item.note
        ]);
        r.font = { name: 'Times New Roman', size: 11 };
        r.eachCell(cell => cell.border = borderStyle);
        [4, 5, 6, 7].forEach(c => r.getCell(c).numFmt = '#,##0');
        r.getCell(1).alignment = { horizontal: 'center' };
        r.getCell(3).alignment = { horizontal: 'center' };
        r.getCell(4).alignment = { horizontal: 'center' };
    });

    // Tổng
    const total = sheet.addRow(['', 'Tổng', '', '', '', sumAmount, sumPayment, '']);
    total.font = { name: 'Times New Roman', size: 11, bold: true };
    total.getCell(2).alignment = { horizontal: 'center' };
    total.eachCell(cell => cell.border = borderStyle);
    [6, 7].forEach(c => total.getCell(c).numFmt = '#,##0');

    // Tổng kết
    const addSummaryRow = (label: string, val: number, isFinal = false) => {
        const r = sheet.addRow(['', label, '', '', '', '', val, '']);
        sheet.mergeCells(`B${r.number}:F${r.number}`); 
        sheet.mergeCells(`G${r.number}:H${r.number}`);
        r.getCell(2).alignment = { horizontal: 'left' }; 
        r.getCell(7).alignment = { horizontal: 'center' }; 
        r.getCell(7).numFmt = '#,##0';
        r.font = { name: 'Times New Roman', size: 11 };
        r.eachCell(cell => cell.border = borderStyle);

        if (isFinal) {
            r.font = { name: 'Times New Roman', size: 11, bold: true, color: { argb: 'FFFF0000' } };
        }
    };

    addSummaryRow('Tổng nợ trong kỳ', sumAmount - sumPayment);
    addSummaryRow('Tổng nợ phải thu', financials.closing, true);

    // --- 7. CHỮ KÝ (CẬP NHẬT 3 BÊN & NGÀY THÁNG) ---
    
    sheet.addRow([]); // Dòng trống

    // Dòng ngày tháng (Canh phải phía trên người lập phiếu)
    const today = new Date();
    const dateStr = `Ngày ${format(today, 'dd')} tháng ${format(today, 'MM')} năm ${format(today, 'yyyy')}`;
    const dateRow = sheet.addRow(['', '', '', '', '', '', dateStr]);
    sheet.mergeCells(`G${dateRow.number}:H${dateRow.number}`); // Gộp cột G-H cho ngày tháng
    dateRow.getCell(7).font = { name: 'Times New Roman', size: 11, italic: true };
    dateRow.getCell(7).alignment = { horizontal: 'center' };

    // Dòng chức danh (3 cột: Khách hàng - Đại diện công ty - Người lập phiếu)
    const signRow = sheet.addRow(['', 'Khách hàng', '', '', 'Đại diện công ty', '', 'Người lập phiếu']);
    signRow.font = { name: 'Times New Roman', size: 11, bold: true };
    
    // Gộp ô để căn giữa đẹp hơn
    sheet.mergeCells(`B${signRow.number}:C${signRow.number}`); // Khách hàng (Cột B-C)
    signRow.getCell(2).alignment = { horizontal: 'center' };

    sheet.mergeCells(`E${signRow.number}:F${signRow.number}`); // Đại diện công ty (Cột E-F)
    signRow.getCell(5).alignment = { horizontal: 'center' };

    sheet.mergeCells(`G${signRow.number}:H${signRow.number}`); // Người lập phiếu (Cột G-H)
    signRow.getCell(7).alignment = { horizontal: 'center' };

    // Dòng ghi chú (Ký tên)
    const noteRow = sheet.addRow(['', '(Ký, ghi rõ họ tên)', '', '', '(Ký, đóng dấu)', '', '(Ký, ghi rõ họ tên)']);
    noteRow.font = { name: 'Times New Roman', size: 10, italic: true };
    
    sheet.mergeCells(`B${noteRow.number}:C${noteRow.number}`);
    noteRow.getCell(2).alignment = { horizontal: 'center' };

    sheet.mergeCells(`E${noteRow.number}:F${noteRow.number}`);
    noteRow.getCell(5).alignment = { horizontal: 'center' };

    sheet.mergeCells(`G${noteRow.number}:H${noteRow.number}`);
    noteRow.getCell(7).alignment = { horizontal: 'center' };

    // Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    const dataBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(dataBlob, `${fileName}.xlsx`);
};

// ============================================================================
// 2. XUẤT WORD (.docx) - (Giữ nguyên code đã sửa ở bước trước)
// ============================================================================
export const exportToWord = async (data: any, fileName: string) => {
    if (!data) return;
    const { info, financials, history, periodName } = data;

    // --- 1. CHUẨN BỊ DỮ LIỆU (Giống Excel) ---
    const allItems = [
        ...(history.products || []).map((p: any) => ({
            date: p.date,
            name: p.productName,
            unit: 'Cái',
            qty: p.quantity,
            price: p.price,
            amount: p.quantity * p.price,
            payment: 0,
            note: p.orderCode || ''
        })),
        ...(history.payments || []).map((pay: any) => ({
            date: pay.receiptDate || pay.paymentDate,
            name: `Thanh toán (${pay.receiptCode || pay.voucherCode})`,
            unit: '', qty: '', price: '',
            amount: 0,
            payment: pay.amount,
            note: pay.notes || ''
        }))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // --- 2. LẤY LOGO ---
    const logoUrl = '/images/logo/logo-nobackground.png';
    const logoBuffer = await fetchImage(logoUrl);

    // --- 3. TẠO HEADER (Dùng Bảng ẩn để chia cột Logo - Text) ---
    const headerTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE } },
        rows: [
            new TableRow({
                children: [
                    // Cột 1: Logo
                    new TableCell({
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        children: [
                            logoBuffer ? new Paragraph({
                                children: [new ImageRun({
                                    data: logoBuffer,
                                    transformation: { width: 80, height: 80 },
                                    type: "png"
                                })]
                            }) : new Paragraph({})
                        ]
                    }),
                    // Cột 2: Thông tin công ty (Màu sắc đồng bộ Excel)
                    new TableCell({
                        width: { size: 80, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "CÔNG TY CỔ PHẦN HÓA SINH NAM VIỆT", bold: true, size: 28, color: "008000" })], // Xanh lá đậm
                                alignment: AlignmentType.CENTER
                            }),
                            new Paragraph({
                                children: [new TextRun({ text: "Quốc Lộ 30, ấp Đông Mỹ, xã Mỹ Thọ, tỉnh Đồng Tháp", size: 22, color: "002060" })], // Xanh dương đậm
                                alignment: AlignmentType.CENTER
                            }),
                            new Paragraph({
                                children: [new TextRun({ text: "088 635 7788 - 0868 759 588", size: 22, color: "C00000" })], // Đỏ đậm
                                alignment: AlignmentType.CENTER
                            }),
                            new Paragraph({
                                children: [new TextRun({ text: "TK Lê Trung Thành: 9 75 76 77 88 - NH ACB CN Đồng Tháp", size: 22, color: "002060" })],
                                alignment: AlignmentType.CENTER
                            }),
                            new Paragraph({
                                children: [new TextRun({ text: "TK Lê Trung Thành: 09 75 76 77 88 - NH SACOMBANK CN Đồng Tháp", size: 22, color: "002060" })],
                                alignment: AlignmentType.CENTER
                            }),
                        ]
                    })
                ]
            })
        ]
    });

    // --- 4. TẠO BẢNG CHI TIẾT ---
    let sumAmount = 0;
    let sumPayment = 0;

    // Cấu hình chung cho ô (Padding thoáng hơn)
    const cellMargin = { top: 100, bottom: 100, left: 100, right: 100 };

    // Header Row
    const tableHeaderRow = new TableRow({
        tableHeader: true,
        children: [
            // STT (5%)
            new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, shading: { fill: "FFFF00" }, margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "STT", bold: true, color: "002060" })], alignment: AlignmentType.CENTER })], verticalAlign: "center" }),
            
            // Ngày (10%) - Giảm từ 12%
            new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "FFFF00" }, margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "Ngày", bold: true, color: "002060" })], alignment: AlignmentType.CENTER })], verticalAlign: "center" }),
            
            // Tên SP (25%) - Giảm từ 30% để nhường chỗ
            new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: "FFFF00" }, margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "Tên Sản Phẩm", bold: true, color: "002060" })], alignment: AlignmentType.CENTER })], verticalAlign: "center" }),
            
            // ĐVT (6%) - Giảm từ 8%
            new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, shading: { fill: "FFFF00" }, margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "ĐVT", bold: true, color: "002060" })], alignment: AlignmentType.CENTER })], verticalAlign: "center" }),
            
            // SL (6%) - Giảm từ 8%
            new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, shading: { fill: "FFFF00" }, margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "SL", bold: true, color: "002060" })], alignment: AlignmentType.CENTER })], verticalAlign: "center" }),
            
            // Giá (12%) - Giữ nguyên
            new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: { fill: "FFFF00" }, margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "Giá", bold: true, color: "002060" })], alignment: AlignmentType.CENTER })], verticalAlign: "center" }),
            
            // Thành tiền (12%) - Giảm từ 15%
            new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: { fill: "FFFF00" }, margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "Thành tiền", bold: true, color: "002060" })], alignment: AlignmentType.CENTER })], verticalAlign: "center" }),
            
            // Thanh toán (12%) - Giảm từ 15%
            new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: { fill: "FFFF00" }, margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "Thanh toán", bold: true, color: "002060" })], alignment: AlignmentType.CENTER })], verticalAlign: "center" }),
            
            // Ghi chú (12%) - Thực tế sẽ rộng hơn vì các cột khác đã nhường chỗ
            new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: { fill: "FFFF00" }, margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "Ghi Chú", bold: true, color: "002060" })], alignment: AlignmentType.CENTER })], verticalAlign: "center" }),
        ]
    });

    // Dòng Nợ đầu kỳ
    const openingRow = new TableRow({
        children: [
            new TableCell({ margins: cellMargin, children: [new Paragraph("-")] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "Nợ Đầu Kỳ", italics: true, color: "FF0000" })], alignment: AlignmentType.CENTER })] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph({ text: financials.opening > 0 ? fmtMoney(financials.opening) : "-", alignment: AlignmentType.RIGHT })] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph({ text: financials.opening < 0 ? fmtMoney(Math.abs(financials.opening)) : "-", alignment: AlignmentType.RIGHT })] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
        ]
    });

    // Dòng dữ liệu
    const detailRows = allItems.map((item, index) => {
        sumAmount += Number(item.amount);
        sumPayment += Number(item.payment);
        return new TableRow({
            children: [
                new TableCell({ margins: cellMargin, children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })] }), // Thêm STT
                new TableCell({ margins: cellMargin, children: [new Paragraph({ text: format(new Date(item.date), 'dd/MM/yyyy'), alignment: AlignmentType.CENTER })] }),
                new TableCell({ margins: cellMargin, children: [new Paragraph(item.name)] }),
                new TableCell({ margins: cellMargin, children: [new Paragraph({ text: item.unit, alignment: AlignmentType.CENTER })] }),
                new TableCell({ margins: cellMargin, children: [new Paragraph({ text: item.qty ? item.qty.toString() : "", alignment: AlignmentType.CENTER })] }),
                new TableCell({ margins: cellMargin, children: [new Paragraph({ text: item.price ? fmtMoney(item.price) : "", alignment: AlignmentType.RIGHT })] }),
                new TableCell({ margins: cellMargin, children: [new Paragraph({ text: item.amount ? fmtMoney(item.amount) : "-", alignment: AlignmentType.RIGHT })] }),
                new TableCell({ margins: cellMargin, children: [new Paragraph({ text: item.payment ? fmtMoney(item.payment) : "-", alignment: AlignmentType.RIGHT })] }),
                new TableCell({ margins: cellMargin, children: [new Paragraph(item.note)] }),
            ]
        });
    });

    // Dòng Tổng
    const totalRow = new TableRow({
        children: [
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "Tổng", bold: true })], alignment: AlignmentType.CENTER })] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: fmtMoney(sumAmount), bold: true })], alignment: AlignmentType.RIGHT })] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: fmtMoney(sumPayment), bold: true })], alignment: AlignmentType.RIGHT })] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
        ]
    });

   // Dòng Tổng nợ phải thu (Cuối kỳ)
    const closingRow = new TableRow({
        children: [
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
            new TableCell({ columnSpan: 5, margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: "Tổng nợ phải thu", bold: true, color: "FF0000" })], alignment: AlignmentType.CENTER })] }),
            new TableCell({ columnSpan: 2, margins: cellMargin, children: [new Paragraph({ children: [new TextRun({ text: fmtMoney(financials.closing), bold: true, color: "FF0000" })], alignment: AlignmentType.CENTER })] }),
            new TableCell({ margins: cellMargin, children: [new Paragraph("")] }),
        ]
    });

    // --- 5. FOOTER (NGÀY THÁNG & 3 BÊN) ---
    const today = new Date();
    const dateStr = `Ngày ${format(today, 'dd')} tháng ${format(today, 'MM')} năm ${format(today, 'yyyy')}`;

    const footerTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE } },
        rows: [
            // Dòng Ngày tháng (Căn phải)
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph("")] }),
                    new TableCell({ children: [new Paragraph("")] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: dateStr, italics: true })], alignment: AlignmentType.CENTER })] }),
                ]
            }),
            // Dòng Chức danh (3 cột)
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Khách hàng", bold: true })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Đại diện công ty", bold: true })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Người lập phiếu", bold: true })], alignment: AlignmentType.CENTER })] }),
                ]
            }),
            // Dòng Ký tên
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "(Ký, ghi rõ họ tên)", italics: true, size: 20 })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "(Ký, đóng dấu)", italics: true, size: 20 })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "(Ký, ghi rõ họ tên)", italics: true, size: 20 })], alignment: AlignmentType.CENTER })] }),
                ]
            })
        ]
    });

    // --- TẠO DOCUMENT ---
    const doc = new Document({
       sections: [{
            properties: {
                page: {
                    margin: {
                        top: 567, // ~1cm
                        right: 567,
                        bottom: 567,
                        left: 567,
                    },
                },
            },
            children: [
                headerTable, // 1. Header có Logo
                
                new Paragraph({ text: "", spacing: { after: 200 } }), // Khoảng cách

                new Paragraph({ 
                    children: [new TextRun({ text: "ĐỐI CHIẾU CÔNG NỢ KHÁCH HÀNG", bold: true, size: 28, color: "FF0000" })], // Đỏ tươi
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 }
                }),

                // Thông tin khách hàng (Cập nhật địa chỉ đầy đủ)
                new Paragraph({ children: [
                    new TextRun({ text: "Tên khách hàng: ", size: 22 }),
                    new TextRun({ text: info.name, bold: true, size: 22 })
                ]}),
                new Paragraph({ children: [
                    new TextRun({ text: "Địa chỉ: ", size: 22 }),
                    new TextRun({ 
                        text: [info.address, info.district, info.province].filter(Boolean).join(', '), 
                        size: 22 
                    })
                ]}),
                new Paragraph({ children: [
                    new TextRun({ text: "Điện thoại: ", size: 22 }),
                    new TextRun({ text: info.phone, size: 22 })
                ], spacing: { after: 200 }}),

                // Bảng chi tiết
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        tableHeaderRow,
                        openingRow,
                        ...detailRows,
                        totalRow,
                        closingRow
                    ],
                }),

                new Paragraph({ text: "", spacing: { after: 400 } }), // Khoảng cách trước chữ ký

                footerTable // Footer 3 bên
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
};