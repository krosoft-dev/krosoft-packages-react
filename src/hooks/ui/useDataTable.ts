import React, { useState, useMemo, useRef, useCallback, DragEvent } from "react";
import { UseDataTableProps } from "@/types/UseDataTableProps";
import { UseDataTableResult } from "@/types/UseDataTableResult";
import { ColumnDef } from "@/types/ColumnDef";

const DEFAULT_COLUMN_WIDTH = 100;

const isColumnVisibleByDefault = <T>(column: ColumnDef<T>): boolean => column.defaultVisible !== false;

// Applique l'ordre choisi par l'utilisateur (glisser-déposer) à la liste courante de colonnes :
// on garde son ordre pour les colonnes toujours présentes, on retire celles qui ont disparu et on
// insère les nouvelles à leur place d'origine (juste après leur voisine de gauche). L'ordre n'est
// donc jamais un instantané figé de `columns` : il se recalcule des props à chaque rendu.
const applyColumnOrder = <T>(order: string[], columns: ColumnDef<T>[]): ColumnDef<T>[] => {
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

  return resultKeys.map(key => columnByKey.get(key)).filter((column): column is ColumnDef<T> => column !== undefined);
};

export function useDataTable<T>({
  data,
  columns,
  getRowId,
  defaultPageSize,
  actions,
  bulkActions,
  columnVisibility = true,
  totalRows,
  currentPage: controlledCurrentPage,
  pageSize: controlledPageSize,
  onPageChange,
  onPageSizeChange,
  sortColumn: controlledSortColumn,
  sortDirection: controlledSortDirection,
  onSortChange,
}: UseDataTableProps<T>): UseDataTableResult<T> {
  const [localSortColumn, setLocalSortColumn] = useState<string | null>(columns.find(col => col.sortable === true)?.key ?? null);
  const sortColumn = controlledSortColumn !== undefined ? controlledSortColumn : localSortColumn;

  const [localSortDirection, setLocalSortDirection] = useState<"asc" | "desc">("asc");
  const sortDirection = controlledSortDirection ?? localSortDirection;

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // On ne stocke que les décisions de l'utilisateur (deltas), pas la liste des colonnes : la source
  // de vérité reste la prop `columns`. Ainsi une colonne ajoutée après le montage (chargée en
  // asynchrone, conditionnée à une permission…) apparaît d'elle-même, et une colonne retirée
  // disparaît, sans réconciliation d'état.
  const [visibilityOverrides, setVisibilityOverrides] = useState<Record<string, boolean>>({});
  const [widthOverrides, setWidthOverrides] = useState<Record<string, number>>({});
  const [columnOrderOverride, setColumnOrderOverride] = useState<string[] | null>(null);

  const [localCurrentPage, setLocalCurrentPage] = useState<number>(1);
  const currentPage = controlledCurrentPage ?? localCurrentPage;

  const [localPageSize, setLocalPageSize] = useState<number>(defaultPageSize);
  const pageSize = controlledPageSize ?? localPageSize;

  const tableRef = useRef<HTMLTableElement>(null);
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const draggedColumn = useRef<string | null>(null);
  const dragOverColumn = useRef<string | null>(null);

  const hasActions = actions !== undefined && actions.length > 0;
  const hasBulkActions = bulkActions !== undefined && bulkActions.length > 0;

  // Colonnes dérivées des props à chaque rendu : l'ordre applique le choix de l'utilisateur s'il a
  // réorganisé, sinon suit l'ordre des props tel quel.
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

    // On repart de l'ordre effectif courant (dérivé des props) pour poser le nouvel ordre choisi.
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
