import type { Meta, StoryObj } from "@storybook/react-vite";
import { BuildingIcon, EuroIcon, UsersIcon, ZapIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import { KpiCards } from "@/components/core/cards/KpiCards";
import { TableFilter } from "@/components/core/filters/TableFilter";
import { ColumnDef, DataTable } from "@/components/core/table/DataTable";
import { Badge } from "@/components/ui/badge";
import type { FilterSection } from "@/types/FilterSection";

// --- Modèle de données de démonstration -------------------------------------

type Statut = "actif" | "inactif" | "prospect" | "archive";
type Secteur = "tech" | "finance" | "sante" | "industrie" | "retail";

interface Client {
  id: string;
  nom: string;
  email: string;
  statut: Statut;
  ville: string;
  secteur: Secteur;
  budget: number;
  dateCreation: string; // ISO
}

const VILLES = ["paris", "lyon", "marseille", "bordeaux", "nice", "toulouse"] as const;
const STATUTS: Statut[] = ["actif", "inactif", "prospect", "archive"];
const SECTEURS: Secteur[] = ["tech", "finance", "sante", "industrie", "retail"];

const VILLE_LABELS: Record<string, string> = {
  paris: "Paris",
  lyon: "Lyon",
  marseille: "Marseille",
  bordeaux: "Bordeaux",
  nice: "Nice",
  toulouse: "Toulouse",
};

const STATUT_LABELS: Record<Statut, string> = {
  actif: "Actif",
  inactif: "Inactif",
  prospect: "Prospect",
  archive: "Archivé",
};

const SECTEUR_LABELS: Record<Secteur, string> = {
  tech: "Tech",
  finance: "Finance",
  sante: "Santé",
  industrie: "Industrie",
  retail: "Retail",
};

const STATUT_VARIANTS: Record<Statut, "default" | "secondary" | "destructive" | "outline"> = {
  actif: "default",
  inactif: "secondary",
  prospect: "outline",
  archive: "destructive",
};

const PRENOMS = ["Dupont", "Martin", "Bernard", "Petit", "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Michel"];

// Jeu de données déterministe (pas de Math.random pour rester stable en Storybook)
const CLIENTS: Client[] = Array.from({ length: 48 }, (_, index) => {
  const id = (index + 1).toString();
  const nom = `${PRENOMS[index % PRENOMS.length]} ${String.fromCharCode(65 + (index % 26))}.`;
  return {
    id,
    nom,
    email: `contact${id}@example.com`,
    statut: STATUTS[index % STATUTS.length],
    ville: VILLES[index % VILLES.length],
    secteur: SECTEURS[index % SECTEURS.length],
    budget: 25_000 + ((index * 37_500) % 475_000),
    dateCreation: new Date(2024, index % 12, 1 + (index % 27)).toISOString(),
  };
});

// --- Configuration des filtres ----------------------------------------------

const SECTIONS: FilterSection[] = [
  {
    title: "Qualification",
    filters: [
      {
        key: "statut",
        label: "Statut",
        type: "multi-select",
        placeholder: "Tous les statuts",
        options: STATUTS.map(s => ({ value: s, label: STATUT_LABELS[s] })),
        isQuickFilter: true,
      },
      {
        key: "villes",
        label: "Ville",
        type: "multi-select",
        placeholder: "Toutes les villes",
        options: VILLES.map(v => ({ value: v, label: VILLE_LABELS[v] })),
        isQuickFilter: true,
        searchable: true,
        searchPlaceholder: "Rechercher une ville...",
      },
      {
        key: "secteur",
        label: "Secteur",
        type: "select",
        placeholder: "Tous les secteurs",
        options: SECTEURS.map(s => ({ value: s, label: SECTEUR_LABELS[s] })),
      },
    ],
  },
  {
    title: "Financier",
    filters: [
      { key: "budgetMin", label: "Budget minimum", type: "number", placeholder: "0", min: 0 },
      { key: "budgetMax", label: "Budget maximum", type: "number", placeholder: "500 000" },
    ],
  },
  {
    title: "Dates",
    filters: [{ key: "dateCreation", label: "Créé depuis le", type: "date", placeholder: "Sélectionner une date" }],
  },
];

const COLUMNS: ColumnDef<Client>[] = [
  { key: "nom", label: "Nom", minWidth: 160, sortable: true },
  { key: "email", label: "Email", minWidth: 200 },
  {
    key: "statut",
    label: "Statut",
    minWidth: 120,
    renderCell: row => <Badge variant={STATUT_VARIANTS[row.statut]}>{STATUT_LABELS[row.statut]}</Badge>,
  },
  { key: "ville", label: "Ville", minWidth: 120, renderCell: row => VILLE_LABELS[row.ville] ?? row.ville },
  {
    key: "secteur",
    label: "Secteur",
    minWidth: 120,
    renderCell: row => <Badge variant="outline">{SECTEUR_LABELS[row.secteur]}</Badge>,
  },
  {
    key: "budget",
    label: "Budget",
    minWidth: 130,
    sortable: true,
    getSortValue: row => row.budget,
    renderCell: row => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(row.budget),
  },
  {
    key: "dateCreation",
    label: "Créé le",
    minWidth: 120,
    sortable: true,
    getSortValue: row => row.dateCreation,
    renderCell: row => new Date(row.dateCreation).toLocaleDateString("fr-FR"),
  },
];

// --- Logique de filtrage (côté "app") ---------------------------------------

interface ClientFilters extends Record<string, unknown> {
  statut?: string[];
  villes?: string[];
  secteur?: string;
  budgetMin?: string;
  budgetMax?: string;
  dateCreation?: string;
}

function filtrerClients(clients: Client[], search: string, filters: ClientFilters): Client[] {
  const term = search.trim().toLowerCase();
  return clients.filter(client => {
    if (term.length > 0 && !client.nom.toLowerCase().includes(term) && !client.email.toLowerCase().includes(term)) {
      return false;
    }
    if (filters.statut !== undefined && filters.statut.length > 0 && !filters.statut.includes(client.statut)) {
      return false;
    }
    if (filters.villes !== undefined && filters.villes.length > 0 && !filters.villes.includes(client.ville)) {
      return false;
    }
    if (typeof filters.secteur === "string" && filters.secteur.length > 0 && client.secteur !== filters.secteur) {
      return false;
    }
    if (typeof filters.budgetMin === "string" && filters.budgetMin.length > 0 && client.budget < Number(filters.budgetMin)) {
      return false;
    }
    if (typeof filters.budgetMax === "string" && filters.budgetMax.length > 0 && client.budget > Number(filters.budgetMax)) {
      return false;
    }
    if (typeof filters.dateCreation === "string" && filters.dateCreation.length > 0 && new Date(client.dateCreation) < new Date(filters.dateCreation)) {
      return false;
    }
    return true;
  });
}

// --- Composant de démonstration ---------------------------------------------

const FiltersAppDemo = (): React.JSX.Element => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ClientFilters>({});

  const resultats = useMemo(() => filtrerClients(CLIENTS, search, filters), [search, filters]);

  const stats = useMemo(() => {
    const total = resultats.length;
    const actifs = resultats.filter(c => c.statut === "actif").length;
    const prospects = resultats.filter(c => c.statut === "prospect").length;
    const budgetTotal = resultats.reduce((sum, c) => sum + c.budget, 0);
    return { total, actifs, prospects, budgetTotal };
  }, [resultats]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Portefeuille clients</h1>
        <p className="text-sm text-muted-foreground">
          Démo d&apos;une application : recherche, filtres rapides, filtres avancés, KPIs et tableau se mettent à jour ensemble en temps réel.
        </p>
      </div>

      <KpiCards
        stats={[
          { titleKey: "Résultats", value: stats.total, icon: UsersIcon },
          { titleKey: "Clients actifs", value: stats.actifs, icon: ZapIcon, valueClassName: "text-emerald-600" },
          { titleKey: "Prospects", value: stats.prospects, icon: BuildingIcon, valueClassName: "text-amber-600" },
          { titleKey: "Budget cumulé (€)", value: stats.budgetTotal, icon: EuroIcon },
        ]}
      />

      <TableFilter<ClientFilters>
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher un client (nom, email)..."
        filters={filters}
        onFiltersChange={setFilters}
        sections={SECTIONS}
        advancedButtonText="Filtres avancés"
        sheetTitle="Filtrer le portefeuille"
      />

      <DataTable
        data={resultats}
        columns={COLUMNS}
        getRowId={row => row.id}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        noDataMessage="Aucun client ne correspond aux filtres sélectionnés."
      />
    </div>
  );
};

const meta: Meta = {
  title: "Démos/Portefeuille clients",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Story de démonstration montrant l'interaction **globale** des filtres dans un contexte applicatif réel. La recherche, les filtres rapides, les filtres avancés, les cartes KPI et le tableau de données partagent le même état et se recalculent ensemble à chaque changement.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const PortefeuilleClients: Story = {
  render: () => <FiltersAppDemo />,
};
