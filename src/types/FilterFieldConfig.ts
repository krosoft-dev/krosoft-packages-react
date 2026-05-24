export interface FilterFieldConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "date-range" | "number" | "multi-select";
  placeholder?: string;
  options?: { value: string; label: string; }[];
  min?: number;
  max?: number;
  isQuickFilter?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}
