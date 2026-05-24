import React from "react";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { DatePicker } from "@/components/core/inputs/DatePicker";
import { DateRangePicker } from "@/components/core/inputs/DateRangePicker";
import { MultiSelect } from "@/components/core/inputs/MultiSelect";
import { SearchableSelect } from "@/components/core/inputs/SearchableSelect";
import type { DateRange } from "react-day-picker";
import type { FilterFieldConfig } from "./TableFilter";
import { cn } from "@/helpers/tailwind.helper";

interface FilterFieldProps {
  field: FilterFieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  onToggleMultiSelect: (value: string) => void;
}

export const FilterField = ({ field, value, onChange, onToggleMultiSelect }: FilterFieldProps): React.ReactElement | null => {
  switch (field.type) {
    case "text":
      return (
        <Input
          placeholder={field.placeholder}
          value={(value as string | undefined) ?? ""}
          onChange={e => {
            onChange(e.target.value);
          }}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          placeholder={field.placeholder}
          value={(value as string | undefined) ?? ""}
          onChange={e => {
            onChange(e.target.value);
          }}
          min={field.min}
          max={field.max}
        />
      );

    case "select":
      if (field.searchable === true) {
        return (
          <SearchableSelect
            options={field.options ?? []}
            value={value as string | undefined}
            onChange={onChange}
            placeholder={field.placeholder}
            searchPlaceholder={field.searchPlaceholder}
          />
        );
      }
      return (
        <Select value={(value as string | undefined) ?? ""} onValueChange={onChange}>
          <SelectTrigger className={cn((value === undefined || value === "") && "text-muted-foreground")}>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "date":
      return <DatePicker date={value as Date | undefined} onDateChange={onChange} placeholder={field.placeholder ?? "Sélectionner une date"} />;

    case "date-range":
      return <DateRangePicker value={value as DateRange | undefined} onChange={onChange} placeholder={field.placeholder} />;

    case "multi-select":
      return (
        <MultiSelect
          options={field.options ?? []}
          selected={(value as string[] | undefined) ?? []}
          onToggle={onToggleMultiSelect}
          onClear={() => {
            onChange([]);
          }}
          onSelectAll={onChange}
          placeholder={field.placeholder}
          searchable={field.searchable}
          searchPlaceholder={field.searchPlaceholder}
        />
      );

    default:
      return null;
  }
};
