import type { SelectOption } from "@krosoft/core/types";

export interface FilterFieldConfig<T extends Record<string, unknown> = Record<string, unknown>> {
  key: Extract<keyof T, string>;
  labelKey: string;
  badgeLabelKey?: string;
  type: "text" | "select" | "date" | "date-range" | "number" | "multi-select";
  placeholder?: string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  isQuickFilter?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}
