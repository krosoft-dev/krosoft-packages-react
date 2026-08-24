import { useKrosoftTranslation } from "@/i18n";
import { Checkbox } from "@/components/ui";
import type { FixedColumnOffset } from "@/hooks/ui/useFixedColumns";
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
import React from "react";
import { TableActions } from "./TableActions";
import { getAlignmentClass, getColumnAlignment } from "./columnAlignment";
import { ACTIONS_COLUMN_KEY, getFixedCellProps, SELECTION_COLUMN_KEY } from "./fixedColumns";
import { ColumnDef, RowAction } from "@/types";
export type { BulkAction, ColumnDef, RowAction } from "../../../types";

export interface TableBodyProps<T> {
  isLoading: boolean;
  error?: string | null;
  colSpanCount: number;
  noDataMessage?: string;
  paginatedData: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T, event: React.MouseEvent<HTMLTableRowElement>) => void;
  hasBulkActions: boolean;
  selectedRows: string[];
  toggleRowSelection: (id: string) => void;
  visibleColumnsArray: ColumnDef<T>[];
  columnWidths: Record<string, number>;
  hasActions: boolean;
  actions?: RowAction<T>[];
  columns: ColumnDef<T>[];
  bordered?: boolean;
  dense?: boolean;
  resizableColumns?: boolean;
  // Décalages mesurés sur l'en-tête : le corps ne décide pas de ce qui est figé, il suit.
  fixedColumns?: Record<string, FixedColumnOffset>;
}

export function TableBody<T>({
  isLoading,
  error,
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
  dense = false,
  resizableColumns = false,
  fixedColumns = {},
}: TableBodyProps<T>): React.JSX.Element {
  const { t } = useKrosoftTranslation();
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
              <span className="text-sm">{t("states.loading")}</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (error) {
    return (
      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
        <tr>
          <td colSpan={colSpanCount} className="py-8 text-center">
            <div className="flex flex-col items-center justify-center gap-2 text-destructive">
              <AlertTriangleIcon className="h-6 w-6" />
              <span className="text-sm">{error}</span>
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
            {noDataMessage ?? t("states.noResult")}
          </td>
        </tr>
      </tbody>
    );
  }

  const selectionFixed = getFixedCellProps(fixedColumns[SELECTION_COLUMN_KEY], "body");
  const actionsFixed = getFixedCellProps(fixedColumns[ACTIONS_COLUMN_KEY], "body");

  return (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
      {paginatedData.map(row => {
        const rowId = getRowId(row);
        return (
          <tr
            key={rowId}
            className={`group hover:bg-muted/50 dark:hover:bg-gray-900/50 transition-colors ${onRowClick !== undefined ? "cursor-pointer" : ""}`}
            onClick={e => onRowClick?.(row, e)}
          >
            {hasBulkActions ? (
              <td
                className={`p-1 text-center align-middle ${selectionFixed.className}`}
                style={{ width: "48px", minWidth: "48px", maxWidth: "48px", ...selectionFixed.style }}
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
              // La cellule reprend exactement le décalage mesuré sur son en-tête : les deux
              // s'accrochent au bord au même pixel, sans décrochage pendant le défilement.
              const fixed = getFixedCellProps(fixedColumns[column.key], "body");
              return (
                <td
                  key={column.key}
                  className={`px-2 ${dense ? "py-2" : "py-4"} ${getAlignmentClass(getColumnAlignment(column))} ${fixed.className} ${bordered && !isLast ? "border-r border-gray-100 dark:border-gray-800" : ""} ${column.className ?? ""}`}
                  style={{
                    ...(resizableColumns ? { width: columnWidths[column.key] } : { minWidth: columnWidths[column.key] }),
                    ...fixed.style,
                  }}
                >
                  <div className="w-full h-full">{renderCellValue(row, column.key)}</div>
                </td>
              );
            })}
            {hasActions ? (
              <td
                className={`p-1 text-right align-middle whitespace-nowrap ${actionsFixed.className}`}
                style={{ minWidth: "32px", ...actionsFixed.style }}
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                {actions !== undefined && actions.length > 0 ? (
                  <div className="flex items-center justify-end">
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
