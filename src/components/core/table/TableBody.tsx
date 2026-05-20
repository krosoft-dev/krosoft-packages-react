import React from "react";
import { Loader2Icon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { ColumnDef } from "./types";

export interface TableBodyProps<T> {
  isLoading: boolean;
  colSpanCount: number;
  noDataMessage: string;
  paginatedData: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  hasBulkActions: boolean;
  selectedRows: string[];
  toggleRowSelection: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  visibleColumnsArray: ColumnDef<T>[];
  columnWidths: Record<string, number>;
  hasActions: boolean;
  actions?: (row: T) => React.ReactNode;
  onEditRow?: (row: T) => void;
  onDeleteRow?: (row: T) => void;
  columns: ColumnDef<T>[];
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
  onEditRow,
  onDeleteRow,
  columns,
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
                className="px-4 py-2 w-12"
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedRows.includes(rowId)}
                  onChange={e => {
                    toggleRowSelection(rowId, e);
                  }}
                  className="rounded border-gray-300 dark:border-gray-700"
                />
              </td>
            ) : null}
            {visibleColumnsArray.map((column, index) => {
              const isLast = index === visibleColumnsArray.length - 1;
              return (
                <td
                  key={column.key}
                  className={`px-2 py-2 border-r border-gray-100 dark:border-gray-800 relative ${isLast ? "border-r-0" : ""}`}
                  style={{ width: columnWidths[column.key] }}
                >
                  <div className="w-full h-full">{renderCellValue(row, column.key)}</div>
                </td>
              );
            })}
            {hasActions ? (
              <td
                className="px-2 py-2 w-12 text-center"
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                {actions !== undefined ? (
                  actions(row)
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                      }}
                    >
                      {onEditRow !== undefined && (
                        <DropdownMenuItem
                          onClick={() => {
                            onEditRow(row);
                          }}
                        >
                          <PencilIcon className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      )}
                      {onDeleteRow !== undefined && (
                        <DropdownMenuItem
                          onClick={() => {
                            onDeleteRow(row);
                          }}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </td>
            ) : null}
          </tr>
        );
      })}
    </tbody>
  );
}
