import { FilterFieldConfig } from "./FilterFieldConfig";

export interface FilterSection<T extends Record<string, unknown> = Record<string, unknown>> {
  titleKey: string;
  filters: FilterFieldConfig<T>[];
}
