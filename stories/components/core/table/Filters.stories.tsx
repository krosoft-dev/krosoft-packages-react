import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableFilter } from "@/components/core/filters";
import type { FilterSection } from "@/types";

const meta: Meta<typeof TableFilter> = {
  title: "Core/Filters/TableFilter",
  component: TableFilter,
  parameters: {
    docs: {
      description: {
        component: `
Le composant \`TableFilter\` est une solution de filtrage unifiée et prête à l'emploi.
Il regroupe une **barre de recherche textuelle**, des **filtres rapides** sous forme de pastilles interactives,
un **panneau latéral** (\`Sheet\`) pour les filtres avancés, et un bandeau de **filtres actifs** avec suppression individuelle ou globale.

---

### Architecture interne

Le composant \`TableFilter\` orchestre les sous-composants suivants :

| Composant | Rôle |
|---|---|
| \`SearchInput\` | Barre de recherche textuelle avec icône et bouton d'effacement. |
| \`MultiSelect variant="pill"\` | Pastille de filtre rapide (multi-sélection avec cases à cocher, recherche, et "Tout sélectionner"). |
| \`AdvancedFilters\` | Panneau latéral (\`Sheet\`) affichant tous les filtres regroupés par section. |
| \`FilterField\` | Rendu conditionnel du champ de filtre selon son type (\`text\`, \`number\`, \`select\`, \`multi-select\`, \`date\`). |
| \`SingleSelect\` | Select à choix unique (simple ou, via \`searchable\`, avec barre de recherche et coche visuelle). |
| \`MultiSelect\` | Menu déroulant à choix multiples avec cases à cocher, recherche, "Tout sélectionner" et "Tout désélectionner". |
| \`DatePicker\` | Sélecteur de date avec calendrier localisé (français). |
| \`ActiveFilters\` | Bandeau affichant les filtres actifs sous forme de badges supprimables, avec un bouton "Effacer tout". |

### Paramètre Générique \`T\`
Le composant \`TableFilter\`, ainsi que \`FilterSection\` et \`FilterFieldConfig\`, acceptent désormais un paramètre générique \`T\` représentant l'interface typée de vos filtres (héritant de \`Record<string, unknown>\`).
Cela garantit que la propriété \`key\` de chaque configuration de filtre correspond bien à une clé valide de votre modèle de filtres.

---

### Propriétés de configuration des filtres (\`FilterFieldConfig\`)

Chaque filtre est configuré à l'aide d'un objet possédant les propriétés suivantes :

- **\`key\`** (\`keyof T\`, requis) : Clé unique correspondant à la propriété à filtrer dans vos données.
- **\`label\`** (\`string\`, requis) : Titre textuel affiché pour le filtre.
- **\`type\`** (\`"text" | "number" | "select" | "multi-select" | "date"\`, requis) :
  - \`"text"\` : Un champ de texte standard.
  - \`"number"\` : Un champ numérique (supporte les propriétés optionnelles \`min\` et \`max\`).
  - \`"select"\` : Un menu déroulant à choix unique. Si \`searchable: true\`, affiche un champ de recherche intégré dans le dropdown.
  - \`"multi-select"\` : Un menu déroulant à choix multiples avec cases à cocher et option "Tout sélectionner".
  - \`"date"\` : Un sélecteur de date avec calendrier localisé en français.
- **\`placeholder\`** (\`string\`, optionnel) : Texte d'aide affiché lorsque le champ est vide.
- **\`options\`** (\`Array<{ value: string; label: string }>\`, requis pour \`select\` et \`multi-select\`) : Les choix possibles.
- **\`isQuickFilter\`** (\`boolean\`, optionnel) : Si \`true\`, le filtre s'affichera également sous forme de pastille rapide dans la barre d'outils, tout en conservant sa place dans sa catégorie dans le volet avancé. Fonctionne uniquement avec le type \`multi-select\`.
- **\`searchable\`** (\`boolean\`, optionnel) : Active la recherche interne dans le dropdown. Fonctionne pour les types \`select\` et \`multi-select\`.
- **\`searchPlaceholder\`** (\`string\`, optionnel) : Placeholder du champ de recherche interne.
- **\`min\`** / **\`max\`** (\`number\`, optionnel) : Bornes pour le type \`number\`.

---

### Fonctionnalités clés

- 🔍 **Recherche textuelle** : Barre de recherche globale optionnelle.
- 🏷️ **Filtres rapides** : Pastilles avec compteur de sélections, "Tout sélectionner" et recherche interne.
- ⚙️ **Filtres avancés** : Panneau latéral avec les filtres regroupés en sections logiques.
- 🏅 **Filtres actifs** : Bandeau de badges individuellement supprimables. Un badge par valeur pour les multi-sélections. Bouton "Effacer tout" visible dès qu'un filtre est actif.
- ✅ **Tout sélectionner** : Disponible dans les pastilles rapides et dans les multi-sélections du panneau avancé.
- 🔎 **Recherche dans les sélections** : Recherche interne pour les types \`select\` (avec \`searchable: true\`) et \`multi-select\`.
        `,
      },
    },
  },
};

export default meta;

interface UserFilters extends Record<string, unknown> {
  name: string;
  role: string[];
  status: string;
  lastLogin: Date | undefined;
  budget: string;
}

const TableFilterStoryWrapper = (): React.ReactElement => {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<UserFilters>({
    role: [],
    name: "",
    status: "",
    lastLogin: undefined,
    budget: "",
  });

  const sections: FilterSection<UserFilters>[] = [
    {
      titleKey: "Détails de l'utilisateur",
      filters: [
        {
          key: "name",
          labelKey: "Nom complet",
          type: "text" as const,
          placeholder: "Ex: Jean Dupont...",
        },
        {
          key: "role",
          labelKey: "Rôle",
          type: "multi-select" as const,
          isQuickFilter: true,
          searchable: true,
          searchPlaceholder: "Filtrer les rôles...",
          placeholder: "Sélectionner des rôles",
          options: [
            { value: "admin", label: "Administrateur" },
            { value: "user", label: "Utilisateur" },
            { value: "guest", label: "Invité" },
            { value: "moderator", label: "Modérateur" },
            { value: "editor", label: "Éditeur" },
          ],
        },
        {
          key: "status",
          labelKey: "Statut",
          type: "select" as const,
          searchable: true,
          searchPlaceholder: "Rechercher un statut...",
          placeholder: "Sélectionner un statut",
          options: [
            { value: "active", label: "Actif" },
            { value: "inactive", label: "Inactif" },
            { value: "pending", label: "En attente" },
            { value: "archived", label: "Archivé" },
            { value: "banned", label: "Banni" },
          ],
        },
      ],
    },
    {
      titleKey: "Paramètres temporels et budget",
      filters: [
        {
          key: "lastLogin",
          labelKey: "Dernière connexion",
          type: "date" as const,
          placeholder: "Choisir une date",
        },
        {
          key: "budget",
          labelKey: "Budget Max",
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

      <TableFilter<UserFilters>
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
};

export const Default: StoryObj<typeof TableFilter> = {
  render: () => <TableFilterStoryWrapper />,
};
