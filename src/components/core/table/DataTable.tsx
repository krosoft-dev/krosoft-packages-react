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
  onRowClick?: (row: T) => void;
  actions?: RowAction<T>[]; // Actions personnalisées pour le menu
  bulkActions?: BulkAction[]; // Actions rapides pour la sélection multiple
  draggableColumns?: boolean; // Permet d'activer/désactiver le drag and drop des colonnes
  resizableColumns?: boolean; // Permet d'activer/désactiver le redimensionnement des colonnes
  columnVisibility?: boolean; // Permet d'activer/désactiver le bouton de visibilité des colonnes
  isLoading?: boolean; // Indique si les données sont en cours de chargement
  noDataMessage?: string; // Message affiché lorsque le tableau est vide
  defaultPageSize?: number; // Nombre par défaut de lignes par page
  pageSizeOptions?: number[]; // Options pour le nombre de lignes par page
}

export default function DataTable<T>({
  data,
  columns,
  getRowId,
  onRowClick,
  actions,
  bulkActions,
  draggableColumns = true,
  resizableColumns = true,
  columnVisibility = true,
  isLoading = false,
  noDataMessage = "Aucun résultat",
  defaultPageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
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
  });

  return (
    <div className="space-y-4">
      {selectedRows.length > 0 && bulkActions !== undefined && bulkActions.length > 0 && (
        <TableBulkActions selectedRows={selectedRows} setSelectedRows={setSelectedRows} bulkActions={bulkActions} />
      )}

      <div className="w-full bg-card dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
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
              settingsNode={
                columnVisibility ? (
                  <TableSettings columns={columns} visibleColumns={visibleColumns} toggleColumnVisibility={toggleColumnVisibility} />
                ) : undefined
              }
            />
            <TableBody
              isLoading={isLoading}
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
              hasActions={hasActions}
              actions={actions}
              columns={columns}
            />
          </table>
        </div>

        <TablePagination
          totalItems={data.length}
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
