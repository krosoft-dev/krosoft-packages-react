import React, { useState, useEffect, useMemo } from "react";
import { SearchInput } from "../inputs/SearchInput";
import { SearchableFilterPill, FilterOption } from "./SearchableFilterPill";
import { ActiveFilters } from "./ActiveFilters";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Checkbox,
} from "@/components/ui";
import { CalendarIcon, Filter, X, ChevronDown, Search } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/helpers/tailwind.helper";

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "number" | "multi-select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  isQuickFilter?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export interface FilterSection {
  title: string;
  filters: FilterFieldConfig[];
}

interface TableFilterProps {
  // Recherche
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;

  // Filtres
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  filterLabels?: Record<string, string>;

  // Configuration des filtres (regroupés par sections)
  sections: FilterSection[];

  // Textes & Boutons
  advancedButtonText?: string;
  sheetTitle?: string;
}

const DatePicker = ({
  date,
  onDateChange,
  placeholder,
}: {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder: string;
}) => (
  <Popover modal={true}>
    <PopoverTrigger asChild>
      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {date ? format(date, "dd/MM/yyyy", { locale: fr }) : <span>{placeholder}</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar mode="single" selected={date} onSelect={onDateChange} initialFocus className="pointer-events-auto" />
    </PopoverContent>
  </Popover>
);

const MultiSelectField = ({
  options = [],
  selected = [],
  onToggle,
  onClear,
  placeholder = "Sélectionner...",
  searchable = false,
  searchPlaceholder = "Rechercher...",
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (val: string) => void;
  onClear: () => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}) => {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    return options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  return (
    <Popover modal={true} onOpenChange={(open) => { if (!open) setQuery(""); }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            selected.length === 0 && "text-muted-foreground"
          )}
        >
          <span className="truncate">
            {selected.length === 0
              ? placeholder
              : selected.map(s => options.find(o => o.value === s)?.label || s).join(", ")}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
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
          {filteredOptions.length === 0 && (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">Aucun résultat</p>
          )}
          {filteredOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted cursor-pointer transition-colors"
            >
              <Checkbox
                checked={selected.includes(opt.value)}
                onCheckedChange={() => onToggle(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="border-t border-border p-1.5">
            <button
              onClick={onClear}
              className="w-full rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-center"
            >
              Tout désélectionner
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export function TableFilter({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filters,
  onFiltersChange,
  filterLabels = {},
  sections = [],
  advancedButtonText = "Filtres",
  sheetTitle = "Filtres avancés",
}: TableFilterProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(filters);

  // Synchroniser l'état local du sheet avec les filtres appliqués
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isSheetOpen]);

  const updateLocalFilter = (key: string, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleLocalMultiSelect = (key: string, optionValue: string) => {
    const current = localFilters[key] || [];
    const next = current.includes(optionValue)
      ? current.filter((v: string) => v !== optionValue)
      : [...current, optionValue];
    updateLocalFilter(key, next);
  };

  const handleToggleQuickFilter = (key: string, optionValue: string) => {
    const current = filters[key] || [];
    const next = current.includes(optionValue)
      ? current.filter((v: string) => v !== optionValue)
      : [...current, optionValue];
    onFiltersChange({ ...filters, [key]: next });
  };

  const handleClearQuickFilter = (key: string) => {
    onFiltersChange({ ...filters, [key]: [] });
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsSheetOpen(false);
  };

  const handleClearAllFilters = () => {
    const emptyFilters = Object.keys(filters).reduce(
      (acc, key) => {
        acc[key] = Array.isArray(filters[key]) ? [] : undefined;
        return acc;
      },
      {} as Record<string, any>,
    );
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setIsSheetOpen(false);
  };

  const handleRemoveActiveFilter = (key: string) => {
    const next = { ...filters };
    if (Array.isArray(next[key])) {
      next[key] = [];
    } else {
      delete next[key];
    }
    onFiltersChange(next);
  };

  // Extraire dynamiquement les filtres rapides de l'ensemble des sections
  const quickFilters = useMemo(() => {
    const list: { key: string; label: string; options: FilterOption[]; searchable?: boolean; searchPlaceholder?: string }[] = [];
    sections.forEach((sec) => {
      sec.filters.forEach((f) => {
        if (f.isQuickFilter) {
          list.push({
            key: f.key,
            label: f.label,
            options: f.options || [],
            searchable: f.searchable,
            searchPlaceholder: f.searchPlaceholder,
          });
        }
      });
    });
    return list;
  }, [sections]);

  const renderFilterField = (field: FilterFieldConfig) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            placeholder={field.placeholder}
            value={localFilters[field.key] || ""}
            onChange={(e) => updateLocalFilter(field.key, e.target.value)}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={localFilters[field.key] || ""}
            onChange={(e) => updateLocalFilter(field.key, e.target.value)}
            min={field.min}
            max={field.max}
          />
        );

      case "select":
        return (
          <Select
            value={localFilters[field.key] || ""}
            onValueChange={(value) => updateLocalFilter(field.key, value)}
          >
            <SelectTrigger className={cn(!localFilters[field.key] && "text-muted-foreground")}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "date":
        return (
          <DatePicker
            date={localFilters[field.key]}
            onDateChange={(date) => updateLocalFilter(field.key, date)}
            placeholder={field.placeholder || "Sélectionner une date"}
          />
        );

      case "multi-select":
        return (
          <MultiSelectField
            options={field.options || []}
            selected={localFilters[field.key] || []}
            onToggle={(val) => handleToggleLocalMultiSelect(field.key, val)}
            onClear={() => updateLocalFilter(field.key, [])}
            placeholder={field.placeholder}
            searchable={field.searchable}
            searchPlaceholder={field.searchPlaceholder}
          />
        );

      default:
        return null;
    }
  };

  // Libellés résolus pour l'affichage des filtres actifs
  const resolvedFilterLabels = { ...filterLabels };
  sections.forEach((sec) => {
    sec.filters.forEach((f) => {
      resolvedFilterLabels[f.key] = f.label;
    });
  });

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Barre de recherche */}
          {onSearchChange && (
            <SearchInput
              searchQuery={searchQuery}
              onSearch={onSearchChange}
              onClear={() => onSearchChange("")}
              placeholder={searchPlaceholder}
            />
          )}

          {/* Filtres rapides (pastilles) */}
          {quickFilters.map((q) => (
            <SearchableFilterPill
              key={q.key}
              label={q.label}
              options={q.options}
              selected={filters[q.key] || []}
              onToggle={(value) => handleToggleQuickFilter(q.key, value)}
              onClear={() => handleClearQuickFilter(q.key)}
              searchable={q.searchable}
              searchPlaceholder={q.searchPlaceholder}
            />
          ))}
          {/* Déclencheur filtres avancés */}
          {sections.length > 0 && (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="size-4 shrink-0" />
                  {advancedButtonText}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[400px] sm:w-[500px] flex flex-col p-0"
                onPointerDownOutside={(e) => {
                  const target = e.target as HTMLElement;
                  if (
                    target.closest(".bg-popover") ||
                    target.closest("[role='dialog']") ||
                    target.closest("[role='listbox']") ||
                    target.closest(".rdp") ||
                    !target.isConnected
                  ) {
                    e.preventDefault();
                  }
                }}
                onInteractOutside={(e) => {
                  const target = e.target as HTMLElement;
                  if (
                    target.closest(".bg-popover") ||
                    target.closest("[role='dialog']") ||
                    target.closest("[role='listbox']") ||
                    target.closest(".rdp") ||
                    !target.isConnected
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                <SheetHeader className="p-6 pb-0">
                  <SheetTitle>
                    {sheetTitle}
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 pt-6">
                  <div className="space-y-6">
                    {sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="space-y-4">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 border-b pb-2">
                          {section.title}
                        </h3>

                        {section.filters.map((field) => (
                          <div key={field.key} className="space-y-2">
                            <Label htmlFor={field.key}>{field.label}</Label>
                            {renderFilterField(field)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <SheetFooter className="gap-2 p-6 border-t bg-white dark:bg-gray-950">
                  <Button variant="outline" className="flex-1" onClick={handleClearAllFilters}>
                    Effacer les filtres
                  </Button>
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={handleApplyFilters}>
                    Rechercher
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {/* Affichage des filtres actifs */}
      <ActiveFilters
        filters={filters}
        onRemoveFilter={handleRemoveActiveFilter}
        onClearAll={handleClearAllFilters}
        filterLabels={resolvedFilterLabels}
      />
    </div>
  );
}
