import React from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import Button from "../button/Button";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  variant?: "success" | "danger" | "warning" | "info";
}

export default function AlertDialog({
  isOpen,
  onClose,
  title = "Thông báo",
  message,
  confirmText = "Đã hiểu",
  variant = "info",
}: AlertDialogProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const variantConfig = {
    success: {
      icon: CheckCircle,
      iconColor: "text-green-600 dark:text-green-500",
      iconBg: "bg-green-100 dark:bg-green-900/20",
      button: "primary" as const,
    },
    danger: {
      icon: AlertTriangle,
      iconColor: "text-red-600 dark:text-red-500",
      iconBg: "bg-red-100 dark:bg-red-900/20",
      button: "danger" as const,
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-600 dark:text-yellow-500",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
      button: "warning" as const,
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600 dark:text-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      button: "primary" as const,
    },
  };

  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`rounded-lg p-2 ${config.iconBg}`}>
              <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            type="button"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Message */}
        <div className="mb-6 ml-14">
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <Button
            type="button"
            variant={config.button}
            onClick={onClose}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}