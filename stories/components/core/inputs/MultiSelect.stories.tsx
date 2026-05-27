import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MultiSelect } from "@/components/core/inputs/MultiSelect";

const VILLES = [
  { value: "paris", label: "Paris" },
  { value: "lyon", label: "Lyon" },
  { value: "marseille", label: "Marseille" },
  { value: "bordeaux", label: "Bordeaux" },
  { value: "nice", label: "Nice" },
  { value: "toulouse", label: "Toulouse" },
];

const NOMBREUSES_OPTIONS = [
  ...VILLES,
  { value: "nantes", label: "Nantes" },
  { value: "strasbourg", label: "Strasbourg" },
  { value: "montpellier", label: "Montpellier" },
  { value: "rennes", label: "Rennes" },
  { value: "lille", label: "Lille" },
  { value: "reims", label: "Reims" },
  { value: "saint-etienne", label: "Saint-Étienne" },
  { value: "toulon", label: "Toulon" },
  { value: "grenoble", label: "Grenoble" },
];

const meta: Meta<typeof MultiSelect> = {
  title: "Core/Inputs/MultiSelect",
  component: MultiSelect,
  decorators: [
    (Story) => (
      <div className="w-72 pb-72">
        <Story />
      </div>
    ),
  ],
  args: {
    options: VILLES,
    selected: [],
    onToggle: () => {},
    onClear: () => {},
    placeholder: "Sélectionner des villes",
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {};

export const WithSelections: Story = {
  args: {
    selected: ["paris", "lyon"],
  },
};

export const Searchable: Story = {
  args: {
    searchable: true,
    searchPlaceholder: "Rechercher une ville...",
  },
};

export const AllSelected: Story = {
  args: {
    selected: VILLES.map(v => v.value),
  },
};

export const ManyOptions: Story = {
  args: {
    options: NOMBREUSES_OPTIONS,
    selected: ["paris", "nantes", "lille"],
    searchable: true,
    searchPlaceholder: "Rechercher une ville...",
  },
};

export const WithClearIcon: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["paris", "lyon", "nice"]);
    return (
      <div className="w-72 pb-72 space-y-2">
        <MultiSelect
          options={VILLES}
          selected={selected}
          onToggle={val => {
            setSelected(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));
          }}
          onClear={() => {
            setSelected([]);
          }}
          placeholder="Sélectionner des villes"
        />
        <p className="text-xs text-muted-foreground">
          {selected.length === 0 ? "Sélection vidée via le ×" : `Sélectionnés : ${selected.join(", ")}`}
        </p>
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (val: string): void => {
      setSelected(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));
    };
    return (
      <div className="w-72 pb-72 space-y-2">
        <MultiSelect
          options={VILLES}
          selected={selected}
          onToggle={toggle}
          onClear={() => {
            setSelected([]);
          }}
          onSelectAll={setSelected}
          searchable
          searchPlaceholder="Rechercher une ville..."
          placeholder="Sélectionner des villes"
        />
        <p className="text-xs text-muted-foreground">
          {selected.length === 0 ? "Aucune sélection" : `Sélectionnés : ${selected.join(", ")}`}
        </p>
      </div>
    );
  },
};
