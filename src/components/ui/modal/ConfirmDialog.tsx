import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "../button/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
  showNotes?: boolean; // Thêm prop để hiển thị input notes
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger",
  isLoading = false,
  showNotes = false,
}: ConfirmDialogProps) {
  const [notes, setNotes] = React.useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(notes);
    setNotes(""); // Reset sau khi confirm
  };

  const handleClose = () => {
    setNotes(""); // Reset khi đóng
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  const variantStyles = {
    danger: {
      icon: "text-red-600 dark:text-red-500",
      iconBg: "bg-red-100 dark:bg-red-900/20",
      button: "danger" as const,
    },
    warning: {
      icon: "text-yellow-600 dark:text-yellow-500",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
      button: "warning" as const,
    },
    info: {
      icon: "text-blue-600 dark:text-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      button: "primary" as const,
    },
    success: {
      icon: "text-green-600 dark:text-green-500",
      iconBg: "bg-green-100 dark:bg-green-900/20",
      button: "primary" as const,
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`rounded-lg p-2 ${styles.iconBg}`}>
              <AlertTriangle className={`h-6 w-6 ${styles.icon}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
          </div>
          {!isLoading && (
            <button
              onClick={handleClose}
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              type="button"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Message */}
        <div className="mb-6 ml-14">
          <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>

        {/* Notes Input (Optional) */}
        {showNotes && (
          <div className="mb-6 ml-14">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú..."
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              rows={3}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={styles.button}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
