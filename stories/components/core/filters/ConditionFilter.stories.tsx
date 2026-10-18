import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ConditionFilter, type ConditionFilterOperator, type ConditionFilterValue } from "@/components/core/filters/ConditionFilter";

const FIELDS = [
  { value: "export.FilesCount", label: "FilesCount", description: "export_factures" },
  { value: "export.Folder", label: "Folder", description: "export_factures" },
  { value: "archive.Done", label: "Done", description: "archive" },
];

const OPERATORS: ConditionFilterOperator[] = [
  { value: "Equal", label: "=", title: "égal à" },
  { value: "NotEqual", label: "≠", title: "différent de" },
  { value: "GreaterThan", label: ">", title: "supérieur à", numeric: true },
  { value: "GreaterThanOrEqual", label: "≥", title: "supérieur ou égal à", numeric: true },
  { value: "LessThan", label: "<", title: "inférieur à", numeric: true },
  { value: "LessThanOrEqual", label: "≤", title: "inférieur ou égal à", numeric: true },
  { value: "NotEmpty", label: "non vide", title: "renseigné", requiresValue: false },
];

const meta: Meta<typeof ConditionFilter> = {
  title: "Core/Filters/ConditionFilter",
  component: ConditionFilter,
  args: {
    fields: FIELDS,
    operators: OPERATORS,
    labelKey: "Sortie",
  },
  render: args => {
    const [value, setValue] = useState<ConditionFilterValue | undefined>(args.value);
    return <ConditionFilter {...args} value={value} onChange={setValue} />;
  },
};

export default meta;
type Story = StoryObj<typeof ConditionFilter>;

export const Empty: Story = {};

export const Applied: Story = {
  args: {
    value: { field: "export.FilesCount", operator: "GreaterThanOrEqual", value: "2" },
  },
};

export const WithoutValue: Story = {
  args: {
    value: { field: "export.Folder", operator: "NotEmpty", value: "" },
  },
};
