import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button, Checkbox } from "@/components/ui";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/helpers/tailwind.helper";

interface MultiSelectFieldProps {
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (val: string) => void;
  onClear: () => void;
  onSelectAll?: (values: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export const MultiSelectField = ({
  options,
  selected,
  onToggle,
  onClear,
  onSelectAll,
  placeholder = "Sélectionner...",
  searchable = false,
  searchPlaceholder = "Rechercher...",
}: MultiSelectFieldProps): React.ReactElement => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (query === "") return options;
    return options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  const isAllSelected = useMemo(() => {
    if (filteredOptions.length === 0) return false;
    return filteredOptions.every(opt => selected.includes(opt.value));
  }, [filteredOptions, selected]);

  // Focus l'input quand le dropdown s'ouvre
  useEffect(() => {
    if (open && searchable) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open, searchable]);

  // Fermer quand on clique en dehors
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent): void => {
      if (containerRef.current !== null && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleToggleAll = (): void => {
    if (isAllSelected) {
      const filteredValues = filteredOptions.map(o => o.value);
      const remaining = selected.filter(s => !filteredValues.includes(s));
      if (onSelectAll !== undefined) {
        onSelectAll(remaining);
      } else {
        onClear();
      }
    } else {
      const newSelected = [...selected];
      filteredOptions.forEach(opt => {
        if (!newSelected.includes(opt.value)) {
          newSelected.push(opt.value);
        }
      });
      if (onSelectAll !== undefined) {
        onSelectAll(newSelected);
      } else {
        filteredOptions.forEach(opt => {
          if (!selected.includes(opt.value)) {
            onToggle(opt.value);
          }
        });
      }
    }
  };

  const handleToggle = (): void => {
    setOpen(prev => {
      if (prev) setQuery("");
      return !prev;
    });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Button
        variant="outline"
        type="button"
        onClick={handleToggle}
        className={cn(
          "w-full justify-between text-left font-normal focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          open && "ring-2 ring-ring ring-offset-2",
          selected.length === 0 && "text-muted-foreground",
        )}
      >
        <span className="truncate">{selected.length === 0 ? placeholder : selected.map(s => options.find(o => o.value === s)?.label ?? s).join(", ")}</span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 shrink-0 transition-transform", open && "rotate-180")} />
      </Button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[100] rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
          {searchable ? (
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={inputRef}
                  className="w-full rounded-md bg-muted/50 py-1.5 pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                  }}
                />
              </div>
            </div>
          ) : null}
          <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto p-1.5">
            {filteredOptions.length > 0 && (
              <label className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted cursor-pointer transition-colors">
                <Checkbox checked={isAllSelected} onCheckedChange={handleToggleAll} />
                Tout sélectionner
              </label>
            )}
            {filteredOptions.length === 0 && <p className="px-2 py-3 text-center text-xs text-muted-foreground">Aucun résultat</p>}
            {filteredOptions.map(opt => (
              <label key={opt.value} className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted cursor-pointer transition-colors">
                <Checkbox
                  checked={selected.includes(opt.value)}
                  onCheckedChange={() => {
                    onToggle(opt.value);
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
          {selected.length > 0 && (
            <div className="border-t border-border p-1.5">
              <button
                type="button"
                onClick={onClear}
                className="w-full rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-center"
              >
                Tout désélectionner
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
