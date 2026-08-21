import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TableFilter } from "@/components/core/filters/TableFilter";
import type { FilterSection } from "@/types/FilterSection";

const SECTIONS_CLIENTS: FilterSection[] = [
  {
    title: "Identité",
    filters: [
      {
        key: "statut",
        label: "Statut",
        type: "select",
        placeholder: "Tous les statuts",
        options: [
          { value: "actif", label: "Actif" },
          { value: "inactif", label: "Inactif" },
          { value: "prospect", label: "Prospect" },
          { value: "archive", label: "Archivé" },
        ],
        isQuickFilter: true,
      },
      {
        key: "villes",
        label: "Ville",
        type: "multi-select",
        placeholder: "Toutes les villes",
        options: [
          { value: "paris", label: "Paris" },
          { value: "lyon", label: "Lyon" },
          { value: "marseille", label: "Marseille" },
          { value: "bordeaux", label: "Bordeaux" },
          { value: "nice", label: "Nice" },
          { value: "toulouse", label: "Toulouse" },
        ],
        isQuickFilter: true,
        searchable: true,
        searchPlaceholder: "Rechercher une ville...",
      },
      {
        key: "nom",
        label: "Nom",
        type: "text",
        placeholder: "Rechercher par nom...",
      },
    ],
  },
  {
    title: "Financier",
    filters: [
      {
        key: "budgetMin",
        label: "Budget minimum",
        type: "number",
        placeholder: "0",
        min: 0,
      },
      {
        key: "budgetMax",
        label: "Budget maximum",
        type: "number",
        placeholder: "1 000 000",
      },
    ],
  },
  {
    title: "Dates",
    filters: [
      {
        key: "dateCreation",
        label: "Créé depuis le",
        type: "date",
        placeholder: "Sélectionner une date",
      },
    ],
  },
];

const meta: Meta<typeof TableFilter> = {
  title: "Core/Filters/TableFilter",
  component: TableFilter,
  decorators: [
    Story => (
      <div className="w-full p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    filters: {},
    onFiltersChange: () => {},
    sections: SECTIONS_CLIENTS,
  },
};

export default meta;
type Story = StoryObj<typeof TableFilter>;

export const SearchOnly: Story = {
  args: {
    sections: [],
    searchQuery: "",
    onSearchChange: () => {},
    searchPlaceholder: "Rechercher un client...",
  },
};

export const WithQuickFilters: Story = {
  args: {
    searchQuery: "",
    onSearchChange: () => {},
    searchPlaceholder: "Rechercher...",
    sections: [
      {
        title: "Statut",
        filters: [
          {
            key: "statut",
            label: "Statut",
            type: "multi-select",
            placeholder: "Tous",
            options: [
              { value: "actif", label: "Actif" },
              { value: "inactif", label: "Inactif" },
              { value: "prospect", label: "Prospect" },
            ],
            isQuickFilter: true,
          },
          {
            key: "villes",
            label: "Ville",
            type: "multi-select",
            placeholder: "Toutes",
            options: [
              { value: "paris", label: "Paris" },
              { value: "lyon", label: "Lyon" },
              { value: "marseille", label: "Marseille" },
            ],
            isQuickFilter: true,
          },
        ],
      },
    ],
  },
};

export const WithActiveFilters: Story = {
  args: {
    sections: SECTIONS_CLIENTS,
    searchQuery: "dupont",
    onSearchChange: () => {},
    filters: {
      statut: ["actif", "prospect"],
      villes: ["paris"],
      budgetMax: "400000",
    },
  },
};

export const AdvancedOnly: Story = {
  args: {
    sections: SECTIONS_CLIENTS,
    advancedButtonText: "Filtres",
    sheetTitle: "Filtrer les clients",
  },
};

export const Interactive: Story = {
  render: () => {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<Record<string, unknown>>({});
    return (
      <div className="space-y-6">
        <TableFilter
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Rechercher un client..."
          filters={filters}
          onFiltersChange={setFilters}
          sections={SECTIONS_CLIENTS}
          advancedButtonText="Filtres avancés"
          sheetTitle="Filtrer les clients"
        />
        <div className="rounded border bg-muted p-3 text-xs">
          <p className="mb-1 font-medium">État courant :</p>
          <p className="mb-1">Recherche : {search.length > 0 ? `"${search}"` : "(vide)"}</p>
          <pre>{JSON.stringify(filters, null, 2)}</pre>
        </div>
      </div>
    );
  },
};
