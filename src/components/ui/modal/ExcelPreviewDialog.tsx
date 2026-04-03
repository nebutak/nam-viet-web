import React from "react";
import { Download, X } from "lucide-react";
import Button from "@/components/ui/button/Button";

interface ExcelPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  data: any[];
  fileName?: string;
}

export default function ExcelPreviewDialog({
  isOpen,
  onClose,
  onExport,
  data,
  fileName = "export.xlsx",
}: ExcelPreviewDialogProps) {
  if (!isOpen) return null;

  // Get headers from the first item
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Xem trước khi xuất Excel
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Kiểm tra dữ liệu trước khi tải xuống file "{fileName}"
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Table Preview */}
        <div className="flex-1 overflow-auto p-0">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <p>Không có dữ liệu để hiển thị</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    #
                  </th>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.map((row, index) => (
                  <tr 
                    key={index}
                    className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>
                    {headers.map((header) => (
                      <td
                        key={`${index}-${header}`}
                        className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-gray-100"
                      >
                        {row[header]?.toString() || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Tổng số: <span className="font-medium">{data.length}</span> dòng
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button variant="primary" onClick={onExport} disabled={data.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Xác nhận xuất file
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
