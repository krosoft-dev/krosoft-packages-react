import React, { useState, useMemo, useRef, useCallback, DragEvent } from "react";
import { UseDataTableProps } from "@/types/UseDataTableProps";
import { UseDataTableResult } from "@/types/UseDataTableResult";
import { ColumnDef } from "@/types/ColumnDef";

export function useDataTable<T>({ data, columns, getRowId, defaultPageSize, actions, bulkActions, columnVisibility = true }: UseDataTableProps<T>): UseDataTableResult<T> {
  const [sortColumn, setSortColumn] = useState<string | null>(columns.find(col => col.sortable === true)?.key ?? null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns.filter(col => col.defaultVisible !== false).map(col => col.key)));
  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(col => col.key));
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.minWidth ?? 100 }), {}));

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);

  const tableRef = useRef<HTMLTableElement>(null);
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const draggedColumn = useRef<string | null>(null);
  const dragOverColumn = useRef<string | null>(null);

  const hasActions = actions !== undefined && actions.length > 0;
  const hasBulkActions = bulkActions !== undefined && bulkActions.length > 0;

  const orderedColumns = useMemo(() => {
    return columnOrder.map(key => columns.find(col => col.key === key)).filter((col): col is ColumnDef<T> => col !== undefined);
  }, [columnOrder, columns]);

  const visibleColumnsArray = useMemo(() => {
    return orderedColumns.filter(col => visibleColumns.has(col.key));
  }, [orderedColumns, visibleColumns]);

  const colSpanCount = visibleColumnsArray.length + (hasBulkActions ? 1 : 0) + (hasActions || columnVisibility ? 1 : 0);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safeCurrentPage = currentPage > totalPages ? totalPages : currentPage;

  const startIndex = data.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);

  // Gestion du tri
  const handleSort = (columnKey: string): void => {
    const columnDef = columns.find(col => col.key === columnKey);
    if (columnDef?.sortable !== true) return;
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentResizingColumn = resizingColumn.current;
    if (currentResizingColumn === null) return;
    const diff = e.clientX - startX.current;
    const newWidth = Math.max(80, startWidth.current + diff);
    setColumnWidths(prev => ({
      ...prev,
      [currentResizingColumn]: newWidth,
    }));
  }, []);

  const handleMouseUp = useCallback(
    function handleMouseUpFn() {
      resizingColumn.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUpFn);
    },
    [handleMouseMove],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, columnKey: string) => {
      e.preventDefault();
      e.stopPropagation();
      resizingColumn.current = columnKey;
      startX.current = e.clientX;
      startWidth.current = columnWidths[columnKey];
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [columnWidths, handleMouseMove, handleMouseUp],
  );

  // Gestion du drag and drop des colonnes
  const handleDragStart = (e: DragEvent, columnKey: string): void => {
    draggedColumn.current = columnKey;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", columnKey);
  };

  const handleDragOver = (e: DragEvent, columnKey: string): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dragOverColumn.current = columnKey;
  };

  const handleDrop = (e: DragEvent, targetColumnKey: string): void => {
    e.preventDefault();
    if (draggedColumn.current === null || draggedColumn.current === targetColumnKey) return;

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn.current);
    const targetIndex = newOrder.indexOf(targetColumnKey);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn.current);
    setColumnOrder(newOrder);

    draggedColumn.current = null;
    dragOverColumn.current = null;
  };

  // Tri générique des données
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortColumn === null) return 0;

      const columnDef = columns.find(col => col.key === sortColumn);

      const aValue = columnDef?.getSortValue !== undefined ? columnDef.getSortValue(a) : a[sortColumn as keyof T];
      const bValue = columnDef?.getSortValue !== undefined ? columnDef.getSortValue(b) : b[sortColumn as keyof T];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      }

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection, columns]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, startIndex, endIndex]);

  const toggleColumnVisibility = (columnKey: string): void => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(columnKey)) {
      newVisibleColumns.delete(columnKey);
    } else {
      newVisibleColumns.add(columnKey);
    }
    setVisibleColumns(newVisibleColumns);
  };

  const toggleRowSelection = (id: string): void => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleSelectAll = (): void => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map(item => getRowId(item)));
    }
  };

  return {
    sortColumn,
    sortDirection,
    selectedRows,
    setSelectedRows,
    visibleColumns,
    columnWidths,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    safeCurrentPage,
    startIndex,
    endIndex,
    tableRef,
    hasActions,
    hasBulkActions,
    orderedColumns,
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
  };
}
