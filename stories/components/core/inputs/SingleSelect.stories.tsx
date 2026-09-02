import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AppDialog } from "@/components/core/dialogs";
import { SingleSelect } from "@/components/core/inputs/SingleSelect";
import { Button } from "@/components/ui";

const PAYS = [
  { value: "fr", label: "France" },
  { value: "be", label: "Belgique" },
  { value: "ch", label: "Suisse" },
  { value: "lu", label: "Luxembourg" },
  { value: "de", label: "Allemagne" },
  { value: "es", label: "Espagne" },
  { value: "it", label: "Italie" },
  { value: "pt", label: "Portugal" },
  { value: "nl", label: "Pays-Bas" },
  { value: "gb", label: "Royaume-Uni" },
];

const STATUTS = [
  { value: "nouveau", label: "Nouveau", color: "#3b82f6" },
  { value: "disponible", label: "Disponible", color: "#22c55e" },
  { value: "indisponible", label: "Indisponible", color: "#ef4444" },
];

const TENANTS = [
  { value: "1", label: "Demo TDS", description: "Démonstrations" },
  { value: "2", label: "Boulanger", description: "Retail" },
  { value: "3", label: "NLMK Belgium Holdings", description: "Industrie" },
  { value: "4", label: "Sage Template", description: "Modèles" },
];

// Options annoncées mais pas encore livrées : visibles et grisées plutôt que masquées.
const DECLENCHEURS = [
  { value: "cron", label: "Planification" },
  { value: "fileWatcher", label: "Surveillance de fichiers", disabled: true },
  { value: "webHook", label: "WebHook", disabled: true },
  { value: "emailReceived", label: "Réception d'e-mail", disabled: true },
];

const meta: Meta<typeof SingleSelect> = {
  title: "Core/Inputs/SingleSelect",
  component: SingleSelect,
  decorators: [
    Story => (
      <div className="w-64 pb-72">
        <Story />
      </div>
    ),
  ],
  args: {
    options: PAYS,
    value: undefined,
    onChange: () => {},
    searchable: true,
    placeholder: "Sélectionner un pays",
  },
};

export default meta;
type Story = StoryObj<typeof SingleSelect>;

// Mode simple (Radix Select, sans recherche)
export const Simple: Story = {
  args: {
    searchable: false,
    options: STATUTS,
    value: "disponible",
    placeholder: "Sélectionner un statut",
  },
};

export const Default: Story = {};

export const WithoutOptions: Story = {
  args: {
    options: undefined,
    placeholder: "Aucune option disponible",
  },
};

export const WithValue: Story = {
  args: {
    value: "fr",
  },
};

export const WithClear: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>("fr");
    return (
      <div className="w-64 pb-72 space-y-2">
        <SingleSelect searchable options={PAYS} value={value} onChange={setValue} onClear={() => { setValue(undefined); }} placeholder="Sélectionner un pays" />
        <p className="text-xs text-muted-foreground">
          {value !== undefined ? `Sélectionné : ${PAYS.find(p => p.value === value)?.label}` : "Aucune sélection"}
        </p>
      </div>
    );
  },
};

export const CustomPlaceholders: Story = {
  args: {
    placeholder: "Choisir un pays...",
    searchPlaceholder: "Taper pour filtrer...",
  },
};

export const ManyOptions: Story = {
  args: {
    options: [
      ...PAYS,
      { value: "pl", label: "Pologne" },
      { value: "ro", label: "Roumanie" },
      { value: "cz", label: "République Tchèque" },
      { value: "at", label: "Autriche" },
      { value: "se", label: "Suède" },
      { value: "dk", label: "Danemark" },
      { value: "fi", label: "Finlande" },
    ],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    value: "fr",
    disabled: true,
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: DECLENCHEURS,
    placeholder: "Sélectionner un déclencheur",
  },
};

export const SimpleWithDisabledOptions: Story = {
  args: {
    searchable: false,
    options: DECLENCHEURS,
    placeholder: "Sélectionner un déclencheur",
  },
};

export const WithColors: Story = {
  args: {
    options: STATUTS,
    value: "disponible",
    placeholder: "Sélectionner un statut",
  },
};

