import { useKrosoftTranslation } from "@/i18n";
import { getLocale } from "@krosoft/core/helpers";
import { Badge } from "@/components/ui";
import { XIcon } from "lucide-react";

interface ActiveFiltersProps {
  filters: Record<string, unknown>;
  onRemoveFilter: (key: string, value?: unknown) => void;
  onClearAll: () => void;
  filterLabels?: Record<string, string>;
  optionLabels?: Record<string, string>;
}

const getFilterDisplayValue = (key: string, value: unknown, t: (key: string) => string, optionLabels: Record<string, string> = {}): React.ReactNode => {
  if (value instanceof Date) {
    return value.toLocaleDateString(getLocale());
  }

  const strValue = String(value);
  const resolvedLabel = optionLabels[`${key}_${strValue}`] as string | undefined;
  if (resolvedLabel !== undefined) return resolvedLabel;

  if (key.includes("ok") || value === "true" || value === "false") {
    return t(value === "true" ? "filters.yes" : "filters.no");
  }

  return strValue;
};

export function ActiveFilters({ filters, onRemoveFilter, onClearAll, filterLabels = {}, optionLabels = {} }: ActiveFiltersProps): React.ReactElement | null {
  const { t } = useKrosoftTranslation();
  const activeFilters = Object.entries(filters).filter(([_key, value]) => {
    if (value === undefined || value === null || value === "") return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-gray-600 font-medium">Filtres actifs :</span>
      {activeFilters.flatMap(([key, value]) => {
        const label = filterLabels[key] ?? key;

        if (Array.isArray(value)) {
          return value.map(val => {
            const displayValue = getFilterDisplayValue(key, val, t, optionLabels);
            return (
              <Badge
                key={`${key}_${String(val)}`}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
              >
                {label}: {displayValue}
                <button
                  onClick={() => {
                    onRemoveFilter(key, val);
                  }}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <XIcon className="size-4" />
                </button>
              </Badge>
            );
          });
        }

        const displayValue = getFilterDisplayValue(key, value, t, optionLabels);
        return (
          <Badge key={key} variant="secondary" className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100">
            {label}: {displayValue}
            <button
              onClick={() => {
                onRemoveFilter(key);
              }}
              className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
            >
              <XIcon className="size-4" />
            </button>
          </Badge>
        );
      })}
      {activeFilters.length > 0 && (
        <button onClick={onClearAll} className="text-xs text-red-500 hover:text-red-600 transition-colors font-medium ml-auto">
          Effacer tout
        </button>
      )}
    </div>
  );
}
