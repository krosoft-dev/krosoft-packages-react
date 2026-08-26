import { BulkAction } from "./BulkAction";
import { ColumnDef } from "./ColumnDef";
import { DataTableServerState } from "./DataTableServerState";
import { RowAction } from "./RowAction";

export interface UseDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: (row: T) => string;
  defaultPageSize: number;
  actions?: RowAction<T>[];
  bulkActions?: BulkAction[];
  columnVisibility?: boolean;
  server?: DataTableServerState;
}
