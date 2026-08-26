import { useDataTable } from "@/hooks/ui/useDataTable";
import { useFixedColumns } from "@/hooks/ui/useFixedColumns";
import React from "react";
import { pageSizeDefault as DEFAULT_PAGE_SIZE, pagesSizes as DEFAULT_PAGE_SIZE_OPTIONS } from "../../../constants/datatable";
import { TableBody } from "./TableBody";
import { TableBulkActions } from "./TableBulkActions";
import { TableHeader } from "./TableHeader";
import { TablePagination } from "./TablePagination";
import { TableSettings } from "./TableSettings";
import type { DataTableConfig, DataTableServerState } from "../../../types";

export interface DataTableProps<T> {
  data: T[];
  isLoading?: boolean; // Indique si les données sont en cours de chargement
  error?: string | null; // Message d'erreur affiché si le chargement des données a échoué
  config: DataTableConfig<T>; // Colonnes, identification/navigation des lignes, actions, pagination et options regroupées
  server?: DataTableServerState; // État contrôlé server-side : sa présence active le mode server-side
}

export function DataTable<T>({ data, isLoading = false, error = null, config, server }: DataTableProps<T>): React.JSX.Element {
  const { columns, rowKey, onRowClick, onRowNavigate, actions, bulkActions } = config;
  const pageSizeDefault = config.pageSizeDefault ?? DEFAULT_PAGE_SIZE;
  const pageSizeOptions = config.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;
  const dense = config.dense ?? false;
  const bordered = config.bordered ?? false;
  const draggableColumns = config.draggableColumns ?? false;
  const resizableColumns = config.resizableColumns ?? false;
  const columnVisibility = config.columnVisibility ?? false;
  const fixedActions = config.fixedActions ?? false;

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
    rowKey,
    pageSizeDefault,
    actions,
    bulkActions,
    columnVisibility,
    server,
  });

  // La case de sélection est toujours la première colonne : si une colonne est figée à gauche,
  // elle ne peut pas rester dans le flux, sinon la colonne figée viendrait la recouvrir.
  const fixedSelection = hasBulkActions && visibleColumnsArray.some(column => column.fixed === "left");
  const fixedColumns = useFixedColumns(tableRef);

  return (
    // Le tableau suit le preset de l'application — square reste square — mais
    // bascule sur les valeurs plafonnées : ni ses contrôles ni son cadre ne
    // prennent la forme capsule. Le scope couvre le cadre, les actions
    // groupées et la pagination. Les fallbacks correspondent au preset "soft".
    <div className="space-y-4 [--k-radius-control:var(--k-radius-control-dense,0.5rem)] [--k-radius-surface:var(--k-radius-surface-dense,0.75rem)]">
      {selectedRows.length > 0 && bulkActions !== undefined && bulkActions.length > 0 && (
        <TableBulkActions selectedRows={selectedRows} setSelectedRows={setSelectedRows} bulkActions={bulkActions} />
      )}

      <div className="w-full bg-card rounded-surface border border-border overflow-hidden">
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
              dense={dense}
              fixedColumns={fixedColumns}
              fixedSelection={fixedSelection}
              fixedActions={fixedActions}
              settingsNode={
                columnVisibility ? (
                  <TableSettings columns={columns} visibleColumns={visibleColumns} toggleColumnVisibility={toggleColumnVisibility} />
                ) : undefined
              }
            />
            <TableBody
              bordered={bordered}
              dense={dense}
              isLoading={isLoading}
              error={error}
              colSpanCount={colSpanCount}
              messages={config.messages}
              paginatedData={paginatedData}
              rowKey={rowKey}
              onRowClick={onRowClick}
              onRowNavigate={onRowNavigate}
              hasBulkActions={hasBulkActions}
              selectedRows={selectedRows}
              toggleRowSelection={toggleRowSelection}
              visibleColumnsArray={visibleColumnsArray}
              columnWidths={columnWidths}
              hasActions={hasActions || columnVisibility}
              actions={actions}
              columns={columns}
              resizableColumns={resizableColumns}
              fixedColumns={fixedColumns}
            />
          </table>
        </div>

        <TablePagination
          totalItems={server?.totalRows ?? data.length}
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
