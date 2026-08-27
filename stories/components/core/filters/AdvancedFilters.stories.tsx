import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AdvancedFilters } from "@/components/core/filters/AdvancedFilters";
import type { FilterSection } from "@/types/FilterSection";

const SECTIONS_SIMPLES: FilterSection[] = [
  {
    titleKey: "Identification",
    filters: [
      {
        key: "nom",
        labelKey: "Nom",
        type: "text",
        placeholder: "Rechercher par nom...",
      },
      {
        key: "statut",
        labelKey: "Statut",
        type: "select",
        placeholder: "Tous les statuts",
        options: [
          { value: "actif", label: "Actif" },
          { value: "inactif", label: "Inactif" },
          { value: "prospect", label: "Prospect" },
        ],
      },
      {
        key: "villes",
        labelKey: "Villes",
        type: "multi-select",
        placeholder: "Toutes les villes",
        options: [
          { value: "paris", label: "Paris" },
          { value: "lyon", label: "Lyon" },
          { value: "marseille", label: "Marseille" },
          { value: "bordeaux", label: "Bordeaux" },
        ],
      },
    ],
  },
];

const SECTIONS_COMPLETES: FilterSection[] = [
  {
    titleKey: "Identité",
    filters: [
      {
        key: "nom",
        labelKey: "Nom",
        type: "text",
        placeholder: "Rechercher...",
      },
      {
        key: "statut",
        labelKey: "Statut",
        type: "select",
        placeholder: "Tous les statuts",
        options: [
          { value: "actif", label: "Actif" },
          { value: "inactif", label: "Inactif" },
          { value: "prospect", label: "Prospect" },
        ],
      },
    ],
  },
  {
    titleKey: "Localisation",
    filters: [
      {
        key: "villes",
        labelKey: "Villes",
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
        searchable: true,
        searchPlaceholder: "Rechercher une ville...",
      },
    ],
  },
  {
    titleKey: "Financier",
    filters: [
      {
        key: "budgetMin",
        labelKey: "Budget minimum",
        type: "number",
        placeholder: "0",
        min: 0,
      },
      {
        key: "budgetMax",
        labelKey: "Budget maximum",
        type: "number",
        placeholder: "500 000",
      },
      {
        key: "dateCreation",
        labelKey: "Créé depuis le",
        type: "date",
        placeholder: "Sélectionner une date",
      },
      {
        key: "periodeMission",
        labelKey: "Période de mission",
        type: "date-range",
        placeholder: "Sélectionner une période",
      },
    ],
  },
];

const meta: Meta<typeof AdvancedFilters> = {
  title: "Core/Filters/AdvancedFilters",
  component: AdvancedFilters,
  args: {
    sections: SECTIONS_SIMPLES,
    filters: {},
    onFiltersChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof AdvancedFilters>;

export const Default: Story = {};

export const WithDateRange: Story = {
  args: {
    sections: [
      {
        titleKey: "Dates",
        filters: [
          {
            key: "dateCreation",
            labelKey: "Date de création",
            type: "date",
            placeholder: "Sélectionner une date",
          },
          {
            key: "periodeMission",
            labelKey: "Période de mission",
            type: "date-range",
            placeholder: "Sélectionner une période",
          },
        ],
      },
    ],
    buttonText: "Filtres de dates",
    sheetTitle: "Filtrer par dates",
  },
};

export const MultipleSections: Story = {
  args: {
    sections: SECTIONS_COMPLETES,
    buttonText: "Filtres avancés",
    sheetTitle: "Filtrer les clients",
  },
};

export const WithPrefilledFilters: Story = {
  args: {
    sections: SECTIONS_COMPLETES,
    filters: {
      statut: "actif",
      villes: ["paris", "lyon"],
      budgetMax: "400000",
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [filters, setFilters] = useState<Record<string, unknown>>({});
    return (
      <div className="space-y-4">
        <AdvancedFilters
          sections={SECTIONS_COMPLETES}
          filters={filters}
          onFiltersChange={setFilters}
          buttonText="Ouvrir les filtres"
          sheetTitle="Filtrer les résultats"
        />
        <pre className="rounded bg-muted p-3 text-xs">{JSON.stringify(filters, null, 2)}</pre>
      </div>
    );
  },
};
