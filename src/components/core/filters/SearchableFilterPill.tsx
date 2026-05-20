import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Checkbox, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";

export interface FilterOption {
  value: string;
  label: string;
}

export function SearchableFilterPill<T extends string>({
  label,
  options,
  selected,
  onToggle,
  onClear,
  onSelectAll,
  searchable = false,
  searchPlaceholder = "Rechercher...",
}: {
  label: string;
  options: FilterOption[];
  selected: T[];
  onToggle: (value: T) => void;
  onClear?: () => void;
  onSelectAll?: (values: T[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState("");
  const isActive = selected.length > 0;

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    return options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  const isAllSelected = useMemo(() => {
    if (filteredOptions.length === 0) return false;
    return filteredOptions.every((opt) => selected.includes(opt.value as T));
  }, [filteredOptions, selected]);

  const handleToggleAll = () => {
    if (isAllSelected) {
      // Désélectionner les options visibles
      if (onSelectAll) {
        const filteredValues = filteredOptions.map((o) => o.value as T);
        const remaining = selected.filter((s) => !filteredValues.includes(s));
        onSelectAll(remaining);
      } else if (onClear) {
        onClear();
      } else {
        selected.forEach((s) => onToggle(s));
      }
    } else {
      // Sélectionner les options visibles manquantes
      if (onSelectAll) {
        const newSelected = [...selected];
        filteredOptions.forEach((opt) => {
          if (!newSelected.includes(opt.value as T)) {
            newSelected.push(opt.value as T);
          }
        });
        onSelectAll(newSelected);
      } else {
        filteredOptions.forEach((opt) => {
          if (!selected.includes(opt.value as T)) {
            onToggle(opt.value as T);
          }
        });
      }
    }
  };

  return (
    <Popover onOpenChange={() => setQuery("")}>
      <PopoverTrigger asChild>
        <button
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors whitespace-nowrap ${
            isActive
              ? "border-primary bg-primary/10 text-primary font-medium"
              : "border-border bg-card text-card-foreground hover:bg-muted"
          }`}
        >
          {label}
          {selected.length > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {selected.length}
            </span>
          )}
          <ChevronDown className="size-3.5 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        {searchable && (
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full rounded-md bg-muted/50 py-1.5 pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto p-1.5">
            {filteredOptions.length > 0 && (
              <label className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted cursor-pointer transition-colors">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleToggleAll}
                />
                Tout sélectionner
              </label>
            )}
          {filteredOptions.length === 0 && (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">Aucun résultat</p>
          )}
          {filteredOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted cursor-pointer transition-colors"
            >
              <Checkbox
                checked={selected.includes(opt.value as T)}
                onCheckedChange={() => onToggle(opt.value as T)}
              />
              {opt.label}
            </label>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="border-t border-border p-1.5">
            <button
              onClick={() => {
                if (onClear) {
                  onClear();
                } else {
                  selected.forEach((s) => onToggle(s));
                }
              }}
              className="w-full rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-center"
            >
              Tout désélectionner
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

