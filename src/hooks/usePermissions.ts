import { useAuthStore } from "@/stores";

export function usePermissions() {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isRole, user } = useAuthStore();

  return {
    // Check single permission
    hasPermission,

    // Check any of permissions
    hasAnyPermission,

    // Check all permissions
    hasAllPermissions,

    // Check by module
    canView: (module: string) => hasPermission(`view_${module}`),
    canCreate: (module: string) => hasPermission(`create_${module}`),
    canUpdate: (module: string) => hasPermission(`update_${module}`),
    canDelete: (module: string) => hasPermission(`delete_${module}`),
    canApprove: (module: string) => hasPermission(`approve_${module}`),
    canExport: (module: string) => hasPermission(`export_${module}`),

    // Check by role
    isAdmin: () => isRole("admin"),
    isAccountant: () => isRole("accountant"),
    isWarehouseManager: () => isRole("warehouse_manager"),
    isWarehouseStaff: () => isRole("warehouse_staff"),
    isProductionManager: () => isRole("production_manager"),
    isSalesStaff: () => isRole("sales_staff"),
    isDeliveryStaff: () => isRole("delivery_staff"),

    // Get current user
    user,

    // Check warehouse access
    hasWarehouseAccess: (warehouseId: number) => {
      if (!user) return false;
      // Admin và warehouse manager có quyền truy cập tất cả warehouse
      if (isRole("admin") || isRole("warehouse_manager")) return true;
      // Warehouse staff chỉ truy cập warehouse được assign
      return user.warehouseId === warehouseId;
    },
  };
}
