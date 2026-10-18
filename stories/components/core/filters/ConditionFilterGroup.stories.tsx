import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { type ConditionFilterOperator, type ConditionFilterValue } from "@/components/core/filters/ConditionFilter";
import { ConditionFilterGroup } from "@/components/core/filters/ConditionFilterGroup";

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

const meta: Meta<typeof ConditionFilterGroup> = {
  title: "Core/Filters/ConditionFilterGroup",
  component: ConditionFilterGroup,
  args: {
    fields: FIELDS,
    operators: OPERATORS,
    values: [],
    labelKey: "Sortie",
  },
  render: args => {
    const [values, setValues] = useState<ConditionFilterValue[]>(args.values);
    return <ConditionFilterGroup {...args} values={values} onChange={setValues} />;
  },
};

export default meta;
type Story = StoryObj<typeof ConditionFilterGroup>;

export const Empty: Story = {};

export const TwoConditions: Story = {
  args: {
    values: [
      { field: "export.FilesCount", operator: "GreaterThan", value: "0" },
      { field: "export.Folder", operator: "Equal", value: "in" },
    ],
  },
};

export const MaxReached: Story = {
  args: {
    max: 2,
    values: [
      { field: "export.FilesCount", operator: "GreaterThan", value: "0" },
      { field: "export.Folder", operator: "NotEmpty", value: "" },
    ],
  },
};
