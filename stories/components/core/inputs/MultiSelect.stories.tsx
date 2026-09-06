import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AppDialog } from "@/components/core/dialogs";
import { MultiSelect } from "@/components/core/inputs/MultiSelect";
import { Button } from "@/components/ui";

const VILLES = [
  { value: "paris", label: "Paris" },
  { value: "lyon", label: "Lyon" },
  { value: "marseille", label: "Marseille" },
  { value: "bordeaux", label: "Bordeaux" },
  { value: "nice", label: "Nice" },
  { value: "toulouse", label: "Toulouse" },
];

const NOMBREUSES_OPTIONS = [
  ...VILLES,
  { value: "nantes", label: "Nantes" },
  { value: "strasbourg", label: "Strasbourg" },
  { value: "montpellier", label: "Montpellier" },
  { value: "rennes", label: "Rennes" },
  { value: "lille", label: "Lille" },
  { value: "reims", label: "Reims" },
  { value: "saint-etienne", label: "Saint-Étienne" },
  { value: "toulon", label: "Toulon" },
  { value: "grenoble", label: "Grenoble" },
];

const STATUTS = [
  { value: "nouveau", label: "Nouveau", color: "#3b82f6" },
  { value: "disponible", label: "Disponible", color: "#22c55e" },
  { value: "indisponible", label: "Indisponible", color: "#ef4444" },
];

// Options avec vignette : la première sans image affiche le placeholder gris.
const PROJETS = [
  { value: "1", label: "Mantes-La-Ville", imageUrl: null },
  { value: "2", label: "Dardilly", imageUrl: "https://picsum.photos/seed/dardilly/80/56" },
  { value: "3", label: "PAU - TERRA COTTA", imageUrl: "https://picsum.photos/seed/pau/80/56" },
  { value: "4", label: "SAINT PIERRE D'IRUBE", imageUrl: "https://picsum.photos/seed/irube/80/56" },
  { value: "5", label: "Rozven", imageUrl: "https://picsum.photos/seed/rozven/80/56" },
];

// Villes annoncées mais pas encore ouvertes : visibles et grisées plutôt que masquées.
const VILLES_PARTIELLES = [
  { value: "paris", label: "Paris" },
  { value: "lyon", label: "Lyon" },
  { value: "marseille", label: "Marseille", disabled: true },
  { value: "bordeaux", label: "Bordeaux", disabled: true },
];

const meta: Meta<typeof MultiSelect> = {
  title: "Core/Inputs/MultiSelect",
  component: MultiSelect,
  decorators: [
    Story => (
      <div className="w-72 pb-72">
        <Story />
      </div>
    ),
  ],
  args: {
    options: VILLES,
    selected: [],
    onToggle: () => {},
    onClear: () => {},
    placeholder: "Sélectionner des villes",
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {};

// Vignette par option (`imageUrl`) dans la liste : image si URL, placeholder gris si `null`.
export const WithImages: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["2"]);
    return (
      <div className="w-72 pb-72 space-y-2">
        <MultiSelect
          searchable
          options={PROJETS}
          selected={selected}
          onToggle={val => {
            setSelected(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));
          }}
          onClear={() => {
            setSelected([]);
          }}
          placeholder="Sélectionner des projets"
          searchPlaceholder="Rechercher un projet..."
        />
        <p className="text-xs text-muted-foreground">La première option (sans image) affiche le placeholder « — ».</p>
      </div>
    );
  },
};

export const WithSelections: Story = {
  args: {
    selected: ["paris", "lyon"],
  },
};

export const Searchable: Story = {
  args: {
    searchable: true,
    searchPlaceholder: "Rechercher une ville...",
  },
};

export const AllSelected: Story = {
  args: {
    selected: VILLES.map(v => v.value),
  },
};

