import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TableFilter } from "@/components/core/filters/TableFilter";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Switch } from "@/components/ui";
import { radiusPresets, tokensToStyle } from "@/tokens";
import type { RadiusPreset } from "@/tokens";
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
  { value: "square", description: "Angles vifs — --k-radius-control: 0" },
  { value: "soft", description: "Défaut — --k-radius-control: 0.5rem" },
  { value: "round", description: "Capsules — --k-radius-control: 9999px" },
] as const satisfies readonly { value: RadiusPreset; description: string }[];

/** Une barre de filtres complète + quelques contrôles, sous un preset donné. */
const Echantillon = ({ radius, description }: { radius: RadiusPreset; description: string }): React.JSX.Element => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  return (
    <div style={tokensToStyle(radiusPresets[radius])} className="space-y-4">
      <div>
        <code className="text-sm font-semibold">radiusPresets.{radius}</code>
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
          Les conteneurs suivent <code>--k-radius-surface</code>, distinct de <code>--k-radius-control</code> : en preset
          <em> round</em>, les contrôles deviennent des capsules sans que les cartes ne s&apos;arrondissent à l&apos;excès.
        </CardContent>
      </Card>
    </div>
  );
};

const meta: Meta = {
  title: "Design Tokens/Radius",
  parameters: {
    docs: {
      description: {
        component:
          "Comparaison des trois presets de radius. Chaque bloc pose ses variables en `style` inline via `tokensToStyle` — en production, le thème du projet les définit une fois dans `:root`. " +
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
    <div className="space-y-4 p-4" style={tokensToStyle({ "--k-radius-control": "3px", "--k-radius-surface": "18px", "--radius": "4px" })}>
      <p className="text-xs text-muted-foreground">
        Aucun preset : les variables sont redéfinies directement (<code>--k-radius-control: 3px</code>, <code>--k-radius-surface: 18px</code>).
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
