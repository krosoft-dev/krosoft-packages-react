import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/helpers/tailwind.helper";

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

export const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  searchPlaceholder = "Rechercher...",
}: SearchableSelectProps): React.ReactElement => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (query === "") return options;
    return options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  const selectedLabel = useMemo(() => {
    if (value === undefined || value === "") return undefined;
    return options.find(o => o.value === value)?.label ?? value;
  }, [options, value]);

  // Focus l'input quand le dropdown s'ouvre
  useEffect(() => {
    if (open) {
      // Petit délai pour que le DOM soit rendu
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

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

  const handleSelect = (optionValue: string): void => {
    onChange(optionValue);
    setOpen(false);
    setQuery("");
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
          (value === undefined || value === "") && "text-muted-foreground",
        )}
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 shrink-0 transition-transform", open && "rotate-180")} />
      </Button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[100] rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
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
          <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto p-1.5">
            {filteredOptions.length === 0 && <p className="px-2 py-3 text-center text-xs text-muted-foreground">Aucun résultat</p>}
            {filteredOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  handleSelect(opt.value);
                }}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted cursor-pointer transition-colors text-left w-full",
                  value === opt.value && "bg-muted font-medium",
                )}
              >
                <Check className={cn("size-3.5 shrink-0", value === opt.value ? "opacity-100" : "opacity-0")} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
