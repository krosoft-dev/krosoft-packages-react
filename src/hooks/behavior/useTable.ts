import { pageDefault, pageSizeDefault, searchDebounceMs } from "@/constants";
import type { PaginationQuery, PaginationResult, SortOption } from "@krosoft/core/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "./useDebounce";

interface UseTableProps<TQueryParams, TResult> {
  queryKey: string[];
  queryFn: (queryParams: TQueryParams, sortOptions: SortOption[]) => Promise<PaginationResult<TResult>>;
  defaultSortField?: string;
  defaultSortDirection?: "asc" | "desc";
  additionalQueryParams?: Partial<TQueryParams>;
  enabled?: boolean;
  /** Paramètres d'URL propres à la table (filtres métier) à effacer lors d'une réinitialisation. */
  resetUrlParams?: string[];
  onResetFilters?: () => void;
}

export const useTable = <TQueryParams extends PaginationQuery, TResult>({
  queryKey: baseQueryKey,
  queryFn,
  defaultSortField = "",
  defaultSortDirection = "asc",
  additionalQueryParams = {},
  resetUrlParams = [],
  onResetFilters = () => {},
  enabled = true,
}: UseTableProps<TQueryParams, TResult>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL
  const initPage = parseInt(searchParams.get("page") || pageDefault.toString(), 10);
  const initSearch = searchParams.get("search") || "";
  const initSortField = searchParams.get("sortField") || defaultSortField;
  const initSortDirection = (searchParams.get("sortDirection") as "asc" | "desc") || defaultSortDirection;

  const [pageNumber, setPageNumber] = useState(initPage);
  const [pageSize, setPageSizeState] = useState(pageSizeDefault);

  // Changer la taille de page repart de la première page : conserver la page courante
  // pourrait pointer au-delà de la dernière page du nouveau découpage.
  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPageNumber(pageDefault);
  }, []);
  const [search, setSearch] = useState(initSearch);
  const [sortField, setSortField] = useState(initSortField);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initSortDirection);

  // `search` alimente l'input et reste donc immédiat ; seule la valeur débouncée déclenche
  // la requête, la synchronisation d'URL et le retour à la première page.
  const [debouncedSearch, flushSearch] = useDebounce(search, searchDebounceMs);

  // Track previous search to detect changes
  const prevSearchRef = useRef(debouncedSearch);

  // Reset page to 1 when search changes
  useEffect(() => {
    if (prevSearchRef.current !== debouncedSearch && pageNumber !== pageDefault) {
      setPageNumber(pageDefault);
    }
    prevSearchRef.current = debouncedSearch;
  }, [debouncedSearch, pageNumber]);

  // Sync state changes to URL
  useEffect(() => {
    setSearchParams(
      params => {
        // Page
        if (pageNumber === pageDefault) {
          params.delete("page");
        } else {
          params.set("page", pageNumber.toString());
        }

        // Search
        if (debouncedSearch.trim()) {
          params.set("search", debouncedSearch.trim());
        } else {
          params.delete("search");
        }

        // Sort field
        if (sortField && sortField !== defaultSortField) {
          params.set("sortField", sortField);
        } else {
          params.delete("sortField");
        }

        // Sort direction
        if (sortDirection !== defaultSortDirection) {
          params.set("sortDirection", sortDirection);
        } else {
          params.delete("sortDirection");
        }

        return params;
      },
      { replace: true },
    );
  }, [pageNumber, debouncedSearch, sortField, sortDirection, defaultSortField, defaultSortDirection, setSearchParams]);

  const queryParams = useMemo(
    () =>
      ({
        pageNumber,
        pageSize,
        text: debouncedSearch.trim() || undefined,
        ...additionalQueryParams,
      }) as TQueryParams,
    [pageNumber, pageSize, debouncedSearch, additionalQueryParams],
  );

  const sortOptions = useMemo((): SortOption[] => {
    if (!sortField) return [];
    return [{ key: sortField, order: sortDirection }];
  }, [sortField, sortDirection]);

  const handleSort = useCallback(
    // `null` = tri effacé par la grille : on conserve le tri courant (comportement historique),
    // ce qui permet de brancher `onSortChange: handleSort` sans adaptateur dans les pages.
    (field: string | null) => {
      if (!field) {
        return;
      }
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection],
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    // Le reset est une action explicite : sans flush, la requête repartirait avec l'ancien texte
    // pendant la durée du debounce, puis une seconde fois une fois celui-ci écoulé.
    flushSearch("");
    setPageNumber(pageDefault);
    setSortField(defaultSortField);
    setSortDirection(defaultSortDirection);

    // Clear URL params — pagination/tri/recherche et filtres métier de la table, en un seul écrit.
    // Un écrit unique évite que plusieurs setSearchParams synchrones (issus d'instances distinctes) ne
    // s'écrasent : chacun se ferme sur le même snapshot d'URL, seul le dernier passerait.
    setSearchParams(
      params => {
        params.delete("page");
        params.delete("search");
        params.delete("sortField");
        params.delete("sortDirection");
        resetUrlParams.forEach(key => {
          params.delete(key);
        });
        return params;
      },
      { replace: true },
    );

    onResetFilters();
  }, [defaultSortField, defaultSortDirection, flushSearch, setSearchParams, resetUrlParams, onResetFilters]);

  const queryKey = useMemo(() => {
    return [...baseQueryKey, queryParams, sortOptions];
  }, [baseQueryKey, queryParams, sortOptions]);

  const {
    data: paginationResult,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => queryFn(queryParams, sortOptions),
    enabled,
  });

  return {
    paginationResult,
    isLoading,
    error,
    refetch,
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize,
    search,
    debouncedSearch,
    setSearch,
    sortField,
    sortDirection,
    handleSort,
    resetFilters,
  };
};
