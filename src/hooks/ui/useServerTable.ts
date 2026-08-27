import { useState, useCallback, useEffect } from "react";
import { searchDebounceMs } from "@/constants";

export interface UseServerTableResult<TFilters> {
  currentPage: number;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSortChange: (col: string | null, dir: "asc" | "desc") => void;
  searchText: string;
  debouncedSearchText: string;
  onSearchChange: (text: string) => void;
  appliedFilters: TFilters;
  onFiltersChange: (filters: TFilters) => void;
}

export function useServerTable<TFilters>(
  initialFilters: TFilters,
  initialSortColumn: string | null = "nom",
  options: {
    initialSortDirection?: "asc" | "desc";
    initialSearchText?: string;
    initialPage?: number;
    initialPageSize?: number;
    debounceMs?: number;
  } = {},
): UseServerTableResult<TFilters> {
  const [currentPage, setCurrentPage] = useState(options.initialPage ?? 1);
  const [pageSize, setPageSize] = useState(options.initialPageSize ?? 10);
  const [sortColumn, setSortColumn] = useState<string | null>(initialSortColumn);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(options.initialSortDirection ?? "asc");
  const [searchText, setSearchText] = useState(options.initialSearchText ?? "");
  const [debouncedSearchText, setDebouncedSearchText] = useState(options.initialSearchText ?? "");
  const [appliedFilters, setAppliedFilters] = useState<TFilters>(initialFilters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, options.debounceMs ?? searchDebounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText, options.debounceMs]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback((filters: TFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((col: string | null, dir: "asc" | "desc") => {
    setSortColumn(col);
    setSortDirection(dir);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    onPageChange: setCurrentPage,
    pageSize,
    onPageSizeChange: handlePageSizeChange,
    sortColumn,
    sortDirection,
    onSortChange: handleSortChange,
    searchText,
    debouncedSearchText,
    onSearchChange: handleSearchChange,
    appliedFilters,
    onFiltersChange: handleFiltersChange,
  };
}