export const WithDisabledOptions: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="w-72 pb-72 space-y-2">
        <MultiSelect
          options={VILLES_PARTIELLES}
          selected={selected}
          onToggle={val => {
            setSelected(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));
          }}
          onSelectAll={setSelected}
          placeholder="Sélectionner des villes"
        />
        <p className="text-xs text-muted-foreground">
          {selected.length === 0 ? "Aucune sélection" : `Sélectionnés : ${selected.join(", ")}`}
        </p>
      </div>
    );
  },
};

// Une valeur imposée par le métier : sélectionnée, grisée, et conservée par « Tout désélectionner » et par le ×.
export const WithLockedSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["paris", "marseille"]);
    return (
      <div className="w-72 pb-72 space-y-2">
        <MultiSelect
          options={VILLES_PARTIELLES}
          selected={selected}
          onToggle={val => {
            setSelected(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));
          }}
          onSelectAll={setSelected}
          placeholder="Sélectionner des villes"
        />
        <p className="text-xs text-muted-foreground">Sélectionnés : {selected.join(", ")}</p>
      </div>
    );
  },
};

export const ManyOptions: Story = {
  args: {
    options: NOMBREUSES_OPTIONS,
    selected: ["paris", "nantes", "lille"],
    searchable: true,
    searchPlaceholder: "Rechercher une ville...",
  },
};

export const WithClearIcon: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["paris", "lyon", "nice"]);
    return (
      <div className="w-72 pb-72 space-y-2">
        <MultiSelect
          options={VILLES}
          selected={selected}
          onToggle={val => {
            setSelected(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));
          }}
          onClear={() => {
            setSelected([]);
          }}
          placeholder="Sélectionner des villes"
        />
        <p className="text-xs text-muted-foreground">{selected.length === 0 ? "Sélection vidée via le ×" : `Sélectionnés : ${selected.join(", ")}`}</p>
      </div>
    );
  },
};

export const WithMaxCount: Story = {
  args: {
    options: NOMBREUSES_OPTIONS,
    selected: ["paris", "lyon", "marseille", "bordeaux", "nice"],
    maxCount: 2,
  },
};

// Les sélections s'affichent en pastilles retirables sous le contrôle (comme les filtres actifs).
export const WithChips: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["paris", "lyon", "nice"]);
    return (
      <div className="w-72 pb-72">
        <MultiSelect
          chips
          searchable
          options={NOMBREUSES_OPTIONS}
          selected={selected}
          onToggle={val => {
            setSelected(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));
          }}
          onClear={() => {
            setSelected([]);
          }}
          onSelectAll={setSelected}
          placeholder="Sélectionner des villes"
          searchPlaceholder="Rechercher une ville..."
        />
      </div>
    );
  },
};

// Au-delà de ~40 options, seule la fenêtre visible est montée (le reste est simulé par des cales) :
// l'ouverture reste rapide même avec des centaines d'entrées. Scroll et recherche restent fluides.
const BEAUCOUP_D_OPTIONS = Array.from({ length: 400 }, (_, i) => ({ value: `opt-${String(i)}`, label: `Option ${String(i + 1)}` }));

export const Virtualized: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="w-72 pb-72">
        <MultiSelect
          chips
          searchable
          options={BEAUCOUP_D_OPTIONS}
          selected={selected}
          onToggle={val => {
            setSelected(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));
          }}
          onClear={() => {
            setSelected([]);
          }}
          onSelectAll={setSelected}
          placeholder="400 options"
          searchPlaceholder="Rechercher..."
        />
      </div>
    );
  },
};

export const WithColors: Story = {
  args: {
    options: STATUTS,
    selected: ["disponible"],
    placeholder: "Sélectionner des statuts",
  },
};

