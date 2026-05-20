import React, { useMemo } from "react";
import { SearchInput } from "../inputs/SearchInput";
import { SearchableFilterPill, FilterOption } from "./SearchableFilterPill";
import { ActiveFilters } from "./ActiveFilters";
import { AdvancedFilters } from "./AdvancedFilters";
import { FilterFieldConfig, FilterSection } from "./types";

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
  const handleToggleQuickFilter = (key: string, optionValue: string) => {
    const current = filters[key] || [];
    const next = current.includes(optionValue)
      ? current.filter((v: string) => v !== optionValue)
      : [...current, optionValue];

    const updatedFilters = { ...filters };
    if (next.length === 0) {
      delete updatedFilters[key];
    } else {
      updatedFilters[key] = next;
    }
    onFiltersChange(updatedFilters);
  };

  const handleClearQuickFilter = (key: string) => {
    const next = { ...filters };
    delete next[key];
    onFiltersChange(next);
  };

  const handleClearAllFilters = () => {
    onFiltersChange({});
  };

  const handleRemoveActiveFilter = (key: string, valueToRemove?: any) => {
    const next = { ...filters };
    if (Array.isArray(next[key])) {
      if (valueToRemove !== undefined) {
        next[key] = next[key].filter((v: any) => v !== valueToRemove);
        if (next[key].length === 0) {
          delete next[key];
        }
      } else {
        delete next[key];
      }
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

  // Libellés résolus pour l'affichage des filtres actifs
  const resolvedFilterLabels = useMemo(() => {
    const labels = { ...filterLabels };
    sections.forEach((sec) => {
      sec.filters.forEach((f) => {
        labels[f.key] = f.label;
      });
    });
    return labels;
  }, [sections, filterLabels]);

  const optionLabels = useMemo(() => {
    const map: Record<string, string> = {};
    sections.forEach((sec) => {
      sec.filters.forEach((f) => {
        if (f.options) {
          f.options.forEach((opt) => {
            map[`${f.key}_${opt.value}`] = opt.label;
          });
        }
      });
    });
    return map;
  }, [sections]);

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
              onSelectAll={(values) => onFiltersChange({ ...filters, [q.key]: values })}
              searchable={q.searchable}
              searchPlaceholder={q.searchPlaceholder}
            />
          ))}

          {/* Déclencheur filtres avancés */}
          {sections.length > 0 && (
            <AdvancedFilters
              sections={sections}
              filters={filters}
              onFiltersChange={onFiltersChange}
              buttonText={advancedButtonText}
              sheetTitle={sheetTitle}
            />
          )}
        </div>
      </div>

      {/* Affichage des filtres actifs */}
      <ActiveFilters
        filters={filters}
        onRemoveFilter={handleRemoveActiveFilter}
        onClearAll={handleClearAllFilters}
        filterLabels={resolvedFilterLabels}
        optionLabels={optionLabels}
      />
    </div>
  );
}
export type { FilterFieldConfig, FilterSection };
