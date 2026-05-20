import React from "react";
import { DataTableProps } from "./types";
import { useDataTable } from "./useDataTable";
import { TablePagination } from "./TablePagination";
import { TableBulkActions } from "./TableBulkActions";
import { TableSettings } from "./TableSettings";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";

export type { ColumnDef, BulkAction, DataTableProps } from "./types";

export default function DataTable<T>({
  data,
  columns,
  getRowId,
  onRowClick,
  onEditRow,
  onDeleteRow,
  actions,
  bulkActions,
  draggableColumns = true,
  resizableColumns = true,
  isLoading = false,
  noDataMessage = "Aucun résultat",
  defaultPageSize = 20,
  pageSizeOptions = [20, 50, 100],
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
    onEditRow,
    onDeleteRow,
    bulkActions,
  });

  return (
    <div className="space-y-4">
      {selectedRows.length > 0 && bulkActions !== undefined && bulkActions.length > 0 && (
        <TableBulkActions selectedRows={selectedRows} setSelectedRows={setSelectedRows} bulkActions={bulkActions} />
      )}

      <div className="w-full bg-card dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden relative">
        <TableSettings columns={columns} visibleColumns={visibleColumns} toggleColumnVisibility={toggleColumnVisibility} />

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
              onEditRow={onEditRow}
              onDeleteRow={onDeleteRow}
              columns={columns}
            />
          </table>
        </div>

        {/* Pagination */}
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
