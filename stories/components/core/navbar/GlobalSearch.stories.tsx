import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { FileTextIcon, LayoutDashboardIcon, PackageIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { GlobalSearch, GlobalSearchGroup, GlobalSearchItem, GlobalSearchProps } from "../../../../src/components/core/navbar/GlobalSearch";
import { Button } from "../../../../src/components/ui/button";

const meta: Meta<typeof GlobalSearch> = {
  title: "Core/Navbar/GlobalSearch",
  component: GlobalSearch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof GlobalSearch>;

const pages: GlobalSearchItem[] = [
  { key: "page-dashboard", label: "Tableau de bord", path: "/", icon: LayoutDashboardIcon },
  { key: "page-achats", label: "Achats", description: "Commerce", path: "/achats", icon: PackageIcon },
  { key: "page-clients", label: "Clients", description: "Commerce", path: "/clients", icon: UsersIcon },
  { key: "page-parametres", label: "Paramètres", path: "/parametres", icon: SettingsIcon },
];

const documents: GlobalSearchItem[] = [
  { key: "doc-1", label: "Facture 2024-018", description: "Acme Inc. — 1 250,00 €", path: "/factures/18", icon: FileTextIcon },
  { key: "doc-2", label: "Facture 2024-019", description: "Stark Industries — 890,00 €", path: "/factures/19", icon: FileTextIcon },
];

/** Filtrage insensible à la casse et aux accents, comme le ferait l'application en amont. */
const normalize = (value: string): string => value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const matches = (item: GlobalSearchItem, search: string): boolean =>
  normalize(item.label).includes(normalize(search)) || normalize(item.description ?? "").includes(normalize(search));

interface InteractiveProps extends Partial<GlobalSearchProps> {
  /** Simule un aller-retour serveur sur le groupe « Documents ». */
  simulateLoading?: boolean;
}

const InteractiveGlobalSearch = ({ simulateLoading = false, ...args }: InteractiveProps): React.ReactElement => {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<GlobalSearchItem | null>(null);

  const groups: GlobalSearchGroup[] = [
    { heading: "Pages", items: pages.filter(page => matches(page, search)) },
    { heading: "Documents", items: search.trim() === "" ? [] : documents.filter(document => matches(document, search)) },
  ];

  return (
    <div className="flex w-[28rem] flex-col items-center gap-4 rounded-surface border border-border bg-card p-6 text-card-foreground">
      <div className="flex w-full items-center justify-between">
        <span className="text-sm text-muted-foreground">Header de l&apos;application</span>
        <GlobalSearch {...args} groups={groups} search={search} onSearch={setSearch} onSelect={setSelected} loading={simulateLoading && search.trim() !== ""} />
      </div>

      <p className="text-sm text-muted-foreground">
        {selected === null ? "Ouvrez la palette (bouton ou ⌘K / Ctrl+K)." : `Sélection : ${selected.label} → ${selected.path ?? "—"}`}
      </p>
    </div>
  );
};

export const Default: Story = {
  render: args => <InteractiveGlobalSearch {...args} />,
};

export const Loading: Story = {
  render: args => <InteractiveGlobalSearch {...args} simulateLoading />,
};

export const WithoutShortcut: Story = {
  render: args => <InteractiveGlobalSearch {...args} />,
  args: {
    shortcut: false,
  },
};

/** L'application fournit son propre déclencheur et pilote l'ouverture. */
const ControlledGlobalSearch = (args: Partial<GlobalSearchProps>): React.ReactElement => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const groups: GlobalSearchGroup[] = [{ heading: "Pages", items: pages.filter(page => matches(page, search)) }];

  return (
    <div className="flex w-[28rem] flex-col items-center gap-4 rounded-surface border border-border bg-card p-6 text-card-foreground">
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Ouvrir la recherche
      </Button>

      <GlobalSearch
        {...args}
        trigger={false}
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        search={search}
        onSearch={setSearch}
        onSelect={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};

export const Controlled: Story = {
  render: args => <ControlledGlobalSearch {...args} />,
};

export const CustomLabels: Story = {
  render: args => <InteractiveGlobalSearch {...args} />,
  args: {
    placeholder: "Search a page or a document…",
    emptyLabel: "No result.",
    loadingLabel: "Searching…",
    triggerLabel: "Search",
    title: "Global search",
    description: "Search a page or a record across the app.",
  },
};
