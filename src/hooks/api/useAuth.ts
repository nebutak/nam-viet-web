import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores";
import type {
  LoginCredentials,
  LoginResponse,
  AuthUser,
  ApiResponse,
  OTPRequiredResponse,
  OTPVerificationResponse,
  VerifyOTPRequest,
  ResendOTPResponse,
} from "@/types";
import { toast } from "react-hot-toast";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

// Login Mutation (Step 1: Email + Password)
export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<ApiResponse<LoginResponse | OTPRequiredResponse>>(
        "/auth/login",
        credentials
      );
      return response.data;
    },
    onError: (error: any) => {
      const message =
        error?.error?.message ||
        error?.error ||
        error?.message ||
        (typeof error === 'string' ? error : null) ||
        "Đăng nhập thất bại!";

      toast.error(message);
    },
  });
}

// Verify OTP Mutation (Step 2: Verify OTP code)
export function useVerifyOTP() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: VerifyOTPRequest) => {
      const response = await api.post<ApiResponse<OTPVerificationResponse>>(
        "/auth/verify-otp",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Data', data);
      const { user, tokens } = data as unknown as OTPVerificationResponse;
      const { accessToken } = tokens;

      login(user, accessToken);

      toast.success("Xác thực thành công!");
      router.push("/");
    },
    onError: (error: any) => {
      const message =
        error?.error?.message ||
        error?.error ||
        error?.message ||
        (typeof error === "string" ? error : null) ||
        "Mã xác thực không đúng!";

      toast.error(message);
    },
  });
}

// Resend OTP Mutation
export function useResendOTP() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post<ApiResponse<ResendOTPResponse>>(
        "/auth/resend-otp",
        { email }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Mã xác thực mới đã được gửi đến email của bạn!");
    },
    onError: (error: any) => {
      const message =
        error?.error?.message ||
        error?.error ||
        error?.message ||
        (typeof error === "string" ? error : null) ||
        "Không thể gửi lại mã xác thực!";

      toast.error(message);
    },
  });
}

// Logout Mutation
export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call API to clear server-side session
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      // Clear client state
      logout();

      // Clear all cached queries
      queryClient.clear();

      toast.success("Đăng xuất thành công!");

      // Redirect về login
      router.push("/login");
    },
    onError: () => {
      // Even if logout API fails, clear client state
      logout();
      queryClient.clear();
      router.push("/login");
    },
  });
}

// Get Current User
export function useMe() {
  const { setUser, token } = useAuthStore();

  const query = useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await api.get<ApiResponse<AuthUser>>("/auth/me");
      return response.data;
    },
    retry: false,
    enabled: !!token,
    staleTime: Infinity,  // ← No auto-refetch
    gcTime: 0,            // ← Don't cache after unmount
  });

  React.useEffect(() => {
    if (query.data) {
      setUser((query as any).data);
    }
  }, [query.data, setUser]);

  return query;
}

// Forgot Password
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post<ApiResponse<void>>("/auth/forgot-password", {
        email,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Email khôi phục mật khẩu đã được gửi!");
    },
    onError: (error: any) => {
      const message = error?.error || error?.message || error || "Gửi email thất bại!";
      toast.error(typeof message === 'string' ? message : "Gửi email thất bại!");
    },
  });
}

// Reset Password
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      token,
      password,
    }: {
      token: string;
      password: string;
    }) => {
      const response = await api.post<ApiResponse<void>>("/auth/reset-password", {
        token,
        password,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công!");
      router.push("/login");
    },
    onError: (error: any) => {
      const message = error?.error || error?.message || error || "Đặt lại mật khẩu thất bại!";
      toast.error(typeof message === 'string' ? message : "Đặt lại mật khẩu thất bại!");
    },
  });
}

// Change Password
export function useChangePassword() {
  return useMutation({
    mutationFn: async ({
      current_password,
      new_password,
    }: {
      current_password: string;
      new_password: string;
    }) => {
      const response = await api.post<ApiResponse<void>>("/auth/change-password", {
        current_password,
        new_password,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
    },
    onError: (error: any) => {
      const message = error?.error || error?.message || error || "Đổi mật khẩu thất bại!";
      toast.error(typeof message === 'string' ? message : "Đổi mật khẩu thất bại!");
    },
  });
}
