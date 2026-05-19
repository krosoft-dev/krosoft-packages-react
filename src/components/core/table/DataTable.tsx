import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import React from "react";
import { useCallback, useRef, useState, useMemo, DragEvent } from "react";
import { ArrowUpIcon, ArrowDownIcon, GripVerticalIcon, SettingsIcon, MoreVerticalIcon, TrashIcon, PencilIcon } from "lucide-react";

// Définition générique pour une colonne
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
  icon?: React.ReactNode;
  onClick: (selectedIds: string[], clearSelection: () => void) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string; // Fonction obligatoire pour identifier chaque ligne de façon unique
  onRowClick?: (row: T) => void;
  onEditRow?: (row: T) => void;
  onDeleteRow?: (row: T) => void;
  actions?: (row: T) => React.ReactNode; // Actions personnalisées optionnelles pour le menu
  bulkActions?: BulkAction[]; // Actions rapides pour la sélection multiple
  draggableColumns?: boolean; // Permet d'activer/désactiver le drag and drop des colonnes
}

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
}: DataTableProps<T>): React.JSX.Element {
  const [sortColumn, setSortColumn] = useState<string | null>(columns[0]?.key ?? null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns.filter(col => col.defaultVisible !== false).map(col => col.key)));
  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(col => col.key));
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.minWidth ?? 100 }), {}));

  const tableRef = useRef<HTMLTableElement>(null);
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const draggedColumn = useRef<string | null>(null);
  const dragOverColumn = useRef<string | null>(null);

  const hasActions = actions !== undefined || onEditRow !== undefined || onDeleteRow !== undefined;
  const hasBulkActions = bulkActions !== undefined && bulkActions.length > 0;

  // Gestion du tri
  const handleSort = (columnKey: string): void => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
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

  const getSortIcon = (columnKey: string): React.ReactNode => {
    if (sortColumn !== columnKey) return null;
    return sortDirection === "asc" ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />;
  };

  const renderSortHeader = (columnKey: string, label: string, isLast?: boolean, isDraggable?: boolean): React.ReactNode => {
    const draggable = isDraggable !== false;
    return (
      <th
        key={columnKey}
        className={`px-2 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 relative group border-r border-gray-200 dark:border-gray-800 ${isLast === true ? "pr-8" : ""}`}
        style={{ width: columnWidths[columnKey] }}
        draggable={draggable}
        onClick={() => {
          handleSort(columnKey);
        }}
        onDragStart={e => {
          if (draggable) {
            handleDragStart(e, columnKey);
          } else {
            e.preventDefault();
          }
        }}
        onDragOver={e => {
          handleDragOver(e, columnKey);
        }}
        onDrop={e => {
          handleDrop(e, columnKey);
        }}
      >
        <div className="flex items-center justify-between pr-2">
          <div className="flex items-center">
            {draggable ? <GripVerticalIcon className="h-3 w-3 text-gray-400 mr-1 cursor-grab dark:text-gray-300" /> : null}
            <span className="truncate">{label}</span>
          </div>
          <div className="flex flex-col gap-0.5 ml-2">
            <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent">
              {getSortIcon(columnKey)}
            </Button>
          </div>
        </div>
        <div
          className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 opacity-0 group-hover:opacity-50 transition-opacity"
          onMouseDown={e => {
            handleMouseDown(e, columnKey);
          }}
        />
      </th>
    );
  };

  // Rendu générique de la cellule
  const renderCellValue = (row: T, columnKey: string): React.ReactNode => {
    const columnDef = columns.find(col => col.key === columnKey);

    // Rendu personnalisé si défini dans la colonne
    if (columnDef?.renderCell !== undefined) {
      return columnDef.renderCell(row);
    }

    // Rendu par défaut
    const value = row[columnKey as keyof T];
    return <span className="text-sm truncate">{value !== undefined && value !== null ? String(value) : "-"}</span>;
  };

  const toggleColumnVisibility = (columnKey: string): void => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(columnKey)) {
      newVisibleColumns.delete(columnKey);
    } else {
      newVisibleColumns.add(columnKey);
    }
    setVisibleColumns(newVisibleColumns);
  };

  const toggleRowSelection = (id: string, e: React.ChangeEvent<HTMLInputElement>): void => {
    e.stopPropagation();
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

  const orderedColumns = columnOrder.map(key => columns.find(col => col.key === key)).filter((col): col is ColumnDef<T> => col !== undefined);

  const visibleColumnsArray = orderedColumns.filter(col => visibleColumns.has(col.key));

  return (
    <div className="space-y-4">
      {selectedRows.length > 0 && bulkActions !== undefined && bulkActions.length > 0 && (
        <div className="bg-muted/60 dark:bg-gray-900/60 border border-border px-3 py-1.5 flex items-center justify-between rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary ml-1">{selectedRows.length} sélectionné(s)</span>
            <div className="flex items-center gap-2">
              {bulkActions.map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    action.onClick(selectedRows, () => {
                      setSelectedRows([]);
                    });
                  }}
                  className={`h-7 bg-background shadow-sm text-xs px-2.5 ${action.variant === "destructive" ? "text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive" : "text-foreground"}`}
                >
                  {action.icon !== undefined && <span className="mr-1.5">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRows([]);
            }}
            className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
          >
            Désélectionner
          </Button>
        </div>
      )}

      <div className="w-full bg-card dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden relative">
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 bg-white hover:bg-gray-100 dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800"
              >
                <SettingsIcon className="h-3 w-3 text-gray-600 dark:text-gray-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {columns.map(column => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns.has(column.key)}
                  onCheckedChange={() => {
                    toggleColumnVisibility(column.key);
                  }}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full">
            <thead className="bg-muted/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                {hasBulkActions ? (
                  <th className="px-4 py-2 w-12 flex-shrink-0 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === data.length && data.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 dark:border-gray-700"
                    />
                  </th>
                ) : null}
                {visibleColumnsArray.map((column, index) =>
                  renderSortHeader(column.key, column.label, index === visibleColumnsArray.length - 1, draggableColumns),
                )}
                {hasActions ? <th className="w-12 px-2 py-2" /> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {sortedData.map(row => {
                const rowId = getRowId(row);
                return (
                  <tr
                    key={rowId}
                    className={`group hover:bg-muted/50 dark:hover:bg-gray-900/50 transition-colors ${onRowClick !== undefined ? "cursor-pointer" : ""}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {hasBulkActions ? (
                      <td
                        className="px-4 py-2 w-12"
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(rowId)}
                          onChange={e => {
                            toggleRowSelection(rowId, e);
                          }}
                          className="rounded border-gray-300 dark:border-gray-700"
                        />
                      </td>
                    ) : null}
                    {visibleColumnsArray.map((column, index) => {
                      const isLast = index === visibleColumnsArray.length - 1;
                      return (
                        <td
                          key={column.key}
                          className={`px-2 py-2 border-r border-gray-100 dark:border-gray-800 relative ${isLast ? "border-r-0" : ""}`}
                          style={{ width: columnWidths[column.key] }}
                        >
                          <div className="w-full h-full">{renderCellValue(row, column.key)}</div>
                        </td>
                      );
                    })}
                    {hasActions ? (
                      <td
                        className="px-2 py-2 w-12 text-center"
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      >
                        {actions !== undefined ? (
                          actions(row)
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreVerticalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                              }}
                            >
                              {onEditRow !== undefined && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    onEditRow(row);
                                  }}
                                >
                                  <PencilIcon className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                              )}
                              {onDeleteRow !== undefined && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    onDeleteRow(row);
                                  }}
                                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                >
                                  <TrashIcon className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination (statique pour l'instant) */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-card dark:bg-gray-950">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            1 - {Math.min(20, data.length)} sur {data.length}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Lignes par page :</span>
            <select className="border border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded px-2 py-1 text-sm text-foreground">
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
