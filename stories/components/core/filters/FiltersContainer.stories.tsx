import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FiltersContainer } from "@/components/core/filters/FiltersContainer";
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
  { value: "nice", label: "Nice" },
  { value: "toulouse", label: "Toulouse" },
];

const toggle = (list: string[], value: string): string[] => (list.includes(value) ? list.filter(v => v !== value) : [...list, value]);

/** Deux filtres passés en `children`, largeur pleine en mobile puis fixe en desktop. */
const DemoFilters = (): React.ReactElement => (
  <>
    <div className="w-full md:w-[220px]">
      <MultiSelect options={STATUTS} selected={["actif"]} onToggle={() => {}} onClear={() => {}} onSelectAll={() => {}} placeholder="Statuts" />
    </div>
    <div className="w-full md:w-[220px]">
      <MultiSelect options={VILLES} selected={[]} onToggle={() => {}} onClear={() => {}} onSelectAll={() => {}} placeholder="Villes" searchable />
    </div>
  </>
);

const meta: Meta<typeof FiltersContainer> = {
  title: "Core/Filters/FiltersContainer",
  component: FiltersContainer,
  parameters: {
    docs: {
      description: {
        component:
          "Barre de filtres d'un tableau : recherche + filtres passés en `children` + bouton de réinitialisation. " +
          "Sous 768px de largeur de fenêtre, bascule automatiquement en tiroir mobile (`FiltersMobileDrawer`). " +
          "Réduisez la fenêtre du navigateur pour voir le rendu mobile.",
      },
    },
  },
  decorators: [
    Story => (
      <div className="w-full p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    search: "",
    searchPlaceholder: "Rechercher...",
    onSearch: () => {},
    onReset: () => {},
    children: <DemoFilters />,
  },
};

export default meta;
type Story = StoryObj<typeof FiltersContainer>;

export const Default: Story = {
  args: {
    activeFiltersCount: 1,
  },
};

export const SearchOnly: Story = {
  args: {
    children: undefined,
    onReset: undefined,
  },
};

export const WithoutReset: Story = {
  args: {
    onReset: undefined,
    activeFiltersCount: 0,
  },
};

export const WithActiveFiltersBadge: Story = {
  args: {
    activeFiltersCount: 3,
  },
};

export const Interactive: Story = {
  render: () => {
    const [search, setSearch] = useState("");
    const [statuts, setStatuts] = useState<string[]>([]);
    const [villes, setVilles] = useState<string[]>([]);

    const activeFiltersCount = (statuts.length > 0 ? 1 : 0) + (villes.length > 0 ? 1 : 0);

    const reset = (): void => {
      setSearch("");
      setStatuts([]);
      setVilles([]);
    };

    return (
      <div className="space-y-6">
        <FiltersContainer
          search={search}
          searchPlaceholder="Rechercher un client..."
          activeFiltersCount={activeFiltersCount}
          onSearch={setSearch}
          onReset={reset}
        >
          <div className="w-full md:w-[220px]">
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
          </div>
          <div className="w-full md:w-[220px]">
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
          </div>
        </FiltersContainer>
        <div className="rounded border bg-muted p-3 text-xs">
          <p className="mb-1 font-medium">État courant :</p>
          <p className="mb-1">Recherche : {search.length > 0 ? `"${search}"` : "(vide)"}</p>
          <pre>{JSON.stringify({ statuts, villes }, null, 2)}</pre>
        </div>
      </div>
    );
  },
};
