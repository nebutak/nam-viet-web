"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores";
import api from "@/lib/axios";

interface RefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    expiresIn: number;
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authStore = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Bước 1: Kiểm tra xem bạn đã được xác thực trong phiên hiện tại chưa.
        if (useAuthStore.getState().token) {
          setIsInitialized(true);
          return;
        }

        // Bước 2: Thử khôi phục phiên từ cookie HttpOnly
        const refreshResponse = await api.post("/auth/refresh-token", {}) as unknown as RefreshResponse;

        if (refreshResponse?.data.accessToken) {
          // Token được khôi phục từ cookie
          authStore.setToken(refreshResponse.data.accessToken);

          // Bước 3: Lấy thông tin và quyền của người dùng
          // Điều này đảm bảo chúng ta luôn có các quyền mới nhất từ ​​cơ sở dữ liệu.
          const meResponse = await api.get("/auth/me");
          if (meResponse) {
            authStore.setUser(meResponse.data);
          }

          setIsInitialized(true);
        }
      } catch (error) {
        // Không có refreshToken hợp lệ trong cookie.
        // Người dùng nên đăng nhập
        // For public site, no redirect needed if they are not logged in.
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Removed blocking loading screen so the public site is always SEO friendly and fast.
  return <>{children}</>;
}
