import { useKrosoftTranslation } from "@/i18n";
import React, { useState, useEffect, useMemo } from "react";
import { Button, Label, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui";
import { Filter } from "lucide-react";
import { FilterSection } from "@/types/FilterSection";
import { FilterField } from "./FilterField";

const isFilterActive = (value: unknown): boolean => {
  if (value === undefined || value === null || value === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
};

export interface AdvancedFiltersProps<T extends Record<string, unknown> = Record<string, unknown>> {
  sections: FilterSection<T>[];
  filters: T;
  onFiltersChange: (filters: T) => void;
  buttonText?: string;
  sheetTitle?: string;
}

export function AdvancedFilters<T extends Record<string, unknown> = Record<string, unknown>>({
  sections,
  filters,
  onFiltersChange,
  buttonText,
  sheetTitle,
}: AdvancedFiltersProps<T>): React.ReactElement {
  const { t } = useKrosoftTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, unknown>>(filters);

  // Synchroniser l'état local du sheet avec les filtres appliqués
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const updateLocalFilter = (key: string, value: unknown): void => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleLocalMultiSelect = (key: string, optionValue: string): void => {
    const current = localFilters[key];
    const currentArray = Array.isArray(current) ? (current as string[]) : [];
    const next = currentArray.includes(optionValue) ? currentArray.filter(v => v !== optionValue) : [...currentArray, optionValue];
    updateLocalFilter(key, next);
  };

  const handleApplyFilters = (): void => {
    onFiltersChange(localFilters as unknown as T);
    setIsOpen(false);
  };

  const handleClearAllFilters = (): void => {
    setLocalFilters({});
    onFiltersChange({} as unknown as T);
    setIsOpen(false);
  };

  // Nombre de critères actifs parmi les champs des sections
  const activeCount = useMemo(() => {
    const keys = new Set(sections.flatMap(section => section.filters.map(field => field.key as string)));
    return Object.entries(filters).filter(([key, value]) => keys.has(key) && isFilterActive(value)).length;
  }, [sections, filters]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="size-4 shrink-0" />
          {buttonText ?? t("filters.more")}
          {activeCount > 0 && (
            <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] flex flex-col p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>{sheetTitle ?? t("filters.advanced")}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-6">
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 border-b pb-2">{t(section.titleKey)}</h3>

                {section.filters.map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{t(field.labelKey)}</Label>
                    <FilterField
                      field={field}
                      value={localFilters[field.key]}
                      onChange={val => {
                        updateLocalFilter(field.key, val);
                      }}
                      onToggleMultiSelect={val => {
                        handleToggleLocalMultiSelect(field.key, val);
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <SheetFooter className="gap-2 p-6 border-t bg-white dark:bg-gray-950">
          <Button variant="outline" className="flex-1" onClick={handleClearAllFilters}>
            {t("filters.clear")}
          </Button>
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={handleApplyFilters}>
            {t("filters.apply")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
