import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DebtReconciliationParams } from "@/types/debt-reconciliation.types";

interface DebtReconciliationState {
  // --- Filters State ---
  filters: DebtReconciliationParams;
  setFilters: (filters: Partial<DebtReconciliationParams>) => void;
  resetFilters: () => void;
  
  // --- Modal State ---
  isCreateModalOpen: boolean; // Dùng cho Modal "Tạo / Cập nhật" (SyncSnap/SyncFull)
  isEmailModalOpen: boolean;  // Dùng cho Modal Gửi Email
  
  // ID của bản ghi đang được chọn (để gửi email hoặc xem chi tiết)
  selectedId: number | null; 
  
  // --- Modal Actions ---
  openCreateModal: () => void;
  closeCreateModal: () => void;
  
  openEmailModal: (id: number) => void;
  closeEmailModal: () => void;
}

// ✅ LOGIC MỚI: Định nghĩa giá trị mặc định cho tất cả bộ lọc
const DEFAULT_FILTERS: DebtReconciliationParams = {
  page: 1,
  limit: 20,
  search: "",
  
  // Mặc định là năm hiện tại. Nếu user xóa năm thì sẽ thành undefined (Xem mới nhất)
  year: new Date().getFullYear(), 
  
  status: undefined, 
  sortBy: "updatedAt", 
  sortOrder: "desc",

  // ✅ BỔ SUNG CÁC BỘ LỌC MỚI (Để reset hoạt động đúng)
  assignedUserId: undefined,  // Người phụ trách
  province: undefined,        // Tỉnh thành
  type: undefined             // Loại đối tượng (KH/NCC)
};

export const useDebtReconciliationStore = create<DebtReconciliationState>()(
  persist(
    (set) => ({
      // Initial State
      filters: DEFAULT_FILTERS,
      isCreateModalOpen: false,
      isEmailModalOpen: false,
      selectedId: null,

      // Actions
      setFilters: (newFilters) =>
        set((state) => ({ 
           // Merge filter cũ với filter mới
           filters: { ...state.filters, ...newFilters } 
        })),

      // Reset về mặc định (bao gồm cả việc xóa tỉnh, loại, phụ trách...)
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      // Modals Logic
      openCreateModal: () => set({ isCreateModalOpen: true }),
      closeCreateModal: () => set({ isCreateModalOpen: false }),

      openEmailModal: (id) => set({ isEmailModalOpen: true, selectedId: id }),
      closeEmailModal: () => set({ isEmailModalOpen: false, selectedId: null }),
    }),
    {
      name: "debt-reconciliation-storage", // Key lưu trong LocalStorage
      storage: createJSONStorage(() => localStorage),
      // Chỉ lưu filters để khi F5 không bị mất trạng thái lọc
      partialize: (state) => ({ filters: state.filters }), 
    }
  )
);