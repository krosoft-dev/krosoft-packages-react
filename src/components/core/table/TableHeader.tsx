import type { FixedColumnOffset } from "@/hooks/ui/useFixedColumns";
import { ColumnDef } from "@/types";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, GripVerticalIcon } from "lucide-react";
import React from "react";
import { Checkbox } from "../../ui/checkbox";
import { getAlignmentClass, getColumnAlignment } from "./columnAlignment";
import { ACTIONS_COLUMN_KEY, getFixedCellProps, SELECTION_COLUMN_KEY } from "./fixedColumns";

export interface TableHeaderProps<T> {
  hasBulkActions: boolean;
  selectedRows: string[];
  totalItems: number;
  toggleSelectAll: () => void;
  visibleColumnsArray: ColumnDef<T>[];
  draggableColumns: boolean;
  resizableColumns: boolean;
  columnWidths: Record<string, number>;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  handleSort: (columnKey: string) => void;
  handleDragStart: (e: React.DragEvent, columnKey: string) => void;
  handleDragOver: (e: React.DragEvent, columnKey: string) => void;
  handleDrop: (e: React.DragEvent, targetColumnKey: string) => void;
  handleMouseDown: (e: React.MouseEvent, columnKey: string) => void;
  hasActions: boolean;
  settingsNode?: React.ReactNode;
  bordered?: boolean;
  dense?: boolean;
  fixedColumns?: Record<string, FixedColumnOffset>;
  fixedSelection?: boolean;
  fixedActions?: boolean;
}

const HEADER_JUSTIFY: Record<"left" | "center" | "right", string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export function TableHeader<T>({
  hasBulkActions,
  selectedRows,
  totalItems,
  toggleSelectAll,
  visibleColumnsArray,
  draggableColumns,
  resizableColumns,
  columnWidths,
  sortColumn,
  sortDirection,
  handleSort,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleMouseDown,
  hasActions,
  settingsNode,
  bordered = false,
  dense = false,
  fixedColumns = {},
  fixedSelection = false,
  fixedActions = false,
}: TableHeaderProps<T>): React.JSX.Element {
  let checkboxChecked: boolean | "indeterminate" = false;
  if (selectedRows.length === totalItems && totalItems > 0) {
    checkboxChecked = true;
  } else if (selectedRows.length > 0) {
    checkboxChecked = "indeterminate";
  }

  const getSortIcon = (column: ColumnDef<T>): React.ReactNode => {
    if (column.sortable !== true) return null;
    if (sortColumn === column.key) {
      return sortDirection === "asc" ? <ArrowUpIcon className="size-3.5 text-foreground" /> : <ArrowDownIcon className="size-3.5 text-foreground" />;
    }
    return <ArrowUpDownIcon className="size-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />;
  };

  const renderColumnHeader = (column: ColumnDef<T>, index: number, isDraggable?: boolean): React.ReactNode => {
    // Déplacer une colonne figée la ferait passer d'un bord à l'autre ou au milieu de la pile :
    // le glisser-déposer est réservé aux colonnes qui défilent.
    const draggable = isDraggable !== false && column.fixed === undefined;
    const isSortable = column.sortable === true;
    const fixed = getFixedCellProps(fixedColumns[column.key], "header");
    const alignment = getColumnAlignment(column);
    const sortIcon = getSortIcon(column);

    const isLeftEdge = index === 0 && !hasBulkActions;
    const isRightEdge = index === visibleColumnsArray.length - 1 && !(hasActions || settingsNode !== undefined);
    const paddingX = `${isLeftEdge ? "pl-4" : "pl-2"} ${isRightEdge ? "pr-4" : "pr-2"}`;

    return (
      <th
        key={column.key}
        data-column-key={column.key}
        data-fixed-side={column.fixed}
        className={[
          `${paddingX} ${dense ? "py-2" : "py-4"} text-sm font-medium text-gray-900 dark:text-gray-100 group`,
          getAlignmentClass(alignment),
          fixed.className,
          bordered ? "border-r border-gray-200 dark:border-gray-800" : "",
          isSortable ? "cursor-pointer select-none" : "",
          column.className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          ...(resizableColumns ? { width: columnWidths[column.key] } : { minWidth: columnWidths[column.key] }),
          ...fixed.style,
        }}
        draggable={draggable}
        onClick={() => {
          handleSort(column.key);
        }}
        onDragStart={e => {
          if (draggable) {
            handleDragStart(e, column.key);
          } else {
            e.preventDefault();
          }
        }}
        onDragOver={e => {
          handleDragOver(e, column.key);
        }}
        onDrop={e => {
          handleDrop(e, column.key);
        }}
      >
        {/* L'icône de tri reste collée au libellé : elle qualifie la colonne nommée juste à côté,
            pas le bord du tableau. Repoussée à l'autre extrémité d'une colonne large, elle oblige
            l'œil à faire l'aller-retour pour savoir à quoi elle se rapporte.

            Le bloc entier se range du côté des cellules : sur une colonne de nombres poussés à
            droite, un en-tête resté à gauche flotte au-dessus du vide. Le retrait droit ne
            subsiste que sur une colonne redimensionnable, où il dégage la poignée. */}
        <div className={`flex items-center gap-1 ${HEADER_JUSTIFY[alignment]} ${resizableColumns ? "pr-2" : ""}`}>
          {draggable ? <GripVerticalIcon className="size-4 text-gray-400 cursor-grab dark:text-gray-300 shrink-0" /> : null}
          <span className="truncate">{column.label}</span>
          {/* Marge en plus de la gouttière : l'icône reste rattachée au libellé sans lui coller,
              alors que la poignée de glisser-déposer, elle, gagne à rester serrée contre lui. */}
          {sortIcon !== null ? <span className="ml-1 shrink-0">{sortIcon}</span> : null}
        </div>
        {resizableColumns ? (
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 opacity-0 group-hover:opacity-50 transition-opacity"
            onMouseDown={e => {
              handleMouseDown(e, column.key);
            }}
          />
        ) : null}
      </th>
    );
  };

  const selectionFixed = getFixedCellProps(fixedColumns[SELECTION_COLUMN_KEY], "header");
  const actionsFixed = getFixedCellProps(fixedColumns[ACTIONS_COLUMN_KEY], "header");

  return (
    <thead className="bg-muted/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
      <tr>
        {hasBulkActions ? (
          <th
            data-column-key={SELECTION_COLUMN_KEY}
            data-fixed-side={fixedSelection ? "left" : undefined}
            className={`p-1 text-center align-middle ${selectionFixed.className}`}
            style={{ width: "48px", minWidth: "48px", maxWidth: "48px", ...selectionFixed.style }}
          >
            <div className="flex items-center justify-center">
              <Checkbox checked={checkboxChecked} onCheckedChange={toggleSelectAll} />
            </div>
          </th>
        ) : null}
        {visibleColumnsArray.map((column, index) => renderColumnHeader(column, index, draggableColumns))}
        {hasActions || settingsNode !== undefined ? (
          <th
            data-column-key={ACTIONS_COLUMN_KEY}
            data-fixed-side={fixedActions ? "right" : undefined}
            className={`p-1 text-right align-middle ${actionsFixed.className}`}
            style={{ minWidth: "32px", ...actionsFixed.style }}
          >
            {settingsNode}
          </th>
        ) : null}
      </tr>
    </thead>
  );
}
