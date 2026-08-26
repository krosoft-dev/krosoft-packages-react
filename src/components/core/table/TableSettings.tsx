import React from "react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { SettingsIcon } from "lucide-react";
import { useKrosoftTranslation } from "@/i18n";
import { ColumnDef } from "@/types/ColumnDef";

export interface TableSettingsProps<T> {
  columns: ColumnDef<T>[];
  visibleColumns: Set<string>;
  toggleColumnVisibility: (columnKey: string) => void;
}

export function TableSettings<T>({ columns, visibleColumns, toggleColumnVisibility }: TableSettingsProps<T>): React.JSX.Element {
  const { t } = useKrosoftTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="size-7 p-0 bg-background hover:bg-muted shadow-sm border-border">
          <SettingsIcon className="size-3.5 text-muted-foreground" />
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
            {t(column.headerKey)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
