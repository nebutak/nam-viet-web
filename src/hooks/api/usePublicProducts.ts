import { useQuery } from "@tanstack/react-query";
import publicApi from "@/lib/publicAxios";
import type { ApiResponse, PaginationParams, Product, ProductFilters } from "@/types";

// Public product query keys
export const publicProductKeys = {
  all: ["public-products"] as const,
  lists: () => [...publicProductKeys.all, "list"] as const,
  list: (filters?: ProductFilters & PaginationParams) =>
    [...publicProductKeys.lists(), filters] as const,
  details: () => [...publicProductKeys.all, "detail"] as const,
  detail: (id: number) => [...publicProductKeys.details(), id] as const,
};

export function usePublicProducts(params?: ProductFilters & PaginationParams) {
  return useQuery({
    queryKey: publicProductKeys.list(params),
    queryFn: async () => {
      const response = await publicApi.get<ApiResponse<Product[]>>(
        "/products/public",
        { params }
      );
      return response as unknown as ApiResponse<Product[]>;
    },
    staleTime: 5 * 60 * 1000, // 5 phút cache
  });
}

export function usePublicProduct(id: number, enabled = true) {
  return useQuery({
    queryKey: publicProductKeys.detail(id),
    queryFn: async () => {
      const response = await publicApi.get<ApiResponse<Product>>(
        `/products/public/${id}`
      );
      return (response as unknown as ApiResponse<Product>).data;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}
