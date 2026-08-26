import React from "react";
import { DataTableColumn } from "./DataTableColumn";

export interface UseDataTableResult<T> {
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  visibleColumns: Set<string>;
  columnWidths: Record<string, number>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  safeCurrentPage: number;
  startIndex: number;
  endIndex: number;
  tableRef: React.RefObject<HTMLTableElement | null>;
  hasActions: boolean;
  hasBulkActions: boolean;
  orderedColumns: DataTableColumn<T>[];
  visibleColumnsArray: DataTableColumn<T>[];
  colSpanCount: number;
  paginatedData: T[];
  handleSort: (columnKey: string) => void;
  handleMouseDown: (e: React.MouseEvent, columnKey: string) => void;
  handleDragStart: (e: React.DragEvent, columnKey: string) => void;
  handleDragOver: (e: React.DragEvent, columnKey: string) => void;
  handleDrop: (e: React.DragEvent, targetColumnKey: string) => void;
  toggleColumnVisibility: (columnKey: string) => void;
  toggleRowSelection: (id: string) => void;
  toggleSelectAll: () => void;
}
