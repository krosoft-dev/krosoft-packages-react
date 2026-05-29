import { FilterFieldConfig } from "./FilterFieldConfig";

export interface FilterSection<T extends Record<string, unknown> = Record<string, unknown>> {
  title: string;
  filters: FilterFieldConfig<T>[];
}
