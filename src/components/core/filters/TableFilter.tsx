import React, { useMemo } from "react";
import { SearchInput } from "../inputs/SearchInput";
import { SearchableFilterPill, FilterOption } from "./SearchableFilterPill";
import { ActiveFilters } from "./ActiveFilters";
import { AdvancedFilters } from "./AdvancedFilters";
import { TableFilterProps } from "@/types/TableFilterProps";

export function TableFilter<T extends Record<string, unknown> = Record<string, unknown>>({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filters,
  onFiltersChange,
  sections,
  advancedButtonText = "Filtres",
  sheetTitle = "Filtres avancés",
}: TableFilterProps<T>): React.ReactElement {
  const handleToggleQuickFilter = (key: keyof T, optionValue: string): void => {
    const current = filters[key];
    const currentArray = Array.isArray(current) ? (current as string[]) : [];
    const next = currentArray.includes(optionValue) ? currentArray.filter(v => v !== optionValue) : [...currentArray, optionValue];

    const updatedFilters = { ...filters };
    if (next.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete updatedFilters[key];
    } else {
      updatedFilters[key] = next as T[keyof T];
    }
    onFiltersChange(updatedFilters);
  };

  const handleClearQuickFilter = (key: keyof T): void => {
    const next = { ...filters };
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete next[key];
    onFiltersChange(next);
  };

  const handleClearAllFilters = (): void => {
    onFiltersChange({} as unknown as T);
  };

  const handleRemoveActiveFilter = (key: keyof T, valueToRemove?: unknown): void => {
    const next = { ...filters };
    const currentValue = next[key];
    if (Array.isArray(currentValue)) {
      if (valueToRemove !== undefined) {
        next[key] = currentValue.filter(v => v !== valueToRemove) as T[keyof T];
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
    const list: { key: keyof T; label: string; options: FilterOption[]; searchable?: boolean; searchPlaceholder?: string }[] = [];
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
  const FilterLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    sections.forEach(sec => {
      sec.filters.forEach(f => {
        labels[f.key as string] = f.badgeLabel ?? f.label;
      });
    });
    return labels;
  }, [sections]);

  const optionLabels = useMemo(() => {
    const map: Record<string, string> = {};
    sections.forEach(sec => {
      sec.filters.forEach(f => {
        if (f.options !== undefined) {
          f.options.forEach(opt => {
            map[`${f.key as string}_${opt.value}`] = opt.label;
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
              key={q.key as string}
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
        filterLabels={FilterLabels}
        optionLabels={optionLabels}
      />
    </div>
  );
}
