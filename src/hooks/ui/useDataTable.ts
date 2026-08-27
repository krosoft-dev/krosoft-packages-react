import React, { useState, useMemo, useRef, useCallback, DragEvent } from "react";
import { UseDataTableProps } from "@/types/UseDataTableProps";
import { UseDataTableResult } from "@/types/UseDataTableResult";
import { DataTableColumn } from "@/types/DataTableColumn";

const DEFAULT_COLUMN_WIDTH = 100;

const isColumnVisibleByDefault = <T>(column: DataTableColumn<T>): boolean => column.defaultVisible !== false;

const applyColumnOrder = <T>(order: string[], columns: DataTableColumn<T>[]): DataTableColumn<T>[] => {
  const columnByKey = new Map(columns.map(column => [column.key, column]));
  const resultKeys = order.filter(key => columnByKey.has(key));
  const placed = new Set(resultKeys);

  columns.forEach((column, index) => {
    if (placed.has(column.key)) return;
    let insertAt = 0;
    for (let previous = index - 1; previous >= 0; previous--) {
      const anchor = resultKeys.indexOf(columns[previous].key);
      if (anchor !== -1) {
        insertAt = anchor + 1;
        break;
      }
    }
    resultKeys.splice(insertAt, 0, column.key);
    placed.add(column.key);
  });

  return resultKeys.map(key => columnByKey.get(key)).filter((column): column is DataTableColumn<T> => column !== undefined);
};

