import { QueryClient, DefaultOptions } from "@tanstack/react-query";

// Default options cho React Query
const queryConfig: DefaultOptions = {
  queries: {
    retry: 1, // Retry 1 lần khi thất bại
    refetchOnWindowFocus: false, // Không refetch khi focus window
    staleTime: 5 * 60 * 1000, // Data được coi là fresh trong 5 phút
    gcTime: 10 * 60 * 1000, // Cache data trong 10 phút (trước đây là cacheTime)
  },
  mutations: {
    retry: 0, // Không retry mutations
  },
};

// Query Client instance
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});
