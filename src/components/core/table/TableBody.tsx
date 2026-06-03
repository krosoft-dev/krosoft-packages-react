import { Checkbox } from "@/components/ui";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { TableActions } from "./TableActions";
import { ColumnDef, RowAction } from "@/types";
export type { BulkAction, ColumnDef, RowAction } from "../../../types";

export interface TableBodyProps<T> {
  isLoading: boolean;
  colSpanCount: number;
  noDataMessage: string;
  paginatedData: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  hasBulkActions: boolean;
  selectedRows: string[];
  toggleRowSelection: (id: string) => void;
  visibleColumnsArray: ColumnDef<T>[];
  columnWidths: Record<string, number>;
  hasActions: boolean;
  actions?: RowAction<T>[];
  columns: ColumnDef<T>[];
  bordered?: boolean;
}

export function TableBody<T>({
  isLoading,
  colSpanCount,
  noDataMessage,
  paginatedData,
  getRowId,
  onRowClick,
  hasBulkActions,
  selectedRows,
  toggleRowSelection,
  visibleColumnsArray,
  columnWidths,
  hasActions,
  actions,
  columns,
  bordered = false,
}: TableBodyProps<T>): React.JSX.Element {
  const renderCellValue = (row: T, columnKey: string): React.ReactNode => {
    const columnDef = columns.find(col => col.key === columnKey);
    if (columnDef?.renderCell !== undefined) {
      return columnDef.renderCell(row);
    }
    const value = row[columnKey as keyof T];
    return <span className="text-sm truncate">{value !== undefined && value !== null ? String(value) : "-"}</span>;
  };

  if (isLoading) {
    return (
      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
        <tr>
          <td colSpan={colSpanCount} className="py-8 text-center">
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm">Chargement...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (paginatedData.length === 0) {
    return (
      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
        <tr>
          <td colSpan={colSpanCount} className="py-8 text-center text-sm text-muted-foreground">
            {noDataMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
      {paginatedData.map(row => {
        const rowId = getRowId(row);
        return (
          <tr
            key={rowId}
            className={`group hover:bg-muted/50 dark:hover:bg-gray-900/50 transition-colors ${onRowClick !== undefined ? "cursor-pointer" : ""}`}
            onClick={() => onRowClick?.(row)}
          >
            {hasBulkActions ? (
              <td
                className="p-1 text-center align-middle"
                style={{ width: "32px", minWidth: "32px", maxWidth: "32px" }}
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={selectedRows.includes(rowId)}
                    onCheckedChange={() => {
                      toggleRowSelection(rowId);
                    }}
                  />
                </div>
              </td>
            ) : null}
            {visibleColumnsArray.map((column, index) => {
              const isLast = index === visibleColumnsArray.length - 1;
              return (
                <td
                  key={column.key}
                  className={`px-2 py-2 relative ${bordered && !isLast ? "border-r border-gray-100 dark:border-gray-800" : ""}`}
                  style={{ width: columnWidths[column.key] }}
                >
                  <div className="w-full h-full">{renderCellValue(row, column.key)}</div>
                </td>
              );
            })}
            {hasActions ? (
              <td
                className="p-1 text-center align-middle"
                style={{ width: "32px", minWidth: "32px", maxWidth: "32px" }}
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                {actions !== undefined && actions.length > 0 ? (
                  <div className="flex items-center justify-center">
                    <TableActions actions={actions} row={row} />
                  </div>
                ) : null}
              </td>
            ) : null}
          </tr>
        );
      })}
    </tbody>
  );
}
