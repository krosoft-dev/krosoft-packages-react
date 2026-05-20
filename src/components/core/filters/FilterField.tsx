import React from "react";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { DatePicker } from "./DatePicker";
import { MultiSelectField } from "./MultiSelectField";
import { SearchableSelect } from "./SearchableSelect";
import type { FilterFieldConfig } from "./TableFilter";
import { cn } from "@/helpers/tailwind.helper";

interface FilterFieldProps {
  field: FilterFieldConfig;
  value: any;
  onChange: (value: any) => void;
  onToggleMultiSelect: (value: string) => void;
}

export const FilterField = ({
  field,
  value,
  onChange,
  onToggleMultiSelect,
}: FilterFieldProps) => {
  switch (field.type) {
    case "text":
      return (
        <Input
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          min={field.min}
          max={field.max}
        />
      );

    case "select":
      if (field.searchable) {
        return (
          <SearchableSelect
            options={field.options || []}
            value={value}
            onChange={onChange}
            placeholder={field.placeholder}
            searchPlaceholder={field.searchPlaceholder}
          />
        );
      }
      return (
        <Select
          value={value || ""}
          onValueChange={onChange}
        >
          <SelectTrigger className={cn(!value && "text-muted-foreground")}>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "date":
      return (
        <DatePicker
          date={value}
          onDateChange={onChange}
          placeholder={field.placeholder || "Sélectionner une date"}
        />
      );

    case "multi-select":
      return (
        <MultiSelectField
          options={field.options || []}
          selected={value || []}
          onToggle={onToggleMultiSelect}
          onClear={() => onChange([])}
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
