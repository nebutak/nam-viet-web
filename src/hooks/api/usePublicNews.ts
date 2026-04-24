import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import publicApi from "@/lib/publicAxios";
import type { ApiResponse, PaginationParams } from "@/types";

export interface NewsCategory {
  id: number;
  categoryName: string;
  slug?: string;
  _count?: { news: number };
}

export interface NewsComment {
  id: number;
  newsId: number;
  parentId?: number | null;
  authorName: string;
  authorEmail?: string | null;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  replies?: NewsComment[];
}

export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  contentType: "article" | "video";
  featuredImage?: string | null;
  videoFile?: string | null;
  videoThumbnail?: string | null;
  categoryId: number;
  category?: NewsCategory;
  author?: { id: number; fullName: string; avatarUrl?: string | null };
  status: "draft" | "published" | "archived";
  publishedAt?: string | null;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount?: number;
  isFeatured?: boolean;
  newsTagRelations?: Array<{ tag: { id: number; tagName: string; slug: string } }>;
}

// Public news query keys
export const publicNewsKeys = {
  all: ["public-news"] as const,
  lists: () => [...publicNewsKeys.all, "list"] as const,
  list: (params?: any) => [...publicNewsKeys.lists(), params] as const,
  featured: () => [...publicNewsKeys.all, "featured"] as const,
  details: () => [...publicNewsKeys.all, "detail"] as const,
  detail: (slug: string) => [...publicNewsKeys.details(), slug] as const,
  related: (id: number) => [...publicNewsKeys.all, "related", id] as const,
  engagement: (id: number, clientId?: string) => [...publicNewsKeys.all, "engagement", id, clientId] as const,
  comments: (id: number) => [...publicNewsKeys.all, "comments", id] as const,
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

export function usePublicNewsEngagement(id: number, clientId?: string, enabled = true) {
  return useQuery({
    queryKey: publicNewsKeys.engagement(id, clientId),
    queryFn: async () => {
      const response = await publicApi.get<ApiResponse<any>>(`/news/${id}/engagement`, {
        params: clientId ? { clientId } : undefined,
      });
      return (response as unknown as ApiResponse<any>).data;
    },
    enabled: enabled && !!id,
    staleTime: 30 * 1000,
  });
}

export function useToggleNewsLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, clientId }: { id: number; clientId: string }) => {
      const response = await publicApi.post<ApiResponse<{ liked: boolean; likeCount: number }>>(`/news/${id}/like`, { clientId });
      return (response as unknown as ApiResponse<{ liked: boolean; likeCount: number }>).data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: publicNewsKeys.engagement(variables.id, variables.clientId) });
      queryClient.invalidateQueries({ queryKey: publicNewsKeys.details() });
      queryClient.invalidateQueries({ queryKey: publicNewsKeys.lists() });
    },
  });
}

export function usePublicNewsComments(id: number, enabled = true) {
  return useQuery({
    queryKey: publicNewsKeys.comments(id),
    queryFn: async () => {
      const response = await publicApi.get<ApiResponse<NewsComment[]>>(`/news/${id}/comments`);
      return (response as unknown as ApiResponse<NewsComment[]>).data || [];
    },
    enabled: enabled && !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateNewsComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { authorName: string; authorEmail?: string; content: string; parentId?: number };
    }) => {
      const response = await publicApi.post<ApiResponse<NewsComment>>(`/news/${id}/comments`, data);
      return (response as unknown as ApiResponse<NewsComment>).data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: publicNewsKeys.comments(variables.id) });
      queryClient.invalidateQueries({ queryKey: publicNewsKeys.engagement(variables.id) });
      queryClient.invalidateQueries({ queryKey: publicNewsKeys.details() });
      queryClient.invalidateQueries({ queryKey: publicNewsKeys.lists() });
    },
  });
}

export function useTrackNewsShare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      platform,
      clientId,
    }: {
      id: number;
      platform: "facebook" | "copy_link" | "instagram" | "native";
      clientId?: string;
    }) => {
      const response = await publicApi.post<ApiResponse<{ shareCount: number }>>(`/news/${id}/share`, { platform, clientId });
      return (response as unknown as ApiResponse<{ shareCount: number }>).data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: publicNewsKeys.engagement(variables.id, variables.clientId) });
    },
  });
}
