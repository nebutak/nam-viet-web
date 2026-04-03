import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import publicApi from "@/lib/publicAxios";
import type { ApiResponse, PaginationParams } from "@/types";
import type { News, NewsCategory } from "./useNews";

// Public news query keys
export const publicNewsKeys = {
  all: ["public-news"] as const,
  lists: () => [...publicNewsKeys.all, "list"] as const,
  list: (params?: any) => [...publicNewsKeys.lists(), params] as const,
  featured: () => [...publicNewsKeys.all, "featured"] as const,
  details: () => [...publicNewsKeys.all, "detail"] as const,
  detail: (slug: string) => [...publicNewsKeys.details(), slug] as const,
  related: (id: number) => [...publicNewsKeys.all, "related", id] as const,
  categories: () => ["public-news-categories"] as const,
};

export function usePublicNewsList(params?: PaginationParams & { search?: string; status?: string; categoryId?: number }) {
  return useQuery({
    queryKey: publicNewsKeys.list(params),
    queryFn: async () => {
      const response = await publicApi.get<ApiResponse<News[]>>("/news", {
        params: { ...params, status: "published" },
      });
      return response as unknown as ApiResponse<News[]>;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function usePublicFeaturedNews() {
  return useQuery({
    queryKey: publicNewsKeys.featured(),
    queryFn: async () => {
      const response = await publicApi.get<ApiResponse<News[]>>("/news/featured");
      return (response as unknown as ApiResponse<News[]>).data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicNewsBySlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: publicNewsKeys.detail(slug),
    queryFn: async () => {
      const response = await publicApi.get<ApiResponse<News>>(`/news/${slug}`);
      return (response as unknown as ApiResponse<News>).data;
    },
    enabled: enabled && !!slug,
    staleTime: 3 * 60 * 1000,
  });
}

export function usePublicRelatedNews(id: number, enabled = true) {
  return useQuery({
    queryKey: publicNewsKeys.related(id),
    queryFn: async () => {
      const response = await publicApi.get<ApiResponse<News[]>>(`/news/${id}/related`);
      return (response as unknown as ApiResponse<News[]>).data || [];
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicNewsCategories(params?: PaginationParams) {
  return useQuery({
    queryKey: publicNewsKeys.categories(),
    queryFn: async () => {
      const response = await publicApi.get<ApiResponse<NewsCategory[]>>("/news-categories", { params });
      return (response as unknown as ApiResponse<NewsCategory[]>).data || [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useIncrementNewsView() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await publicApi.post(`/news/${id}/view`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: publicNewsKeys.lists() });
    },
  });
}
