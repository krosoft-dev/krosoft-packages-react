import { useKrosoftTranslation } from "@/i18n";
import React from "react";
import { Input } from "@/components/ui";
import { DatePicker } from "@/components/core/inputs/DatePicker";
import { DateRangePicker } from "@/components/core/inputs/DateRangePicker";
import { SingleSelect } from "@/components/core/inputs/SingleSelect";
import { MultiSelect } from "@/components/core/inputs/MultiSelect";
import { DateRangeValue } from "@/types/DateRangeValue";
import { FilterFieldConfig } from "@/types/FilterFieldConfig";

interface FilterFieldProps<T extends Record<string, unknown>> {
  field: FilterFieldConfig<T>;
  value: unknown;
  onChange: (value: unknown) => void;
  onToggleMultiSelect: (value: string) => void;
}

export const FilterField = <T extends Record<string, unknown>>({
  field,
  value,
  onChange,
  onToggleMultiSelect,
}: FilterFieldProps<T>): React.ReactElement | null => {
  const { t } = useKrosoftTranslation();
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
      return (
        <SingleSelect
          options={field.options ?? []}
          value={value as string | undefined}
          onChange={onChange}
          searchable={field.searchable === true}
          placeholder={field.placeholder}
          searchPlaceholder={field.searchPlaceholder}
        />
      );

    case "date":
      return <DatePicker date={value as Date | undefined} onDateChange={onChange} placeholder={field.placeholder ?? t("date.pickDate")} />;

    case "date-range":
      return <DateRangePicker value={value as DateRangeValue | undefined} onChange={onChange} placeholder={field.placeholder} />;

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
