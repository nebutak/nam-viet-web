import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// UI State Interface
interface UIState {
  // Sidebar State
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;

  // Theme State
  theme: "light" | "dark";

  // Modal State
  modals: Record<string, boolean>;

  // Loading State
  globalLoading: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  collapseSidebar: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  setGlobalLoading: (loading: boolean) => void;
}

// UI Store - Quản lý UI state
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial State
      sidebarOpen: true,
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      theme: "light",
      modals: {},
      globalLoading: false,

      // Sidebar Actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      collapseSidebar: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      toggleMobileSidebar: () => {
        set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen }));
      },

      setMobileSidebarOpen: (open) => {
        set({ mobileSidebarOpen: open });
      },

      // Theme Actions
      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        set({ theme: newTheme });

        // Update document class
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", newTheme === "dark");
        }
      },

      setTheme: (theme) => {
        set({ theme });

        // Update document class
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },

      // Modal Actions
      openModal: (modalId) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: true },
        }));
      },

      closeModal: (modalId) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: false },
        }));
      },

      toggleModal: (modalId) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: !state.modals[modalId] },
        }));
      },

      // Loading Actions
      setGlobalLoading: (loading) => {
        set({ globalLoading: loading });
      },
    }),
    {
      name: "ui-storage",
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist theme và sidebar state
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
