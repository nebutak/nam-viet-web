import { create } from "zustand";

// Notification Interface
export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  is_read: boolean;
  created_at: string;
  data?: any;
}

// Notification State Interface
interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  removeNotification: (id: number) => void;
  clearAll: () => void;
  updateUnreadCount: () => void;
}

// Notification Store - Quản lý real-time notifications
export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial State
  notifications: [],
  unreadCount: 0,

  // Set Notifications (khi fetch từ API)
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    set({ notifications, unreadCount });
  },

  // Add Notification (khi nhận từ Socket.io)
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.is_read ? state.unreadCount : state.unreadCount + 1,
    }));
  },

  // Mark As Read
  markAsRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.is_read).length;
      return { notifications, unreadCount };
    });
  },

  // Mark All As Read
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    }));
  },

  // Remove Notification
  removeNotification: (id) => {
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      const unreadCount = notifications.filter((n) => !n.is_read).length;
      return { notifications, unreadCount };
    });
  },

  // Clear All
  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  // Update Unread Count
  updateUnreadCount: () => {
    const { notifications } = get();
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    set({ unreadCount });
  },
}));
