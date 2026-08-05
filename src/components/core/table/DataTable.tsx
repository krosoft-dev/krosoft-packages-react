import { useDataTable } from "@/hooks/ui/useDataTable";
import React from "react";
import { defaultPageSize as DEFAULT_PAGE_SIZE, pagesSizes as DEFAULT_PAGE_SIZE_OPTIONS } from "../../../constants/datatable";
import type { BulkAction, ColumnDef, RowAction } from "../../../types";
import { TableBody } from "./TableBody";
import { TableBulkActions } from "./TableBulkActions";
import { TableHeader } from "./TableHeader";
import { TablePagination } from "./TablePagination";
import { TableSettings } from "./TableSettings";
export type { BulkAction, ColumnDef, RowAction } from "../../../types";

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string; // Fonction obligatoire pour identifier chaque ligne de façon unique
  onRowClick?: (row: T, event: React.MouseEvent<HTMLTableRowElement>) => void;
  actions?: RowAction<T>[]; // Actions personnalisées pour le menu
  bulkActions?: BulkAction[]; // Actions rapides pour la sélection multiple
  draggableColumns?: boolean; // Permet d'activer/désactiver le drag and drop des colonnes
  resizableColumns?: boolean; // Permet d'activer/désactiver le redimensionnement des colonnes
  columnVisibility?: boolean; // Permet d'activer/désactiver le bouton de visibilité des colonnes
  isLoading?: boolean; // Indique si les données sont en cours de chargement
  error?: string | null; // Message d'erreur affiché si le chargement des données a échoué
  noDataMessage?: string; // Message affiché lorsque le tableau est vide
  bordered?: boolean; // Permet d'afficher les bordures des cellules (colonnes)
  defaultPageSize?: number; // Nombre par défaut de lignes par page
  pageSizeOptions?: number[]; // Options pour le nombre de lignes par page

  // Server-side pagination
  totalRows?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Server-side sorting
  sortColumn?: string | null;
  sortDirection?: "asc" | "desc";
  onSortChange?: (column: string | null, direction: "asc" | "desc") => void;
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  onRowClick,
  actions,
  bulkActions,
  draggableColumns = false,
  resizableColumns = false,
  columnVisibility = false,
  isLoading = false,
  error = null,
  bordered = false,
  noDataMessage = "Aucun résultat",
  defaultPageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  totalRows,
  currentPage,
  pageSize: controlledPageSize,
  onPageChange,
  onPageSizeChange,
  sortColumn: controlledSortColumn,
  sortDirection: controlledSortDirection,
  onSortChange,
}: DataTableProps<T>): React.JSX.Element {
  const {
    sortColumn,
    sortDirection,
    selectedRows,
    setSelectedRows,
    visibleColumns,
    columnWidths,
    safeCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    tableRef,
    hasActions,
    hasBulkActions,
    visibleColumnsArray,
    colSpanCount,
    paginatedData,
    handleSort,
    handleMouseDown,
    handleDragStart,
    handleDragOver,
    handleDrop,
    toggleColumnVisibility,
    toggleRowSelection,
    toggleSelectAll,
    pageSize,
    setPageSize,
    setCurrentPage,
  } = useDataTable({
    data,
    columns,
    getRowId,
    defaultPageSize,
    actions,
    bulkActions,
    columnVisibility,
    totalRows,
    currentPage,
    pageSize: controlledPageSize,
    onPageChange,
    onPageSizeChange,
    sortColumn: controlledSortColumn,
    sortDirection: controlledSortDirection,
    onSortChange,
  });

  return (
    // Le tableau suit le preset de l'application — square reste square — mais
    // bascule sur les valeurs plafonnées : ni ses contrôles ni son cadre ne
    // prennent la forme capsule. Le scope couvre le cadre, les actions
    // groupées et la pagination. Les fallbacks correspondent au preset "soft".
    <div className="space-y-4 [--radius-control:var(--radius-control-dense,0.5rem)] [--radius-surface:var(--radius-surface-dense,0.75rem)]">
      {selectedRows.length > 0 && bulkActions !== undefined && bulkActions.length > 0 && (
        <TableBulkActions selectedRows={selectedRows} setSelectedRows={setSelectedRows} bulkActions={bulkActions} />
      )}

      <div className="w-full bg-card dark:bg-gray-950 rounded-surface border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full">
            <TableHeader
              hasBulkActions={hasBulkActions}
              selectedRows={selectedRows}
              totalItems={data.length}
              toggleSelectAll={toggleSelectAll}
              visibleColumnsArray={visibleColumnsArray}
              draggableColumns={draggableColumns}
              resizableColumns={resizableColumns}
              columnWidths={columnWidths}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleMouseDown={handleMouseDown}
              hasActions={hasActions}
              bordered={bordered}
              settingsNode={
                columnVisibility ? (
                  <TableSettings columns={columns} visibleColumns={visibleColumns} toggleColumnVisibility={toggleColumnVisibility} />
                ) : undefined
              }
            />
            <TableBody
              bordered={bordered}
              isLoading={isLoading}
              error={error}
              colSpanCount={colSpanCount}
              noDataMessage={noDataMessage}
              paginatedData={paginatedData}
              getRowId={getRowId}
              onRowClick={onRowClick}
              hasBulkActions={hasBulkActions}
              selectedRows={selectedRows}
              toggleRowSelection={toggleRowSelection}
              visibleColumnsArray={visibleColumnsArray}
              columnWidths={columnWidths}
              hasActions={hasActions || columnVisibility}
              actions={actions}
              columns={columns}
              resizableColumns={resizableColumns}
            />
          </table>
        </div>

        <TablePagination
          totalItems={totalRows ?? data.length}
          startIndex={startIndex}
          endIndex={endIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={safeCurrentPage}
          setCurrentPage={setCurrentPage}
          pageSizeOptions={pageSizeOptions}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
