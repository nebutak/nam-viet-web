import axios from "axios";
import { API_URL } from "./constants";

/**
 * Public axios instance - không cần auth token
 * Dùng cho các trang công khai: showcase sản phẩm, community feed
 */
const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor - Unwrap data
publicApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage =
      error.response?.data || error.message || "Đã xảy ra lỗi";
    return Promise.reject(errorMessage);
  }
);

export default publicApi;
