"use client";

import React, { useState } from "react";
import { XCircle, X } from "lucide-react";
import Button from "../button/Button";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title?: string;
  message?: string;
  placeholder?: string;
  action?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function CancelModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Hủy giao dịch",
  message = "Vui lòng nhập lý do hủy giao dịch này:",
  confirmText = "Xác nhận hủy",
  placeholder = "Nhập lý do hủy giao dịch...",
  action="hủy",
  cancelText = "Đóng",
  isLoading = false,
}: CancelModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      return;
    }
    onConfirm(reason.trim());
    setReason(""); // Reset after confirm
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason("");
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
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
        <div className="mb-4 ml-14">
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>

        {/* Textarea */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Lý do {action} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={placeholder}
            rows={4}
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:disabled:bg-gray-700"
          />
          {!reason.trim() && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Lý do không được để trống
            </p>
          )}
        </div>

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
            variant="danger"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={!reason.trim() || isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
