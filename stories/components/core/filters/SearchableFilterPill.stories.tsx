import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SearchableFilterPill, type FilterOption } from "@/components/core/filters/SearchableFilterPill";

// Wrapper pour résoudre le type générique avec Storybook
type SearchableFilterPillStringProps = {
  label: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear?: () => void;
  onSelectAll?: (values: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
};

const SearchableFilterPillString = (props: SearchableFilterPillStringProps) => <SearchableFilterPill<string> {...props} />;

const STATUTS: FilterOption[] = [
  { value: "actif", label: "Actif" },
  { value: "inactif", label: "Inactif" },
  { value: "prospect", label: "Prospect" },
  { value: "archive", label: "Archivé" },
];

const VILLES: FilterOption[] = [
  { value: "paris", label: "Paris" },
  { value: "lyon", label: "Lyon" },
  { value: "marseille", label: "Marseille" },
  { value: "bordeaux", label: "Bordeaux" },
  { value: "nice", label: "Nice" },
  { value: "toulouse", label: "Toulouse" },
  { value: "nantes", label: "Nantes" },
  { value: "strasbourg", label: "Strasbourg" },
];

const meta: Meta<typeof SearchableFilterPillString> = {
  title: "Core/Filters/SearchableFilterPill",
  component: SearchableFilterPillString,
  decorators: [
    (Story) => (
      <div className="pb-64">
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Statut",
    options: STATUTS,
    selected: [],
    onToggle: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof SearchableFilterPillString>;

export const Default: Story = {};

export const WithSelections: Story = {
  args: {
    selected: ["actif", "prospect"],
  },
};

export const AllSelected: Story = {
  args: {
    selected: STATUTS.map(s => s.value),
  },
};

export const Searchable: Story = {
  args: {
    label: "Ville",
    options: VILLES,
    selected: ["paris"],
    searchable: true,
    searchPlaceholder: "Rechercher une ville...",
  },
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="pb-64 space-y-4">
        <SearchableFilterPill<string>
          label="Statut"
          options={STATUTS}
          selected={selected}
          onToggle={v => {
            setSelected(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]));
          }}
          onClear={() => {
            setSelected([]);
          }}
          onSelectAll={setSelected}
        />
        <p className="text-xs text-muted-foreground">
          {selected.length === 0 ? "Aucun statut sélectionné" : `Sélectionnés : ${selected.join(", ")}`}
        </p>
      </div>
    );
  },
};

export const MultiplePills: Story = {
  render: () => {
    const [statuts, setStatuts] = useState<string[]>([]);
    const [villes, setVilles] = useState<string[]>([]);
    return (
      <div className="pb-64 space-y-4">
        <div className="flex flex-wrap gap-2">
          <SearchableFilterPill<string>
            label="Statut"
            options={STATUTS}
            selected={statuts}
            onToggle={v => {
              setStatuts(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]));
            }}
            onClear={() => {
              setStatuts([]);
            }}
            onSelectAll={setStatuts}
          />
          <SearchableFilterPill<string>
            label="Ville"
            options={VILLES}
            selected={villes}
            onToggle={v => {
              setVilles(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]));
            }}
            onClear={() => {
              setVilles([]);
            }}
            onSelectAll={setVilles}
            searchable
            searchPlaceholder="Rechercher..."
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Statuts : {statuts.length === 0 ? "tous" : statuts.join(", ")} · Villes : {villes.length === 0 ? "toutes" : villes.join(", ")}
        </p>
      </div>
    );
  },
};
