import React from "react";

export interface ColumnDef<T> {
  key: string;
  label: string;
  defaultVisible?: boolean;
  minWidth?: number;
  // Permet de définir un rendu personnalisé pour la cellule
  renderCell?: (row: T) => React.ReactNode;
  // Permet d'extraire une valeur spécifique pour le tri (ex: le premier email d'un tableau)
  getSortValue?: (row: T) => string | number | boolean | null | undefined;
}

export interface BulkAction {
  label: string;
  icon?: React.ElementType;
  onClick: (selectedIds: string[], clearSelection: () => void) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export interface RowAction<T> {
  label: string;
  icon?: React.ElementType;
  onClick: (row: T) => void;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string; // Fonction obligatoire pour identifier chaque ligne de façon unique
  onRowClick?: (row: T) => void;
  actions?: RowAction<T>[]; // Actions personnalisées pour le menu
  bulkActions?: BulkAction[]; // Actions rapides pour la sélection multiple
  draggableColumns?: boolean; // Permet d'activer/désactiver le drag and drop des colonnes
  resizableColumns?: boolean; // Permet d'activer/désactiver le redimensionnement des colonnes
  isLoading?: boolean; // Indique si les données sont en cours de chargement
  noDataMessage?: string; // Message affiché lorsque le tableau est vide
  defaultPageSize?: number; // Nombre par défaut de lignes par page
  pageSizeOptions?: number[]; // Options pour le nombre de lignes par page
}

export interface UseDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string;
  defaultPageSize: number;
  actions?: RowAction<T>[];
  bulkActions?: BulkAction[];
}

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
