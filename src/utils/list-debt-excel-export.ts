import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export const exportDebtToExcel = (data: any[], year: number, type: string) => {
  // 1. Định nghĩa tiêu đề cột (giống file mẫu của bạn)
  const headers = [
    "STT",
    "TÊN KHÁCH HÀNG / NCC",
    "ĐIỆN THOẠI",
    "PHỤ TRÁCH",
    "NHÓM KHÁCH HÀNG", // Hoặc Nhóm NCC
    "TỈNH/THÀNH",
    "GHI CHÚ",
    "NỢ ĐẦU KỲ",
    "TỔNG MUA (+)",
    "TRẢ HÀNG (-)", // Cột mới
    "ĐIỀU CHỈNH",   // Cột mới
    "THANH TOÁN (-)",
    "DƯ NỢ CUỐI KỲ"
  ];

  // 2. Map dữ liệu vào từng dòng
  const rows = data.map((item, index) => [
    index + 1,                          // STT
    item.name,                          // Tên
    item.phone || '',                   // SĐT
    item.pic || '',                     // Phụ trách
    item.category || '',                // Nhóm
    item.location || '',                // Tỉnh/Thành
    item.customerNotes || '',           // Ghi chú
    Number(item.opening || 0),          // Nợ đầu kỳ
    Number(item.increase || 0),         // Tổng mua
    Number(item.returnAmt || 0),        // Trả hàng
    Number(item.adjustment || 0),       // Điều chỉnh
    Number(item.payment || 0),          // Thanh toán
    Number(item.closing || 0)           // Dư nợ
  ]);

  // 3. Tạo Worksheet
  // Thêm dòng tiêu đề công ty (Optional)
  const companyInfo = [
    ["CÔNG TY CỔ PHẦN HÓA SINH NAM VIỆT"],
    [`BẢNG TỔNG HỢP CÔNG NỢ NĂM ${year} (${type.toUpperCase()})`],
    [""] // Dòng trống
  ];

  // Gộp tất cả: Header công ty + Header bảng + Dữ liệu
  const worksheetData = [...companyInfo, headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // 4. Cấu hình độ rộng cột (cho đẹp)
  worksheet['!cols'] = [
    { wch: 5 },  // STT
    { wch: 35 }, // Tên
    { wch: 15 }, // SĐT
    { wch: 20 }, // Phụ trách
    { wch: 20 }, // Nhóm
    { wch: 25 }, // Tỉnh
    { wch: 20 }, // Ghi chú
    { wch: 15 }, // Đầu kỳ
    { wch: 15 }, // Mua
    { wch: 15 }, // Trả hàng
    { wch: 15 }, // Điều chỉnh
    { wch: 15 }, // Thanh toán
    { wch: 15 }, // Dư nợ
  ];

  // 5. Tạo Workbook và xuất file
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "CongNo");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
  saveAs(dataBlob, `TongHopCongNo_${type}_${year}_${format(new Date(), 'ddMMyyyy')}.xlsx`);
};