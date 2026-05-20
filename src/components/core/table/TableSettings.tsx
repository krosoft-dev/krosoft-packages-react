import React from "react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { SettingsIcon } from "lucide-react";
import { ColumnDef } from "./types";

export interface TableSettingsProps<T> {
  columns: ColumnDef<T>[];
  visibleColumns: Set<string>;
  toggleColumnVisibility: (columnKey: string) => void;
}

export function TableSettings<T>({ columns, visibleColumns, toggleColumnVisibility }: TableSettingsProps<T>): React.JSX.Element {
  return (
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
  );
}
