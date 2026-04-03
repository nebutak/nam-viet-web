import React from "react";
import { X, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "../button/Button";

interface ImportError {
  row: number;
  sku: string;
  message: string;
}

interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  validCount: number;
  errorCount: number;
  duplicateCount: number;
  errors: ImportError[];
  duplicates: Array<{ row: number; sku: string }>;
  isLoading?: boolean;
  itemName?: string; // "bao bì", "nhà cung cấp", etc.
  itemLabel?: string; // "SKU", "Mã NCC", etc.
}

export default function ImportPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  validCount,
  errorCount,
  duplicateCount,
  errors,
  duplicates,
  isLoading = false,
  itemName = "sản phẩm",
  itemLabel = "SKU",
}: ImportPreviewModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
              <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Xem trước nhập dữ liệu
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Kiểm tra kết quả trước khi nhập vào hệ thống
              </p>
            </div>
          </div>
          {!isLoading && (
            <button
              onClick={onClose}
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              type="button"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
              <div>
                <p className="text-sm text-green-700 dark:text-green-400">Hợp lệ</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                  {validCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Trùng lặp</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                  {duplicateCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">Lỗi</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                  {errorCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Errors Section */}
        {(errorCount > 0 || duplicateCount > 0) && (
          <div className="mb-6">
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
              Chi tiết lỗi và trùng lặp
            </h3>

            {/* Duplicate Items */}
            {duplicates.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium text-yellow-700 dark:text-yellow-400">
                  {itemName.charAt(0).toUpperCase() + itemName.slice(1)} trùng lặp với dữ liệu hiện có ({duplicates.length}):
                </p>
                <div className="max-h-32 overflow-y-auto rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/30 dark:bg-yellow-900/10">
                  {duplicates.map((item, idx) => (
                    <div
                      key={idx}
                      className="mb-1 flex justify-between text-sm text-yellow-700 dark:text-yellow-400"
                    >
                      <span>Dòng {item.row}:</span>
                      <span className="font-mono">{item.sku}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Items */}
            {errors.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-red-700 dark:text-red-400">
                  Lỗi dữ liệu ({errors.length}):
                </p>
                <div className="max-h-32 overflow-y-auto rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/30 dark:bg-red-900/10">
                  {errors.map((error, idx) => (
                    <div
                      key={idx}
                      className="mb-2 text-sm text-red-700 dark:text-red-400"
                    >
                      <span className="block">
                        <span className="font-semibold">Dòng {error.row} ({itemLabel}: {error.sku}):</span>{" "}
                        {error.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={validCount === 0}
          >
            Nhập {validCount} {itemName}
          </Button>
        </div>
      </div>
    </div>
  );
}
