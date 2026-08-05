import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TableFilter } from "@/components/core/filters/TableFilter";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Switch } from "@/components/ui";
import type { FilterSection } from "@/types/FilterSection";

const SECTIONS: FilterSection[] = [
  {
    title: "Identité",
    filters: [
      {
        key: "statut",
        label: "Statut",
        type: "multi-select",
        placeholder: "Tous les statuts",
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
        placeholder: "Toutes les villes",
        options: [
          { value: "paris", label: "Paris" },
          { value: "lyon", label: "Lyon" },
          { value: "marseille", label: "Marseille" },
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
];

const PRESETS = [
  { value: "square", label: "square", description: "Angles vifs — --radius-control: 0" },
  { value: "soft", label: "soft", description: "Défaut — --radius-control: 0.5rem" },
  { value: "round", label: "round", description: "Capsules — --radius-control: 9999px" },
] as const;

/** Une barre de filtres complète + quelques contrôles, sous un preset donné. */
const Echantillon = ({ radius, description }: { radius: string; description: string }): React.JSX.Element => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  return (
    <div data-radius={radius} className="space-y-4">
      <div>
        <code className="text-sm font-semibold">data-radius=&quot;{radius}&quot;</code>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <TableFilter
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher un client (nom, email...)"
        filters={filters}
        onFiltersChange={setFilters}
        sections={SECTIONS}
        advancedButtonText="Filtres avancés"
        sheetTitle="Filtrer les clients"
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button>Enregistrer</Button>
        <Button variant="outline">Annuler</Button>
        <Input placeholder="Champ libre" className="w-48" />
        <Badge>Actif</Badge>
        <Badge variant="secondary">Prospect</Badge>
        <Switch />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Surface</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Les conteneurs suivent <code>--radius-surface</code>, distinct de <code>--radius-control</code> : en preset
          <em> round</em>, les contrôles deviennent des capsules sans que les cartes ne s&apos;arrondissent à l&apos;excès.
        </CardContent>
      </Card>
    </div>
  );
};

const meta: Meta = {
  title: "Démos/Radius",
  parameters: {
    docs: {
      description: {
        component:
          "Comparaison des trois presets de radius. Chaque bloc porte son propre `data-radius` — en production, l'attribut se pose une seule fois sur `<html>`. " +
          "Note : les contenus rendus en portail (popovers, sheets, dialogs) héritent de la racine du document, pas du bloc — le sélecteur « Radius » de la barre d'outils les couvre.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Comparaison: Story = {
  render: () => (
    <div className="space-y-10 p-4">
      {PRESETS.map(preset => (
        <Echantillon key={preset.value} radius={preset.value} description={preset.description} />
      ))}
    </div>
  ),
};

export const ValeursPersonnalisees: Story = {
  name: "Valeurs personnalisées",
  render: () => (
    <div
      className="space-y-4 p-4"
      style={{ "--radius-control": "3px", "--radius-surface": "18px", "--radius": "4px" } as React.CSSProperties}
    >
      <p className="text-xs text-muted-foreground">
        Aucun preset : les variables sont redéfinies directement (<code>--radius-control: 3px</code>,{" "}
        <code>--radius-surface: 18px</code>).
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button>Enregistrer</Button>
        <Button variant="outline">Annuler</Button>
        <Input placeholder="Champ libre" className="w-48" />
        <Badge>Actif</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Surface</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Radius de conteneur à 18px.</CardContent>
      </Card>
    </div>
  ),
};