export const WithColorsInteractive: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (val: string): void => {
      setSelected(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));
    };
    return (
      <div className="w-72 pb-72 space-y-2">
        <MultiSelect
          options={STATUTS}
          selected={selected}
          onToggle={toggle}
          onClear={() => {
            setSelected([]);
          }}
          placeholder="Sélectionner des statuts"
        />
        <p className="text-xs text-muted-foreground">{selected.length === 0 ? "Aucune sélection" : `Sélectionnés : ${selected.join(", ")}`}</p>
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (val: string): void => {
      setSelected(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));
    };
    return (
      <div className="w-72 pb-72 space-y-2">
        <MultiSelect
          options={VILLES}
          selected={selected}
          onToggle={toggle}
          onClear={() => {
            setSelected([]);
          }}
          onSelectAll={setSelected}
          searchable
          searchPlaceholder="Rechercher une ville..."
          placeholder="Sélectionner des villes"
        />
        <p className="text-xs text-muted-foreground">{selected.length === 0 ? "Aucune sélection" : `Sélectionnés : ${selected.join(", ")}`}</p>
      </div>
    );
  },
};

export const WithoutOptions: Story = {
  args: {
    options: [],
    placeholder: "Aucune option disponible",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    selected: ["paris", "lyon"],
    disabled: true,
  },
};

// Le panneau est porté dans un portail : il déborde de la boîte de dialogue au lieu d'être
// rogné par sa zone scrollable, contrairement à un panneau positionné en absolu.
export const InDialog: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="w-72">
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Ouvrir la boîte de dialogue
        </Button>
        <AppDialog
          open={isOpen}
          onOpenChange={() => {
            setIsOpen(false);
          }}
          config={{
            title: "Sélectionner des villes",
            description: "Le panneau doit s'afficher en entier par-dessus la boîte de dialogue, et sa liste doit rester scrollable à la molette (grâce au mode modal).",
            actions: [
              {
                label: "Fermer",
                variant: "outline",
                onClick: () => {
                  setIsOpen(false);
                },
              },
            ],
          }}
        >
          <MultiSelect
            options={NOMBREUSES_OPTIONS}
            selected={selected}
            onToggle={val => {
              setSelected(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));
            }}
            onClear={() => {
              setSelected([]);
            }}
            onSelectAll={setSelected}
            searchable
            searchPlaceholder="Rechercher une ville..."
            placeholder="Sélectionner des villes"
          />
        </AppDialog>
      </div>
    );
  },
};

// --- Variant "pill" : pastille de filtre (libellé fixe + badge compteur) ---

export const Pill: Story = {
  args: {
    variant: "pill",
    labelKey: "Statut",
    options: STATUTS,
    selected: ["disponible"],
  },
};

export const PillInteractive: Story = {
  render: () => {
    const [statuts, setStatuts] = useState<string[]>([]);
    const [villes, setVilles] = useState<string[]>([]);
    return (
      <div className="pb-72 space-y-4">
        <div className="flex flex-wrap gap-2">
          <MultiSelect
            variant="pill"
            labelKey="Statut"
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
          <MultiSelect
            variant="pill"
            labelKey="Ville"
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

// --- Variant "filter" : l'apparence de "input", la largeur d'une barre de filtres ---

export const Filter: Story = {
  args: {
    variant: "filter",
    options: STATUTS,
    selected: ["disponible"],
    placeholder: "Statut",
  },
};

/**
 * Le même contrôle dans les deux variants, posé dans la barre en `flex-wrap` où il finira.
 * `input` y hérite du `w-full` du trigger et occupe la ligne entière ; `filter` tient sa
 * largeur et laisse la place aux filtres suivants.
 */
export const FilterVsInput: Story = {
  render: () => (
    <div className="space-y-6 pb-72">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">{`variant="filter"`}</p>
        <div className="flex flex-wrap gap-2">
          <MultiSelect variant="filter" options={STATUTS} selected={[]} onToggle={() => undefined} placeholder="Statut" />
          <MultiSelect variant="filter" options={VILLES} selected={[]} onToggle={() => undefined} placeholder="Ville" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">{`variant="input"`}</p>
        <div className="flex flex-wrap gap-2">
          <MultiSelect options={STATUTS} selected={[]} onToggle={() => undefined} placeholder="Statut" />
          <MultiSelect options={VILLES} selected={[]} onToggle={() => undefined} placeholder="Ville" />
        </div>
      </div>
    </div>
  ),
};
