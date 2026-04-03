import { useAuthStore } from "@/stores";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import api from "@/lib/axios";

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();

  // Logout và gọi API để xóa server-side session
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear client state bất kể API response
      authStore.logout();
      router.push("/login");
    }
  }, [authStore, router]);

  // Check nếu chưa login thì redirect về login
  const requireAuth = useCallback(() => {
    if (!authStore.isAuthenticated) {
      router.push("/login");
      return false;
    }
    return true;
  }, [authStore.isAuthenticated, router]);

  // Check nếu đã login thì redirect về dashboard
  const redirectIfAuthenticated = useCallback(() => {
    if (authStore.isAuthenticated) {
      router.push("/dashboard");
      return true;
    }
    return false;
  }, [authStore.isAuthenticated, router]);

  return {
    // State
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,

    // Actions
    login: authStore.login,
    logout,
    setUser: authStore.setUser,
    setToken: authStore.setToken,

    // Permissions
    hasPermission: authStore.hasPermission,
    hasAnyPermission: authStore.hasAnyPermission,
    hasAllPermissions: authStore.hasAllPermissions,
    isRole: authStore.isRole,

    // Helpers
    requireAuth,
    redirectIfAuthenticated,
  };
}
