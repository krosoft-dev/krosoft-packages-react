import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FilterPillsGroup, type FilterPillOption, type FilterPillsGroupProps } from "@/components/core/filters/FilterPillsGroup";

// Wrapper pour résoudre le type générique avec Storybook
const FilterPillsGroupString = (props: FilterPillsGroupProps<string>): React.ReactElement => <FilterPillsGroup<string> {...props} />;

const TAGS: FilterPillOption<string>[] = [
  { value: "adultes", label: "Adultes" },
  { value: "enfants", label: "Enfants" },
  { value: "fr", label: "FR" },
  { value: "vo", label: "VO" },
  { value: "noel", label: "Noël" },
];

const ANNEES: FilterPillOption<string>[] = [
  { value: "2021", label: "2021", count: 3 },
  { value: "2022", label: "2022", count: 8 },
  { value: "2023", label: "2023", count: 12 },
  { value: "2024", label: "2024", count: 5 },
];

const meta: Meta<typeof FilterPillsGroupString> = {
  title: "Core/Filters/FilterPillsGroup",
  component: FilterPillsGroupString,
  args: {
    options: TAGS,
    values: ["enfants", "fr"],
    onToggle: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof FilterPillsGroupString>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const WithCounts: Story = {
  args: {
    options: ANNEES,
    values: ["2023"],
    variant: "outline",
  },
};

export const Empty: Story = {
  args: {
    values: [],
  },
};

export const Interactive: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(["fr"]);
    return (
      <div className="space-y-4">
        <FilterPillsGroup<string>
          options={TAGS}
          values={values}
          onToggle={v => {
            setValues(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]));
          }}
          variant="outline"
        />
        <p className="text-xs text-muted-foreground">{values.length === 0 ? "Aucun tag sélectionné" : `Sélectionnés : ${values.join(", ")}`}</p>
      </div>
    );
  },
};
