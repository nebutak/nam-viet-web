"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { onEvent, offEvent } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/hooks/api/useNotifications";
import type { Notification } from "@/types/notification.types";
import {
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPE_COLORS,
} from "@/types/notification.types";

export function useNotificationToast() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNotification = (data: { notification: Notification }) => {
      const notification = data.notification;

      // Show toast notification
      const message = `${notification.title}\n${notification.message}`;
      const colors = NOTIFICATION_TYPE_COLORS[notification.notification_type];

      // Determine toast type based on notification type
      const toastType = getToastType(notification.notification_type);

      // Show toast with custom styling
      toast(message, {
        icon: getToastIcon(notification.notification_type),
        duration: 5000,
        position: "top-right",
        style: {
          borderLeft: `4px solid ${getToastBorderColor(notification.notification_type)}`,
        },
        // Custom class for styling
        className: "notification-toast",
      });

      // Invalidate queries to refetch notifications
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(),
      });
    };

    // Subscribe to notification events
    onEvent("notification", handleNotification);

    // Cleanup
    return () => {
      offEvent("notification", handleNotification);
    };
  }, [queryClient]);
}

/**
 * Get toast type based on notification type
 */
function getToastType(type: string): "success" | "error" | "loading" | "default" {
  const typeMap: Record<string, "success" | "error" | "loading" | "default"> = {
    system: "default",
    low_stock: "error",
    expiry_warning: "error",
    debt_overdue: "error",
    order_new: "success",
    approval_required: "default",
    reminder: "default",
    announcement: "default",
  };
  return typeMap[type] || "default";
}

/**
 * Get toast icon based on notification type
 */
function getToastIcon(type: string): string {
  const iconMap: Record<string, string> = {
    system: "ℹ️",
    low_stock: "📦",
    expiry_warning: "⚠️",
    debt_overdue: "💰",
    order_new: "🛒",
    approval_required: "✅",
    reminder: "🔔",
    announcement: "📢",
  };
  return iconMap[type] || "ℹ️";
}

/**
 * Get toast border color based on notification type
 */
function getToastBorderColor(type: string): string {
  const colorMap: Record<string, string> = {
    system: "#6b7280", // gray
    low_stock: "#f59e0b", // yellow
    expiry_warning: "#f97316", // orange
    debt_overdue: "#ef4444", // red
    order_new: "#10b981", // green
    approval_required: "#8b5cf6", // purple
    reminder: "#3b82f6", // blue
    announcement: "#6366f1", // indigo
  };
  return colorMap[type] || "#6b7280";
}

export default useNotificationToast;
