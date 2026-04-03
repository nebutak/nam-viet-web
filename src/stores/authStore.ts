import { create } from "zustand";
import type { AuthUser } from "@/types";

// Auth State Interface
interface AuthState {
  // State
  user: AuthUser | null;
  token: string | null;  // AccessToken only (Memory)
  isAuthenticated: boolean;

  // Actions
  setUser: (user: AuthUser) => void;
  setToken: (token: string) => void;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;

  // Permissions
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;

  // Role
  isRole: (roleKey: string) => boolean;
}

// Auth Store (NO persist middleware - refreshToken managed by backend cookie)
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial State
  user: null,
  token: null,
  isAuthenticated: false,

  // Set User
  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  // Set Token
  setToken: (token) => {
    set({ token });
  },

  // Login
  login: (user, token) => {
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  // Logout - Clear everything
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  // Check Permission
  hasPermission: (permission) => {
    const { user } = get();
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  },

  // Check Any Permission
  hasAnyPermission: (permissions) => {
    const { user } = get();
    if (!user || !user.permissions) return false;
    return permissions.some((p) => user.permissions.includes(p));
  },

  // Check All Permissions
  hasAllPermissions: (permissions) => {
    const { user } = get();
    if (!user || !user.permissions) return false;
    return permissions.every((p) => user.permissions.includes(p));
  },

  // Check Role
  isRole: (roleKey) => {
    const { user } = get();
    return user?.role?.roleKey === roleKey;
  },
}));