export function useDataTable<T>({
  data,
  columns,
  rowKey,
  pageSizeDefault,
  actions,
  bulkActions,
  columnVisibility = true,
  server,
}: UseDataTableProps<T>): UseDataTableResult<T> {
  const {
    totalRows,
    currentPage: controlledCurrentPage,
    pageSize: controlledPageSize,
    onPageChange,
    onPageSizeChange,
    sortColumn: controlledSortColumn,
    sortDirection: controlledSortDirection,
    onSortChange,
  } = server ?? {};
  const [localSortColumn, setLocalSortColumn] = useState<string | null>(columns.find(col => col.sortable === true)?.key ?? null);
  const sortColumn = controlledSortColumn !== undefined ? controlledSortColumn : localSortColumn;

  const [localSortDirection, setLocalSortDirection] = useState<"asc" | "desc">("asc");
  const sortDirection = controlledSortDirection ?? localSortDirection;

  // La sélection conserve les objets complets (pas seulement leurs clés) : la sélection
  // persiste d'une page à l'autre en server-side, où seule la page courante est dans `data`.
  // On la garde donc autoportante, sans dépendre d'un cache des lignes déjà vues.
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [visibilityOverrides, setVisibilityOverrides] = useState<Record<string, boolean>>({});
  const [widthOverrides, setWidthOverrides] = useState<Record<string, number>>({});
  const [columnOrderOverride, setColumnOrderOverride] = useState<string[] | null>(null);

  const [localCurrentPage, setLocalCurrentPage] = useState<number>(1);
  const currentPage = controlledCurrentPage ?? localCurrentPage;

  const [localPageSize, setLocalPageSize] = useState<number>(pageSizeDefault);
  const pageSize = controlledPageSize ?? localPageSize;

  const tableRef = useRef<HTMLTableElement>(null);
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const draggedColumn = useRef<string | null>(null);
  const dragOverColumn = useRef<string | null>(null);

  const hasActions = actions !== undefined && actions.length > 0;
  const hasBulkActions = bulkActions !== undefined && bulkActions.length > 0;

  const orderedColumns = useMemo(() => {
    return columnOrderOverride === null ? columns : applyColumnOrder(columnOrderOverride, columns);
  }, [columnOrderOverride, columns]);

  const visibleColumns = useMemo(() => {
    const visible = new Set<string>();
    for (const column of columns) {
      const isVisible = visibilityOverrides[column.key] ?? isColumnVisibleByDefault(column);
      if (isVisible) {
        visible.add(column.key);
      }
    }
    return visible;
  }, [columns, visibilityOverrides]);

  const visibleColumnsArray = useMemo(() => {
    return orderedColumns.filter(col => visibleColumns.has(col.key));
  }, [orderedColumns, visibleColumns]);

  const columnWidths = useMemo(() => {
    return columns.reduce<Record<string, number>>((acc, col) => ({ ...acc, [col.key]: widthOverrides[col.key] ?? col.minWidth ?? DEFAULT_COLUMN_WIDTH }), {});
  }, [columns, widthOverrides]);

  const colSpanCount = visibleColumnsArray.length + (hasBulkActions ? 1 : 0) + (hasActions || columnVisibility ? 1 : 0);

  const totalItems = totalRows ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = currentPage > totalPages ? totalPages : currentPage;

  const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize;
  const endIndex = totalRows !== undefined ? Math.min(startIndex + data.length, totalRows) : Math.min(startIndex + pageSize, data.length);

  const handlePageChange = useCallback(
    (page: number) => {
      if (onPageChange) {
        onPageChange(page);
      } else {
        setLocalCurrentPage(page);
      }
    },
    [onPageChange],
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      if (onPageSizeChange) {
        onPageSizeChange(size);
      } else {
        setLocalPageSize(size);
        setLocalCurrentPage(1);
      }
    },
    [onPageSizeChange],
  );

  const setCurrentPageWrapper = useCallback(
    (value: React.SetStateAction<number>) => {
      const nextPage = typeof value === "function" ? value(currentPage) : value;
      handlePageChange(nextPage);
    },
    [currentPage, handlePageChange],
  );

  const setPageSizeWrapper = useCallback(
    (value: React.SetStateAction<number>) => {
      const nextSize = typeof value === "function" ? value(pageSize) : value;
      handlePageSizeChange(nextSize);
    },
    [pageSize, handlePageSizeChange],
  );

  // Gestion du tri
  const handleSort = useCallback(
    (columnKey: string): void => {
      const columnDef = columns.find(col => col.key === columnKey);
      if (columnDef?.sortable !== true) return;

      let nextDirection: "asc" | "desc" = "asc";
      if (sortColumn === columnKey) {
        nextDirection = sortDirection === "asc" ? "desc" : "asc";
      }

      if (onSortChange) {
        onSortChange(columnKey, nextDirection);
      } else {
        setLocalSortColumn(columnKey);
        setLocalSortDirection(nextDirection);
        handlePageChange(1);
      }
    },
    [columns, sortColumn, sortDirection, onSortChange, handlePageChange],
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentResizingColumn = resizingColumn.current;
    if (currentResizingColumn === null) return;
    const diff = e.clientX - startX.current;
    const newWidth = Math.max(80, startWidth.current + diff);
    setWidthOverrides(prev => ({
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

    const newOrder = orderedColumns.map(col => col.key);
    const draggedIndex = newOrder.indexOf(draggedColumn.current);
    const targetIndex = newOrder.indexOf(targetColumnKey);
    if (draggedIndex === -1 || targetIndex === -1) return;

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn.current);
    setColumnOrderOverride(newOrder);

    draggedColumn.current = null;
    dragOverColumn.current = null;
  };

  // Tri générique des données
  const sortedData = useMemo(() => {
    if (onSortChange !== undefined) {
      return data;
    }
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
  }, [data, sortColumn, sortDirection, columns, onSortChange]);

  const paginatedData = useMemo(() => {
    if (totalRows !== undefined) {
      return sortedData;
    }
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, startIndex, endIndex, totalRows]);

  const toggleColumnVisibility = (columnKey: string): void => {
    const column = columns.find(col => col.key === columnKey);
    if (column === undefined) return;
    const currentlyVisible = visibilityOverrides[columnKey] ?? isColumnVisibleByDefault(column);
    setVisibilityOverrides(prev => ({ ...prev, [columnKey]: !currentlyVisible }));
  };

  // Comparaison par clé (et non par référence) : react-query renvoie de nouvelles instances
  // à chaque refetch, une ligne sélectionnée n'est donc jamais la même référence que dans `data`.
  const toggleRowSelection = (row: T): void => {
    const key = rowKey(row);
    setSelectedRows(previous => (previous.some(selected => rowKey(selected) === key) ? previous.filter(selected => rowKey(selected) !== key) : [...previous, row]));
  };

  const toggleSelectAll = (): void => {
    setSelectedRows(previous => {
      const pageKeys = new Set(data.map(rowKey));
      const withoutPage = previous.filter(selected => !pageKeys.has(rowKey(selected)));
      const allPageSelected = data.length > 0 && data.every(row => previous.some(selected => rowKey(selected) === rowKey(row)));
      // « Tout cocher » agit page par page : on garde la sélection des autres pages, on ne bascule que la page courante.
      return allPageSelected ? withoutPage : [...withoutPage, ...data];
    });
  };

  return {
    sortColumn,
    sortDirection,
    selectedRows,
    setSelectedRows,
    visibleColumns,
    columnWidths,
    currentPage,
    setCurrentPage: setCurrentPageWrapper,
    pageSize,
    setPageSize: setPageSizeWrapper,
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
