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
}
