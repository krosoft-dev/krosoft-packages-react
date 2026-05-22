import React from "react";
import { ColumnDef } from "./ColumnDef";

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
  tableRef: React.RefObject<HTMLTableElement>;
  hasActions: boolean;
  hasBulkActions: boolean;
  orderedColumns: ColumnDef<T>[];
  visibleColumnsArray: ColumnDef<T>[];
  colSpanCount: number;
  paginatedData: T[];
  handleSort: (columnKey: string) => void;
  handleMouseDown: (e: React.MouseEvent, columnKey: string) => void;
  handleDragStart: (e: React.DragEvent, columnKey: string) => void;
  handleDragOver: (e: React.DragEvent, columnKey: string) => void;
  handleDrop: (e: React.DragEvent, targetColumnKey: string) => void;
  toggleColumnVisibility: (columnKey: string) => void;
  toggleRowSelection: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleSelectAll: () => void;
}
