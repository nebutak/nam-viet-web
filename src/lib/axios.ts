import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "./constants";
import { useAuthStore } from "@/stores";

// Tạo axios instance hỗ trợ gửi cookies
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  // Cho phép gửi cookies (refreshToken) kèm mỗi request
  withCredentials: true,
});

// Request Interceptor - Thêm access token vào Authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy access token từ Zustand store (Memory)
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý lỗi và tự động refresh token
api.interceptors.response.use(
  (response) => {
    // Unwrap response (chỉ 1 lần duy nhất)
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Xử lý lỗi 401 - Token hết hạn
    // Bỏ qua refresh token cho endpoints login/verify-otp
    const isLoginRequest = originalRequest.url?.includes("/auth/login");
    const isVerifyOtpRequest = originalRequest.url?.includes("/auth/verify-otp");
    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh-token");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest &&
      !isVerifyOtpRequest &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        // Gọi endpoint refresh token
        // Body rỗng - refreshToken được lấy từ HttpOnly cookie
        // Cookie được gửi tự động nhờ withCredentials: true
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {}, // Body rỗng (refreshToken lấy từ cookie)
          {
            withCredentials: true, // Gửi cookies kèm request
          }
        );

        // Backend trả về: { success: true, data: { accessToken: "..." } }
        // axios.post không qua interceptor, nên nhận raw response
        
        const responseData = response.data;
        const newAccessToken = responseData?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Không lấy được access token từ refresh response");
        }

        // Cập nhật token trong store (Memory)
        useAuthStore.getState().setToken(newAccessToken);

        // Gửi lại request gốc với token mới
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại - Session hết hạn hoặc không hợp lệ
        // Xóa thông tin auth và redirect về login
        useAuthStore.getState().logout();

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (!currentPath.includes("/login")) {
            const redirectUrl = encodeURIComponent(currentPath);
            window.location.href = `/login?redirect=${redirectUrl}`;
          }
        }

        return Promise.reject(refreshError);
      }
    }

    // Xử lý các lỗi khác
    const errorMessage = error.response?.data || error.message || "Đã xảy ra lỗi";

    return Promise.reject(errorMessage);
  }
);

export default api;
