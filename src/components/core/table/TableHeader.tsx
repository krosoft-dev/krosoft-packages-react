import React from "react";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { ArrowUpIcon, ArrowDownIcon, GripVerticalIcon } from "lucide-react";
import { ColumnDef } from "@/types/ColumnDef";

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
}: TableHeaderProps<T>): React.JSX.Element {
  const getSortIcon = (columnKey: string): React.ReactNode => {
    if (sortColumn !== columnKey) return null;
    return sortDirection === "asc" ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />;
  };

  const renderSortHeader = (columnKey: string, label: string, isDraggable?: boolean): React.ReactNode => {
    const draggable = isDraggable !== false;
    return (
      <th
        key={columnKey}
        className="px-2 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 relative group border-r border-gray-200 dark:border-gray-800"
        style={{ width: columnWidths[columnKey] }}
        draggable={draggable}
        onClick={() => {
          handleSort(columnKey);
        }}
        onDragStart={e => {
          if (draggable) {
            handleDragStart(e, columnKey);
          } else {
            e.preventDefault();
          }
        }}
        onDragOver={e => {
          handleDragOver(e, columnKey);
        }}
        onDrop={e => {
          handleDrop(e, columnKey);
        }}
      >
        <div className="flex items-center justify-between pr-2">
          <div className="flex items-center">
            {draggable ? <GripVerticalIcon className="size-4 text-gray-400 mr-1 cursor-grab dark:text-gray-300" /> : null}
            <span className="truncate">{label}</span>
          </div>
          <div className="flex flex-col gap-0.5 ml-2">
            <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent">
              {getSortIcon(columnKey)}
            </Button>
          </div>
        </div>
        {resizableColumns ? (
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 opacity-0 group-hover:opacity-50 transition-opacity"
            onMouseDown={e => {
              handleMouseDown(e, columnKey);
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
          <th className="px-4 py-2 w-12 flex-shrink-0 text-left">
            <Checkbox
              checked={selectedRows.length === totalItems && totalItems > 0 ? true : selectedRows.length > 0 ? "indeterminate" : false}
              onCheckedChange={toggleSelectAll}
            />
          </th>
        ) : null}
        {visibleColumnsArray.map(column => renderSortHeader(column.key, column.label, draggableColumns))}
        {hasActions ? <th className="w-12 px-2 py-2" /> : null}
        {settingsNode !== undefined ? (
          <th className="w-12 px-2 py-2 text-center align-middle">
            {settingsNode}
          </th>
        ) : null}
      </tr>
    </thead>
  );
}