export const WithColorsInteractive: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div className="w-64 pb-72 space-y-2">
        <SingleSelect searchable options={STATUTS} value={value} onChange={setValue} onClear={() => { setValue(undefined); }} placeholder="Sélectionner un statut" />
        <p className="text-xs text-muted-foreground">
          {value !== undefined ? `Sélectionné : ${STATUTS.find(s => s.value === value)?.label}` : "Aucune sélection"}
        </p>
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div className="w-64 pb-72 space-y-2">
        <SingleSelect searchable options={PAYS} value={value} onChange={setValue} onClear={() => { setValue(undefined); }} placeholder="Sélectionner un pays" />
        <p className="text-xs text-muted-foreground">
          {value !== undefined ? `Sélectionné : ${PAYS.find(p => p.value === value)?.label}` : "Aucune sélection"}
        </p>
      </div>
    );
  },
};

export const WithDescriptions: Story = {
  args: {
    options: TENANTS,
    value: "1",
    placeholder: "Sélectionner un tenant",
    searchPlaceholder: "Rechercher un tenant...",
    emptyLabel: "Aucun tenant trouvé.",
  },
};

export const Creatable: Story = {
  render: () => {
    const [groupes, setGroupes] = useState([
      { value: "agents", label: "Agents" },
      { value: "flux", label: "Flux" },
      { value: "tenants", label: "Tenants" },
    ]);
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div className="w-64 pb-72 space-y-2">
        <SingleSelect
          searchable
          options={groupes}
          value={value}
          onChange={setValue}
          onClear={() => {
            setValue(undefined);
          }}
          onCreate={label => {
            setGroupes(prev => [...prev, { value: label, label }]);
            setValue(label);
          }}
          placeholder="Agents, Flux, Tenants..."
          searchPlaceholder="Rechercher ou créer..."
          emptyLabel="Aucun groupe."
        />
        <p className="text-xs text-muted-foreground">Taper un libellé absent de la liste propose de le créer.</p>
      </div>
    );
  },
};

// Le panneau est porté dans un portail : il déborde de la boîte de dialogue au lieu d'être
// rogné par sa zone scrollable, contrairement à un panneau positionné en absolu.
export const InDialog: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div className="w-64">
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
            title: "Rattacher à un tenant",
            description: "Le panneau de recherche doit s'afficher en entier, par-dessus la boîte de dialogue.",
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
          <SingleSelect
            searchable
            options={TENANTS}
            value={value}
            onChange={setValue}
            placeholder="Sélectionner un tenant"
            searchPlaceholder="Rechercher un tenant..."
          />
        </AppDialog>
      </div>
    );
  },
};

// --- Variant "filter" : l'apparence de "input", la largeur d'une barre de filtres ---

export const Filter: Story = {
  args: {
    variant: "filter",
    options: STATUTS,
    value: undefined,
    placeholder: "Statut",
  },
};

/**
 * Le meme controle dans les deux variants, pose dans la barre en `flex-wrap` ou il finira.
 * `input` y herite du `w-full` du trigger et occupe la ligne entiere ; `filter` tient sa
 * largeur et laisse la place aux filtres suivants. Les deux modes de rendu (simple et
 * `searchable`) se dimensionnent de la meme facon.
 */
export const FilterVsInput: Story = {
  render: () => (
    <div className="space-y-6 pb-72">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">{`variant="filter"`}</p>
        <div className="flex flex-wrap gap-2">
          <SingleSelect variant="filter" options={STATUTS} value={undefined} onChange={() => undefined} placeholder="Statut" />
          <SingleSelect variant="filter" searchable options={PAYS} value={undefined} onChange={() => undefined} placeholder="Pays" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">{`variant="input"`}</p>
        <div className="flex flex-wrap gap-2">
          <SingleSelect options={STATUTS} value={undefined} onChange={() => undefined} placeholder="Statut" />
          <SingleSelect searchable options={PAYS} value={undefined} onChange={() => undefined} placeholder="Pays" />
        </div>
      </div>
    </div>
  ),
};
