import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "./useDebounce";

// Filter State Interface
interface FilterState {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

// Hook chính
export function useTableFilters<T extends FilterState>(
  initialFilters: T,
  debounceMs = 500
) {
  const [filters, setFiltersState] = useState<T>(initialFilters);

  // Debounce search để tránh call API liên tục khi typing
  const debouncedSearch = useDebounce(filters.search, debounceMs);

  // Debounced filters - dùng cho API calls
  const debouncedFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch]
  );

  // Set single filter
  const setFilter = useCallback((key: keyof T, value: any) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: value,
      // Reset về page 1 khi thay đổi filter (trừ page và limit)
      ...(key !== "page" && key !== "limit" ? { page: 1 } : {}),
    }));
  }, []);

  // Set multiple filters
  const setFilters = useCallback((newFilters: Partial<T>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      // Reset về page 1 khi thay đổi filters
      page: 1,
    }));
  }, []);

  // Reset filters về initial state
  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
  }, [initialFilters]);

  // Set page
  const setPage = useCallback((page: number) => {
    setFilter("page" as keyof T, page);
  }, [setFilter]);

  // Set limit (page size)
  const setLimit = useCallback((limit: number) => {
    setFiltersState((prev) => ({
      ...prev,
      limit: limit as any,
      page: 1, // Reset về page 1 khi thay đổi limit
    }));
  }, []);

  // Set sort
  const setSort = useCallback((sortBy: string, sortOrder: "asc" | "desc" = "asc") => {
    setFiltersState((prev) => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    }));
  }, []);

  // Toggle sort order
  const toggleSort = useCallback((sortBy: string) => {
    setFiltersState((prev) => {
      const isSameField = prev.sortBy === sortBy;
      const newOrder =
        isSameField && prev.sortOrder === "asc" ? "desc" : "asc";

      return {
        ...prev,
        sortBy: sortBy as any,
        sortOrder: newOrder as any,
      };
    });
  }, []);

  // Set search
  const setSearch = useCallback((search: string) => {
    setFilter("search" as keyof T, search);
  }, [setFilter]);

  // Clear search
  const clearSearch = useCallback(() => {
    setFilter("search" as keyof T, "");
  }, [setFilter]);

  // Check if any filter is active (excluding page, limit, sortBy, sortOrder)
  const hasActiveFilters = useMemo(() => {
    const filterKeys = Object.keys(filters).filter(
      (key) => !["page", "limit", "sortBy", "sortOrder"].includes(key)
    );

    return filterKeys.some((key) => {
      const value = filters[key as keyof T];
      return value !== undefined && value !== "" && value !== null;
    });
  }, [filters]);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    const filterKeys = Object.keys(filters).filter(
      (key) => !["page", "limit", "sortBy", "sortOrder"].includes(key)
    );

    return filterKeys.filter((key) => {
      const value = filters[key as keyof T];
      return value !== undefined && value !== "" && value !== null;
    }).length;
  }, [filters]);

  return {
    // State
    filters,
    debouncedFilters,
    hasActiveFilters,
    activeFiltersCount,

    // Actions
    setFilter,
    setFilters,
    resetFilters,
    setPage,
    setLimit,
    setSort,
    toggleSort,
    setSearch,
    clearSearch,
  };
}

// Type helper để extract filters từ hook
export type TableFilters<T extends FilterState> = ReturnType<
  typeof useTableFilters<T>
>;
