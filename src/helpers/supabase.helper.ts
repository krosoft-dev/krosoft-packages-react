export interface PostgrestQueryLike {
  or: (filters: string, options?: { foreignTable?: string }) => PostgrestQueryLike;
  ilike: (column: string, pattern: string) => PostgrestQueryLike;
  eq: (column: string, value: unknown) => PostgrestQueryLike;
  in: (column: string, values: unknown[]) => PostgrestQueryLike;
  order: (column: string, options: { ascending: boolean; nullsFirst?: boolean; foreignTable?: string }) => PostgrestQueryLike;
  range: (from: number, to: number, options?: { foreignTable?: string }) => PostgrestQueryLike;
}

export interface TableStateLike<TFilters> {
  currentPage: number;
  pageSize: number;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  searchText: string;
  debouncedSearchText?: string;
  appliedFilters: TFilters;
}

export interface SupabaseFilterConfig<TFilters> {
  /**
   * Database columns to perform global search on.
   * If search text is provided, it applies: .or("col1.ilike.%text%,col2.ilike.%text%")
   */
  searchColumns?: string[];

  /**
   * Mapping definitions for each key in appliedFilters.
   */
  filters?: {
    [K in keyof TFilters]?: {
      /**
       * Column name in the DB. If omitted, the filter key is used as the column name.
       */
      column?: string;

      /**
       * The filter type to apply.
       * - "ilike": case-insensitive search (uses `%value%`)
       * - "eq": exact match
       * - "in": match any value in the array
       * - "custom": ignored by the helper (handled manually)
       */
      type: "ilike" | "eq" | "in" | "custom";
    };
  };

  /**
   * Mapping table sortColumn values to database column names.
   * If a sortColumn value is not mapped here, it will be used as-is.
   */
  sortColumns?: Record<string, string>;
}

export function applyTableStateToQuery<TFilters extends Record<string, unknown>>(
  query: PostgrestQueryLike,
  tableState: TableStateLike<TFilters>,
  config: SupabaseFilterConfig<TFilters> = {},
): PostgrestQueryLike {
  let q = query;

  // 1. Text Search (Global Search across specified columns)
  const searchValToUse = tableState.debouncedSearchText ?? tableState.searchText;
  if (searchValToUse?.trim() && config.searchColumns?.length) {
    const searchVal = `%${searchValToUse.trim()}%`;
    const orCondition = config.searchColumns.map(col => `${col}.ilike.${searchVal}`).join(",");
    q = q.or(orCondition);
  }

  // 2. Applied Filters
  if (tableState.appliedFilters) {
    for (const key in tableState.appliedFilters) {
      if (Object.prototype.hasOwnProperty.call(tableState.appliedFilters, key)) {
        const val = tableState.appliedFilters[key];

        // Skip empty filters
        if (val === undefined || val === null || val === "") continue;
        if (Array.isArray(val) && val.length === 0) continue;

        const filterConf = config.filters?.[key];
        const dbColumn = filterConf?.column ?? key;
        const filterType = filterConf?.type ?? "eq";

        if (filterType === "custom") {
          continue;
        }

        if (filterType === "ilike") {
          q = q.ilike(dbColumn, `%${String(val)}%`);
        } else if (filterType === "eq") {
          q = q.eq(dbColumn, val);
        } else if (filterType === "in" && Array.isArray(val)) {
          q = q.in(dbColumn, val);
        }
      }
    }
  }

  // 3. Sorting
  if (tableState.sortColumn) {
    const dbSortCol = config.sortColumns?.[tableState.sortColumn] ?? tableState.sortColumn;
    q = q.order(dbSortCol, { ascending: tableState.sortDirection === "asc" });
  }

  // 4. Pagination
  const from = (tableState.currentPage - 1) * tableState.pageSize;
  const to = from + tableState.pageSize - 1;
  q = q.range(from, to);

  return q;
}

/**
 * Extracts a list of related records from a many-to-many join array.
 * Handles the case where Supabase returns the nested object inside an array or as a single object.
 *
 * @example
 * // profile.tenants_users = [{ tenant_id: 1, tenants: { id: 1, name: "Tenant A" } }]
 * mapNestedRelationMany(profile.tenants_users, "tenants") // [{ id: 1, name: "Tenant A" }]
 */
export function mapNestedRelationMany<T = unknown>(relationArray: Record<string, unknown>[] | null | undefined, nestedKey: string): T[] {
  if (!relationArray) return [];
  return relationArray
    .map(item => {
      const nested = item[nestedKey] as Record<string, unknown> | Record<string, unknown>[] | undefined;
      return (Array.isArray(nested) ? nested[0] : nested) as T;
    })
    .filter((value): value is T => Boolean(value));
}

/**
 * Extracts a single related record from a join record or array.
 *
 * @example
 * // profile.users_roles = [{ role_id: 2, roles: { id: 2, name: "Admin" } }]
 * mapNestedRelationOne(profile.users_roles, "roles") // { id: 2, name: "Admin" }
 */
/* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters */
export function mapNestedRelationOne<T = unknown>(
  relationArrayOrObject: Record<string, unknown> | Record<string, unknown>[] | null | undefined,
  nestedKey?: string,
): T | null {
  if (!relationArrayOrObject) return null;
  const record = (Array.isArray(relationArrayOrObject) ? relationArrayOrObject[0] : relationArrayOrObject) as Record<string, unknown> | undefined;
  if (!record) return null;

  if (nestedKey) {
    const nested = record[nestedKey] as Record<string, unknown> | Record<string, unknown>[] | undefined;
    return (Array.isArray(nested) ? nested[0] : nested) as T | null;
  }
  return record as T;
}
