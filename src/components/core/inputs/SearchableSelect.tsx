import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDownIcon, SearchIcon, CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/helpers/tailwind.helper";
import type { SelectOption } from "@krosoft/core/types";

interface SearchableSelectProps {
  options?: SelectOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

export const SearchableSelect = ({
  options = [],
  value,
  onChange,
  onClear,
  placeholder = "Sélectionner...",
  searchPlaceholder = "Rechercher...",
  disabled = false,
}: SearchableSelectProps): React.ReactElement => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (query === "") return options;
    return options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  const selectedOption = useMemo(() => {
    if (value === undefined || value === "") return undefined;
    return options.find(o => o.value === value);
  }, [options, value]);

  const selectedLabel = value === undefined || value === "" ? undefined : (selectedOption?.label ?? value);

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
    if (disabled) return;
    setOpen(prev => {
      if (prev) setQuery("");
      return !prev;
    });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-control border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          open && "ring-2 ring-ring ring-offset-2",
          (value === undefined || value === "") && "text-muted-foreground",
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.color && <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: selectedOption.color }} />}
          <span className="truncate">{selectedLabel ?? placeholder}</span>
        </span>
        <div className="flex items-center gap-1">
          {onClear && value !== undefined && value !== "" && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={e => {
                e.stopPropagation();
              }}
              onPointerDown={e => {
                e.preventDefault();
                e.stopPropagation();
                onClear();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-4" />
            </span>
          )}
          <ChevronDownIcon className={cn("size-4 opacity-50 shrink-0 transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[100] rounded-surface border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
          <div className="border-b border-border p-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                className="w-full rounded-control bg-muted/50 py-1.5 pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
                placeholder={searchPlaceholder}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
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
                <CheckIcon className={cn("size-3.5 shrink-0", value === opt.value ? "opacity-100" : "opacity-0")} />
                {opt.color && <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: opt.color }} />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
