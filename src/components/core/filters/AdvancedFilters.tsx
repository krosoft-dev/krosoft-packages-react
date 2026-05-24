import React, { useState, useEffect } from "react";
import { Button, Label, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui";
import { Filter } from "lucide-react";
import { FilterSection } from "@/types/FilterSection";
import { FilterField } from "./FilterField";

export interface AdvancedFiltersProps {
  sections: FilterSection[];
  filters: Record<string, unknown>;
  onFiltersChange: (filters: Record<string, unknown>) => void;
  buttonText?: string;
  sheetTitle?: string;
}

export function AdvancedFilters({
  sections,
  filters,
  onFiltersChange,
  buttonText = "Plus de filtres",
  sheetTitle = "Filtres avancés",
}: AdvancedFiltersProps): React.ReactElement {
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
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleClearAllFilters = (): void => {
    setLocalFilters({});
    onFiltersChange({});
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="size-4 shrink-0" />
          {buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] flex flex-col p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>{sheetTitle}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-6">
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 border-b pb-2">{section.title}</h3>

                {section.filters.map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
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
            Effacer les filtres
          </Button>
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={handleApplyFilters}>
            Rechercher
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
