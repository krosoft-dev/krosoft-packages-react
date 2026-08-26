import { Checkbox } from "@/components/ui";
import type { FixedColumnOffset } from "@/hooks/ui/useFixedColumns";
import { useKrosoftTranslation } from "@/i18n";
import { ColumnDef, DataTableMessages, RowAction } from "@/types";
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { TableActions } from "./TableActions";
import { ACTIONS_COLUMN_KEY, getAlignmentClass, getColumnAlignment, getFixedCellProps, SELECTION_COLUMN_KEY } from "@/helpers/table.helper";

export interface TableBodyProps<T> {
  isLoading: boolean;
  error?: string | null;
  colSpanCount: number;
  messages?: DataTableMessages;
  paginatedData: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T, event: React.MouseEvent<HTMLTableRowElement>) => void;
  onRowNavigate?: (row: T) => string; // Retourne l'URL de destination de la ligne au clic (prioritaire sur onRowClick)
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
  messages,
  paginatedData,
  rowKey,
  onRowClick,
  onRowNavigate,
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
  const loadingText = t(messages?.loadingKey ?? "states.loading");
  const emptyText = t(messages?.emptyKey ?? "states.noResult");
  const navigate = useNavigate();
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
      <tbody className="divide-y divide-border">
        <tr>
          <td colSpan={colSpanCount} className="py-8 text-center">
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm">{loadingText}</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (error) {
    return (
      <tbody className="divide-y divide-border">
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
      <tbody className="divide-y divide-border">
        <tr>
          <td colSpan={colSpanCount} className="py-8 text-center text-sm text-muted-foreground">
            {emptyText}
          </td>
        </tr>
      </tbody>
    );
  }

  const selectionFixed = getFixedCellProps(fixedColumns[SELECTION_COLUMN_KEY], "body");
  const actionsFixed = getFixedCellProps(fixedColumns[ACTIONS_COLUMN_KEY], "body");

  const isRowClickable = onRowNavigate !== undefined || onRowClick !== undefined;

  // La navigation prime sur onRowClick : Ctrl/Cmd + clic reproduit le comportement natif
  // des liens en ouvrant l'URL dans un nouvel onglet, sinon le router prend le relais.
  const handleRowClick = (row: T, event: React.MouseEvent<HTMLTableRowElement>): void => {
    if (onRowNavigate !== undefined) {
      const url = onRowNavigate(row);
      if (event.ctrlKey || event.metaKey) {
        window.open(url, "_blank");
      } else {
        void navigate(url);
      }
    } else {
      onRowClick?.(row, event);
    }
  };

  return (
    <tbody className="divide-y divide-border">
      {paginatedData.map(row => {
        const key = rowKey(row);
        return (
          <tr
            key={key}
            className={`group hover:bg-muted/50 transition-colors ${isRowClickable ? "cursor-pointer" : ""}`}
            onClick={e => {
              handleRowClick(row, e);
            }}
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
                    checked={selectedRows.includes(key)}
                    onCheckedChange={() => {
                      toggleRowSelection(key);
                    }}
                  />
                </div>
              </td>
            ) : null}
            {visibleColumnsArray.map((column, index) => {
              const isLast = index === visibleColumnsArray.length - 1;
              const fixed = getFixedCellProps(fixedColumns[column.key], "body");
              const isLeftEdge = index === 0 && !hasBulkActions;
              const isRightEdge = isLast && !hasActions;
              const paddingX = `${isLeftEdge ? "pl-4" : "pl-2"} ${isRightEdge ? "pr-4" : "pr-2"}`;
              return (
                <td
                  key={column.key}
                  className={`${paddingX} ${dense ? "py-2" : "py-4"} text-sm ${getAlignmentClass(getColumnAlignment(column))} ${fixed.className} ${bordered && !isLast ? "border-r border-border" : ""} ${column.className ?? ""}`}
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
                className={`py-1 pl-1 pr-4 text-right align-middle whitespace-nowrap ${actionsFixed.className}`}
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
