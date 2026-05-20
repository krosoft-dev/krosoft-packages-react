import { Badge } from "@/components/ui";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  filters: Record<string, any>;
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
  filterLabels?: Record<string, string>;
}

const getFilterDisplayValue = (key: string, value: any) => {
  if (value instanceof Date) {
    return value.toLocaleDateString("fr-FR");
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  // Formatage spécifique selon le type de filtre
  if (key.includes("budget") || key.includes("Budget")) {
    return `${value}€`;
  }
  if (key.includes("surface") || key.includes("Surface")) {
    return `${value}m²`;
  }
  if (key.includes("ok") || value === "true" || value === "false") {
    return value === "true" ? "Oui" : "Non";
  }

  return value;
};

export function ActiveFilters({ filters, onRemoveFilter, onClearAll, filterLabels = {} }: ActiveFiltersProps) {
  const activeFilters = Object.entries(filters).filter(([_key, value]) => {
    if (value === undefined || value === null || value === "") return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-gray-600 font-medium">Filtres actifs :</span>
      {activeFilters.map(([key, value]) => {
        const label = filterLabels[key] || key;
        const displayValue = getFilterDisplayValue(key, value);

        return (
          <Badge
            key={key}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
          >
            {label}: {displayValue as React.ReactNode}
            <button onClick={() => onRemoveFilter(key)} className="ml-1 hover:bg-blue-200 rounded-full p-0.5">
              <X className="size-3" />
            </button>
          </Badge>
        );
      })}
      {activeFilters.length > 1 && (
        <button onClick={onClearAll} className="text-sm text-red-600 hover:text-red-800 underline ml-2">
          Effacer tous les filtres
        </button>
      )}
    </div>
  );
}
