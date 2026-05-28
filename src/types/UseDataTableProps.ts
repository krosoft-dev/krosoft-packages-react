import { BulkAction } from "./BulkAction";
import { ColumnDef } from "./ColumnDef";
import { RowAction } from "./RowAction";

export interface UseDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string;
  defaultPageSize: number;
  actions?: RowAction<T>[];
  bulkActions?: BulkAction[];
  columnVisibility?: boolean;

  // Server-side pagination
  totalRows?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Server-side sorting
  sortColumn?: string | null;
  sortDirection?: "asc" | "desc";
  onSortChange?: (column: string | null, direction: "asc" | "desc") => void;
}

