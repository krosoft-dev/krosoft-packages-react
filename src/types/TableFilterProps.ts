import { FilterSection } from "./FilterSection";

export interface TableFilterProps<T extends Record<string, unknown> = Record<string, unknown>> {
  // Recherche
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;

  // Filtres
  filters: T;
  onFiltersChange: (filters: T) => void;

  // Configuration des filtres (regroupés par sections)
  sections: FilterSection<T>[];

  // Textes & Boutons
  advancedButtonText?: string;
  sheetTitle?: string;
}
