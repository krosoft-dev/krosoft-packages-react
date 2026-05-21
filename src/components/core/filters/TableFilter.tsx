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
  filters: Record<string, unknown>;
  onFiltersChange: (filters: Record<string, unknown>) => void;
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
  sections,
  advancedButtonText = "Filtres",
  sheetTitle = "Filtres avancés",
}: TableFilterProps): React.ReactElement {
  const handleToggleQuickFilter = (key: string, optionValue: string): void => {
    const current = filters[key];
    const currentArray = Array.isArray(current) ? (current as string[]) : [];
    const next = currentArray.includes(optionValue) ? currentArray.filter(v => v !== optionValue) : [...currentArray, optionValue];

    const updatedFilters = { ...filters };
    if (next.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete updatedFilters[key];
    } else {
      updatedFilters[key] = next;
    }
    onFiltersChange(updatedFilters);
  };

  const handleClearQuickFilter = (key: string): void => {
    const next = { ...filters };
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete next[key];
    onFiltersChange(next);
  };

  const handleClearAllFilters = (): void => {
    onFiltersChange({});
  };

  const handleRemoveActiveFilter = (key: string, valueToRemove?: unknown): void => {
    const next = { ...filters };
    const currentValue = next[key];
    if (Array.isArray(currentValue)) {
      if (valueToRemove !== undefined) {
        next[key] = currentValue.filter(v => v !== valueToRemove);
        if (Array.isArray(next[key]) && (next[key] as unknown[]).length === 0) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete next[key];
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete next[key];
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete next[key];
    }
    onFiltersChange(next);
  };

  // Extraire dynamiquement les filtres rapides de l'ensemble des sections
  const quickFilters = useMemo(() => {
    const list: { key: string; label: string; options: FilterOption[]; searchable?: boolean; searchPlaceholder?: string }[] = [];
    sections.forEach(sec => {
      sec.filters.forEach(f => {
        if (f.isQuickFilter === true) {
          list.push({
            key: f.key,
            label: f.label,
            options: f.options ?? [],
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
    sections.forEach(sec => {
      sec.filters.forEach(f => {
        labels[f.key] = f.label;
      });
    });
    return labels;
  }, [sections, filterLabels]);

  const optionLabels = useMemo(() => {
    const map: Record<string, string> = {};
    sections.forEach(sec => {
      sec.filters.forEach(f => {
        if (f.options !== undefined) {
          f.options.forEach(opt => {
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
          {onSearchChange !== undefined ? (
            <SearchInput
              searchQuery={searchQuery}
              onSearch={onSearchChange}
              onClear={() => {
                onSearchChange("");
              }}
              placeholder={searchPlaceholder}
            />
          ) : null}

          {/* Filtres rapides (pastilles) */}
          {quickFilters.map(q => (
            <SearchableFilterPill
              key={q.key}
              label={q.label}
              options={q.options}
              selected={Array.isArray(filters[q.key]) ? (filters[q.key] as string[]) : []}
              onToggle={value => {
                handleToggleQuickFilter(q.key, value);
              }}
              onClear={() => {
                handleClearQuickFilter(q.key);
              }}
              onSelectAll={values => {
                onFiltersChange({ ...filters, [q.key]: values });
              }}
              searchable={q.searchable}
              searchPlaceholder={q.searchPlaceholder}
            />
          ))}

          {/* Déclencheur filtres avancés */}
          {sections.length > 0 && (
            <AdvancedFilters sections={sections} filters={filters} onFiltersChange={onFiltersChange} buttonText={advancedButtonText} sheetTitle={sheetTitle} />
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
