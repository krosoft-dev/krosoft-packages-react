import React, { useMemo, useState } from "react";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { SearchIcon, SettingsIcon } from "lucide-react";
import { useKrosoftTranslation } from "@/i18n";
import { DataTableColumn } from "@/types/DataTableColumn";
import { cn } from "@/helpers/tailwind.helper";

export interface TableSettingsProps<T> {
  columns: DataTableColumn<T>[];
  visibleColumns: Set<string>;
  toggleColumnVisibility: (columnKey: string) => void;
  /** Bascule groupée pour « Tout » / « Aucun ». Absente : on retombe sur `toggleColumnVisibility` colonne par colonne. */
  setColumnsVisibility?: (columnKeys: string[], visible: boolean) => void;
}

export function TableSettings<T>({ columns, visibleColumns, toggleColumnVisibility, setColumnsVisibility }: TableSettingsProps<T>): React.JSX.Element {
  const { t } = useKrosoftTranslation();
  const [query, setQuery] = useState("");

  // La première colonne reste toujours affichée : sa case est cochée et grisée.
  const labelledColumns = useMemo(
    () => columns.map((column, index) => ({ key: column.key, label: t(column.headerKey), locked: index === 0 })),
    [columns, t],
  );

  const filteredColumns = useMemo(() => {
    const search = query.trim().toLowerCase();
    return search === "" ? labelledColumns : labelledColumns.filter(column => column.label.toLowerCase().includes(search));
  }, [labelledColumns, query]);

  // « Tout » / « Aucun » ne portent que sur les colonnes visibles dans la liste filtrée.
  const setFilteredVisibility = (visible: boolean): void => {
    const keys = filteredColumns
      .filter(column => !column.locked)
      .map(column => column.key)
      .filter(key => visibleColumns.has(key) !== visible);
    if (setColumnsVisibility !== undefined) {
      setColumnsVisibility(keys, visible);
    } else {
      keys.forEach(toggleColumnVisibility);
    }
  };

  return (
    <Popover
      onOpenChange={open => {
        if (!open) {
          setQuery("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="size-7 p-0 bg-background hover:bg-muted shadow-sm border-border">
          <SettingsIcon className="size-3.5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("table.columnsTitle")}</span>
          <span className="text-xs text-muted-foreground">
            {visibleColumns.size} / {columns.length}
          </span>
        </div>
        <div className="px-2 pb-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value);
              }}
              placeholder={t("search.placeholder")}
              className="w-full rounded-control bg-muted/50 py-1.5 pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
              autoFocus
            />
          </div>
        </div>
        <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto overflow-x-hidden border-t border-border p-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
          {filteredColumns.length === 0 && <p className="px-2 py-3 text-center text-xs text-muted-foreground">{t("states.noResult")}</p>}
          {filteredColumns.map(column => (
            <label
              key={column.key}
              className={cn(
                "flex min-w-0 items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                column.locked ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer hover:bg-muted",
              )}
            >
              <Checkbox
                checked={column.locked || visibleColumns.has(column.key)}
                disabled={column.locked}
                onCheckedChange={() => {
                  toggleColumnVisibility(column.key);
                }}
              />
              <span className="min-w-0 flex-1 truncate" title={column.label}>
                {column.label}
              </span>
            </label>
          ))}
        </div>
        {filteredColumns.length > 0 && (
          <div className="flex items-center justify-end gap-2 border-t border-border px-3 py-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setFilteredVisibility(true);
              }}
              className="font-medium text-primary hover:underline"
            >
              {t("table.showAllColumns")}
            </button>
            <span className="h-3 w-px bg-border" aria-hidden />
            <button
              type="button"
              onClick={() => {
                setFilteredVisibility(false);
              }}
              className="font-medium text-primary hover:underline"
            >
              {t("table.hideAllColumns")}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
