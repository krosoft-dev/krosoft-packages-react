import { useKrosoftTranslation } from "@/i18n";
import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Checkbox, controlBaseClass, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { cn } from "@/helpers/tailwind.helper";

export interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

export function SearchableFilterPill<T extends string>({
  labelKey,
  options,
  selected,
  onToggle,
  onClear,
  onSelectAll,
  searchable = false,
  searchPlaceholder,
}: {
  labelKey: string;
  options: FilterOption[];
  selected: T[];
  onToggle: (value: T) => void;
  onClear?: () => void;
  onSelectAll?: (values: T[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}): React.ReactElement {
  const { t } = useKrosoftTranslation();
  const [query, setQuery] = useState("");
  const isActive = selected.length > 0;

  const filteredOptions = useMemo(() => {
    if (query === "") return options;
    return options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  const isAllSelected = useMemo(() => {
    if (filteredOptions.length === 0) return false;
    return filteredOptions.every(opt => selected.includes(opt.value as T));
  }, [filteredOptions, selected]);

  const handleToggleAll = (): void => {
    if (isAllSelected) {
      // Désélectionner les options visibles
      if (onSelectAll !== undefined) {
        const filteredValues = filteredOptions.map(o => o.value as T);
        const remaining = selected.filter(s => !filteredValues.includes(s));
        onSelectAll(remaining);
      } else if (onClear !== undefined) {
        onClear();
      } else {
        selected.forEach(s => {
          onToggle(s);
        });
      }
    } else if (onSelectAll !== undefined) {
      const newSelected = [...selected];
      filteredOptions.forEach(opt => {
        if (!newSelected.includes(opt.value as T)) {
          newSelected.push(opt.value as T);
        }
      });
      onSelectAll(newSelected);
    } else {
      filteredOptions.forEach(opt => {
        if (!selected.includes(opt.value as T)) {
          onToggle(opt.value as T);
        }
      });
    }
  };

  return (
    <Popover
      onOpenChange={() => {
        setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          className={cn(
            controlBaseClass,
            "inline-flex items-center gap-1.5 whitespace-nowrap transition-colors",
            isActive ? "border-primary bg-primary/10 text-primary font-medium" : "hover:bg-muted",
          )}
        >
          {t(labelKey)}
          {selected.length > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {selected.length}
            </span>
          )}
          <ChevronDown className="size-3.5 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 max-w-[var(--radix-popover-content-available-width)] p-0" align="start">
        {searchable ? (
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full rounded-control bg-muted/50 py-1.5 pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
                placeholder={searchPlaceholder ?? t("search.placeholder")}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                }}
                autoFocus
              />
            </div>
          </div>
        ) : null}
        <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto overflow-x-hidden p-1.5">
          {filteredOptions.length > 0 && (
            <label className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted cursor-pointer transition-colors">
              <Checkbox checked={isAllSelected} onCheckedChange={handleToggleAll} />
              {t("filters.selectAll")}
            </label>
          )}
          {filteredOptions.length === 0 && <p className="px-2 py-3 text-center text-xs text-muted-foreground">{t("states.noResult")}</p>}
          {filteredOptions.map(opt => (
            <label key={opt.value} className="flex min-w-0 items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted cursor-pointer transition-colors">
              <span className="shrink-0">
                <Checkbox
                  checked={selected.includes(opt.value as T)}
                  onCheckedChange={() => {
                    onToggle(opt.value as T);
                  }}
                />
              </span>
              {opt.color && <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: opt.color }} />}
              {/* Libellés longs tronqués (ellipsis) plutôt que de forcer un défilement horizontal du panneau. */}
              <span className="min-w-0 flex-1 truncate" title={opt.label}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="border-t border-border p-1.5">
            <button
              onClick={() => {
                if (onClear !== undefined) {
                  onClear();
                } else {
                  selected.forEach(s => {
                    onToggle(s);
                  });
                }
              }}
              className="w-full rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-center"
            >
              {t("filters.deselectAll")}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
