import { ColumnDef } from "@/types";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, GripVerticalIcon } from "lucide-react";
import React from "react";
import { Checkbox } from "../../ui/checkbox";

export interface TableHeaderProps<T> {
  hasBulkActions: boolean;
  selectedRows: string[];
  totalItems: number;
  toggleSelectAll: () => void;
  visibleColumnsArray: ColumnDef<T>[];
  draggableColumns: boolean;
  resizableColumns: boolean;
  columnWidths: Record<string, number>;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  handleSort: (columnKey: string) => void;
  handleDragStart: (e: React.DragEvent, columnKey: string) => void;
  handleDragOver: (e: React.DragEvent, columnKey: string) => void;
  handleDrop: (e: React.DragEvent, targetColumnKey: string) => void;
  handleMouseDown: (e: React.MouseEvent, columnKey: string) => void;
  hasActions: boolean;
  settingsNode?: React.ReactNode;
  bordered?: boolean;
}

export function TableHeader<T>({
  hasBulkActions,
  selectedRows,
  totalItems,
  toggleSelectAll,
  visibleColumnsArray,
  draggableColumns,
  resizableColumns,
  columnWidths,
  sortColumn,
  sortDirection,
  handleSort,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleMouseDown,
  hasActions,
  settingsNode,
  bordered = false,
}: TableHeaderProps<T>): React.JSX.Element {
  let checkboxChecked: boolean | "indeterminate" = false;
  if (selectedRows.length === totalItems && totalItems > 0) {
    checkboxChecked = true;
  } else if (selectedRows.length > 0) {
    checkboxChecked = "indeterminate";
  }

  const getSortIcon = (column: ColumnDef<T>): React.ReactNode => {
    if (column.sortable !== true) return null;
    if (sortColumn === column.key) {
      return sortDirection === "asc" ? <ArrowUpIcon className="size-3.5 text-foreground" /> : <ArrowDownIcon className="size-3.5 text-foreground" />;
    }
    return <ArrowUpDownIcon className="size-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />;
  };

  const renderColumnHeader = (column: ColumnDef<T>, isDraggable?: boolean): React.ReactNode => {
    const draggable = isDraggable !== false;
    const isSortable = column.sortable === true;

    return (
      <th
        key={column.key}
        className={[
          "px-2 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100 relative group",
          bordered ? "border-r border-gray-200 dark:border-gray-800" : "",
          isSortable ? "cursor-pointer select-none" : "",
          column.className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={resizableColumns ? { width: columnWidths[column.key] } : { minWidth: columnWidths[column.key] }}
        draggable={draggable}
        onClick={() => {
          handleSort(column.key);
        }}
        onDragStart={e => {
          if (draggable) {
            handleDragStart(e, column.key);
          } else {
            e.preventDefault();
          }
        }}
        onDragOver={e => {
          handleDragOver(e, column.key);
        }}
        onDrop={e => {
          handleDrop(e, column.key);
        }}
      >
        <div className="flex items-center justify-between pr-2">
          <div className="flex items-center gap-1">
            {draggable ? <GripVerticalIcon className="size-4 text-gray-400 cursor-grab dark:text-gray-300 shrink-0" /> : null}
            <span className="truncate">{column.label}</span>
          </div>
          <div className="ml-1 shrink-0">{getSortIcon(column)}</div>
        </div>
        {resizableColumns ? (
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 opacity-0 group-hover:opacity-50 transition-opacity"
            onMouseDown={e => {
              handleMouseDown(e, column.key);
            }}
          />
        ) : null}
      </th>
    );
  };

  return (
    <thead className="bg-muted/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
      <tr>
        {hasBulkActions ? (
          <th className="p-1 flex-shrink-0 text-center align-middle" style={{ width: "32px", minWidth: "32px", maxWidth: "32px" }}>
            <div className="flex items-center justify-center">
              <Checkbox checked={checkboxChecked} onCheckedChange={toggleSelectAll} />
            </div>
          </th>
        ) : null}
        {visibleColumnsArray.map(column => renderColumnHeader(column, draggableColumns))}
        {hasActions || settingsNode !== undefined ? (
          <th className="p-1 text-center align-middle" style={{ minWidth: "32px" }}>
            {settingsNode}
          </th>
        ) : null}
      </tr>
    </thead>
  );
}
