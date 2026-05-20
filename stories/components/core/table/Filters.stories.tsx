import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableFilter } from "@/components/core/filters";

const meta: Meta<typeof TableFilter> = {
  title: "Core/Filters/TableFilter",
  component: TableFilter,
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof TableFilter> = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({
      role: [],
    });

    const sections = [
      {
        title: "Détails de l'utilisateur",
        filters: [
          {
            key: "role",
            label: "Rôle",
            type: "multi-select" as const,
            isQuickFilter: true,
            searchable: true,
            searchPlaceholder: "Filtrer les rôles...",
            placeholder: "Sélectionner des rôles",
            options: [
              { value: "admin", label: "Administrateur" },
              { value: "user", label: "Utilisateur" },
              { value: "guest", label: "Invité" },
            ],
          },
          {
            key: "status",
            label: "Statut",
            type: "select" as const,
            placeholder: "Sélectionner un statut",
            options: [
              { value: "active", label: "Actif" },
              { value: "inactive", label: "Inactif" },
            ],
          },
        ],
      },
      {
        title: "Budget",
        filters: [
          {
            key: "budget",
            label: "Budget Max",
            type: "number" as const,
            placeholder: "Entrer le budget...",
            min: 0,
          },
        ],
      },
    ];

    return (
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-medium mb-4">Composant de filtrage unifié (TableFilter)</h3>

        <TableFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Rechercher des éléments..."
          filters={appliedFilters}
          onFiltersChange={setAppliedFilters}
          sections={sections}
          advancedButtonText="Plus de filtres"
        />

        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-900 rounded-md">
          <h4 className="text-sm font-semibold mb-2">État des filtres appliqués :</h4>
          <pre className="text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 p-3 rounded border">
            {JSON.stringify({ searchQuery, ...appliedFilters }, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};
