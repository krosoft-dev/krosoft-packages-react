import { DataTableBulkAction } from "./DataTableBulkAction";
import { DataTableColumn } from "./DataTableColumn";
import { DataTableServerState } from "./DataTableServerState";
import { DataTableRowAction } from "./DataTableRowAction";

export interface UseDataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  pageSizeDefault: number;
  actions?: DataTableRowAction<T>[];
  bulkActions?: DataTableBulkAction[];
  columnVisibility?: boolean;
  server?: DataTableServerState;
}
