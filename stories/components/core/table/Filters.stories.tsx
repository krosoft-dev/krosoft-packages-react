import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableFilter } from "@/components/core/filters";

const meta: Meta<typeof TableFilter> = {
  title: "Core/Filters/TableFilter",
  component: TableFilter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Le composant \`TableFilter\` est une solution de filtrage unifiée et prête à l'emploi. Il regroupe une barre de recherche textuelle, des filtres rapides sous forme de pastilles et un panneau latéral (\`Sheet\`) pour les filtres avancés.

### Propriétés de configuration des filtres (\`FilterFieldConfig\`)

Chaque filtre est configuré à l'aide d'un objet possédant les propriétés suivantes :

- **\`key\`** (\`string\`, requis) : Clé unique correspondant à la propriété à filtrer dans vos données.
- **\`label\`** (\`string\`, requis) : Titre textuel affiché pour le filtre.
- **\`type\`** (\`"text" | "number" | "select" | "multi-select" | "date"\`, requis) :
  - \`"text"\` : Un champ de texte standard.
  - \`"number"\` : Un champ numérique (supporte les propriétés optionnelles \`min\` et \`max\`).
  - \`"select"\` : Un menu déroulant classique à choix unique.
  - \`"multi-select"\` : Un menu déroulant à choix multiples avec recherche (\`searchable: true\`) et cases à cocher.
  - \`"date"\` : Un sélecteur de date avec calendrier localisé.
- **\`placeholder\`** (\`string\`, optionnel) : Texte d'aide affiché lorsque le champ est vide.
- **\`options\`** (\`Array<{ value: string; label: string }>\`, requis pour \`select\` et \`multi-select\`) : Les choix possibles.
- **\`isQuickFilter\`** (\`boolean\`, optionnel) : Si \`true\`, le filtre s'affichera également sous forme de pastille rapide dans la barre d'outils, tout en conservant sa place dans sa catégorie dans le volet avancé.
- **\`searchable\`** (\`boolean\`, optionnel) : Active la recherche interne (uniquement pour le type \`multi-select\`).
- **\`searchPlaceholder\`** (\`string\`, optionnel) : Placeholder de la recherche interne du \`multi-select\`.
        `,
      },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof TableFilter> = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({
      role: [],
      name: "",
      status: "",
      lastLogin: undefined,
      budget: "",
    });

    const sections = [
      {
        title: "Détails de l'utilisateur",
        filters: [
          {
            key: "name",
            label: "Nom complet",
            type: "text" as const,
            placeholder: "Ex: Jean Dupont...",
          },
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
        title: "Paramètres temporels et budget",
        filters: [
          {
            key: "lastLogin",
            label: "Dernière connexion",
            type: "date" as const,
            placeholder: "Choisir une date",
          },
          {
            key: "budget",
            label: "Budget Max",
            type: "number" as const,
            placeholder: "Entrer le budget...",
            min: 0,
            max: 100000,
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
