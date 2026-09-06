import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FiltersMobileDrawer } from "@/components/core/filters/FiltersMobileDrawer";
import { MultiSelect } from "@/components/core/inputs/MultiSelect";

const STATUTS = [
  { value: "actif", label: "Actif", color: "#22c55e" },
  { value: "inactif", label: "Inactif", color: "#ef4444" },
  { value: "prospect", label: "Prospect", color: "#3b82f6" },
];

const VILLES = [
  { value: "paris", label: "Paris" },
  { value: "lyon", label: "Lyon" },
  { value: "marseille", label: "Marseille" },
  { value: "bordeaux", label: "Bordeaux" },
];

const toggle = (list: string[], value: string): string[] => (list.includes(value) ? list.filter(v => v !== value) : [...list, value]);

const DemoFilters = (): React.ReactElement => (
  <>
    <MultiSelect options={STATUTS} selected={["actif"]} onToggle={() => {}} onClear={() => {}} onSelectAll={() => {}} placeholder="Statuts" />
    <MultiSelect options={VILLES} selected={[]} onToggle={() => {}} onClear={() => {}} onSelectAll={() => {}} placeholder="Villes" searchable />
  </>
);

const meta: Meta<typeof FiltersMobileDrawer> = {
  title: "Core/Filters/FiltersMobileDrawer",
  component: FiltersMobileDrawer,
  parameters: {
    docs: {
      description: {
        component:
          "Tiroir de filtres pour le mobile, déclenché par un bouton portant le nombre de filtres actifs. " +
          "Utilisé automatiquement par `FiltersContainer` sous 768px. Les `children` (filtres) sont empilés verticalement.",
      },
    },
  },
  decorators: [
    Story => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    activeFiltersCount: 2,
    onReset: () => {},
    onApply: () => {},
    children: <DemoFilters />,
  },
};

export default meta;
type Story = StoryObj<typeof FiltersMobileDrawer>;

export const Default: Story = {};

export const NoActiveFilters: Story = {
  args: {
    activeFiltersCount: 0,
  },
};

export const Interactive: Story = {
  render: () => {
    const [statuts, setStatuts] = useState<string[]>([]);
    const [villes, setVilles] = useState<string[]>([]);

    const activeFiltersCount = (statuts.length > 0 ? 1 : 0) + (villes.length > 0 ? 1 : 0);

    const reset = (): void => {
      setStatuts([]);
      setVilles([]);
    };

    return (
      <div className="space-y-4">
        <FiltersMobileDrawer activeFiltersCount={activeFiltersCount} onReset={reset}>
          <MultiSelect
            options={STATUTS}
            selected={statuts}
            onToggle={value => {
              setStatuts(prev => toggle(prev, value));
            }}
            onClear={() => {
              setStatuts([]);
            }}
            onSelectAll={setStatuts}
            placeholder="Statuts"
          />
          <MultiSelect
            options={VILLES}
            selected={villes}
            onToggle={value => {
              setVilles(prev => toggle(prev, value));
            }}
            onClear={() => {
              setVilles([]);
            }}
            onSelectAll={setVilles}
            placeholder="Villes"
            searchable
          />
        </FiltersMobileDrawer>
        <div className="rounded border bg-muted p-3 text-xs">
          <p className="mb-1 font-medium">État courant :</p>
          <pre>{JSON.stringify({ statuts, villes }, null, 2)}</pre>
        </div>
      </div>
    );
  },
};
