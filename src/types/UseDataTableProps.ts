import { DataTableBulkAction } from "./DataTableBulkAction";
import { DataTableColumn } from "./DataTableColumn";
import { DataTableColumnVisibilityState } from "./DataTableColumnVisibilityState";
import { DataTableColumnVisibilityStorage } from "./DataTableColumnVisibilityStorage";
import { DataTableServerState } from "./DataTableServerState";
import { DataTableRowAction } from "./DataTableRowAction";

export interface UseDataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  rowSelectable?: (row: T) => boolean;
  pageSizeDefault: number;
  actions?: DataTableRowAction<T>[];
  bulkActions?: DataTableBulkAction<T>[];
  columnVisibility?: boolean;
  columnVisibilityState?: DataTableColumnVisibilityState;
  onColumnVisibilityChange?: (state: DataTableColumnVisibilityState) => void;
  columnVisibilityStorage?: DataTableColumnVisibilityStorage;
  server?: DataTableServerState;
}
