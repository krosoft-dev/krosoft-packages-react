import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon, UserIcon, UsersIcon } from "lucide-react";
import React, { useState } from "react";
import FormDialog from "@/components/core/dialogs/FormDialog";
import { AppPageHeader } from "@/components/core/layouts/AppPageHeader";
import { ColumnDef, DataTable } from "@/components/core/table/DataTable";
import { Badge } from "@/components/ui/badge";
import type { FormSchema } from "@/types";

// --- Modèle de données -------------------------------------------------------

interface Client extends Record<string, unknown> {
  id: string;
  nom: string;
  email: string;
  statut: string;
  ville: string;
  secteur: string;
  budget: number;
  notes: string;
}

const STATUT_LABELS: Record<string, string> = { actif: "Actif", inactif: "Inactif", prospect: "Prospect", archive: "Archivé" };
const STATUT_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  actif: "default",
  inactif: "secondary",
  prospect: "outline",
  archive: "destructive",
};
const VILLE_LABELS: Record<string, string> = { paris: "Paris", lyon: "Lyon", marseille: "Marseille", bordeaux: "Bordeaux" };
const SECTEUR_LABELS: Record<string, string> = { tech: "Tech", finance: "Finance", sante: "Santé", industrie: "Industrie" };

const CLIENTS_INITIAUX: Client[] = [
  {
    id: "1",
    nom: "Groupe Lumière SA",
    email: "contact@groupe-lumiere.fr",
    statut: "prospect",
    ville: "lyon",
    secteur: "tech",
    budget: 150_000,
    notes: "Contact via salon professionnel.",
  },
  {
    id: "2",
    nom: "Atlas Industries",
    email: "hello@atlas-ind.fr",
    statut: "actif",
    ville: "paris",
    secteur: "industrie",
    budget: 420_000,
    notes: "Client historique, renouvellement annuel.",
  },
  { id: "3", nom: "MediCare Plus", email: "info@medicare-plus.fr", statut: "actif", ville: "bordeaux", secteur: "sante", budget: 275_000, notes: "" },
  {
    id: "4",
    nom: "FinTech Solutions",
    email: "team@fintech-sol.fr",
    statut: "inactif",
    ville: "marseille",
    secteur: "finance",
    budget: 90_000,
    notes: "À relancer au T3.",
  },
];

const CLIENT_VIERGE: Client = { id: "", nom: "", email: "", statut: "prospect", ville: "paris", secteur: "tech", budget: 0, notes: "" };

// --- Schéma du formulaire (partagé vue / édition) ---------------------------

const schema: FormSchema<Client> = {
  useCards: false,
  sections: [
    {
      titleKey: "Identité",
      icon: UserIcon,
      iconClassName: "text-indigo-500",
      fields: [
        {
          key: "nom",
          labelKey: "Raison sociale",
          type: "text",
          placeholderKey: "Nom de l'entreprise",
          rules: z => z.string().min(1, "La raison sociale est requise").min(3, "Au moins 3 caractères"),
          layout: { cols: 2 },
        },
        {
          key: "email",
          labelKey: "E-mail",
          type: "text",
          placeholderKey: "contact@entreprise.fr",
          rules: z =>
            z
              .string()
              .min(1, "L'e-mail est requis")
              .pipe(z.email({ message: "Format d'e-mail invalide" })),
          layout: { cols: 2 },
        },
        {
          key: "statut",
          labelKey: "Statut",
          type: "select",
          options: [
            { value: "prospect", label: "Prospect", color: "#f59e0b" },
            { value: "actif", label: "Actif", color: "#10b981" },
            { value: "inactif", label: "Inactif", color: "#6b7280" },
            { value: "archive", label: "Archivé", color: "#ef4444" },
          ] as { value: string; label: string; color?: string }[],
          rules: z => z.string().min(1, "Le statut est requis"),
          layout: { cols: 2 },
        },
        {
          key: "ville",
          labelKey: "Ville",
          type: "select",
          options: [
            { value: "paris", label: "Paris" },
            { value: "lyon", label: "Lyon" },
            { value: "marseille", label: "Marseille" },
            { value: "bordeaux", label: "Bordeaux" },
          ],
          layout: { cols: 2 },
        },
        {
          key: "secteur",
          labelKey: "Secteur",
          type: "select",
          options: [
            { value: "tech", label: "Tech" },
            { value: "finance", label: "Finance" },
            { value: "sante", label: "Santé" },
            { value: "industrie", label: "Industrie" },
          ],
          layout: { cols: 2 },
        },
        {
          key: "budget",
          labelKey: "Budget estimé (€)",
          type: "number",
          placeholderKey: "0",
          min: 0,
          step: 1000,
          rules: z => z.number().min(0, "Le budget doit être positif"),
          layout: { cols: 2 },
        },
        {
          key: "notes",
          labelKey: "Notes internes",
          type: "textarea",
          placeholderKey: "Contexte, historique, prochaines étapes...",
          layout: { cols: 4 },
        },
      ],
    },
  ],
};

// --- Page de démonstration ---------------------------------------------------

const GestionClientsPage = (): React.JSX.Element => {
  const [clients, setClients] = useState<Client[]>(CLIENTS_INITIAUX);
  const [selection, setSelection] = useState<Client | null>(null);
  const [open, setOpen] = useState(false);
  const [creation, setCreation] = useState(false);

  const ouvrirFiche = (client: Client): void => {
    setCreation(false);
    setSelection(client);
    setOpen(true);
  };

  const ouvrirCreation = (): void => {
    setCreation(true);
    setSelection({ ...CLIENT_VIERGE });
    setOpen(true);
  };

  const enregistrer = async (data: Client): Promise<void> => {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 700));
    setClients(prev => {
      if (creation) {
        const id = (Math.max(0, ...prev.map(c => Number(c.id))) + 1).toString();
        return [...prev, { ...data, id }];
      }
      return prev.map(c => (c.id === data.id ? { ...data } : c));
    });
  };

  const columns: ColumnDef<Client>[] = [
    { key: "nom", label: "Raison sociale", minWidth: 180, sortable: true },
    { key: "email", label: "E-mail", minWidth: 200 },
    {
      key: "statut",
      label: "Statut",
      minWidth: 120,
      renderCell: row => <Badge variant={STATUT_VARIANTS[row.statut]}>{STATUT_LABELS[row.statut]}</Badge>,
    },
    { key: "ville", label: "Ville", minWidth: 120, renderCell: row => VILLE_LABELS[row.ville] ?? row.ville },
    { key: "secteur", label: "Secteur", minWidth: 120, renderCell: row => SECTEUR_LABELS[row.secteur] ?? row.secteur },
    {
      key: "budget",
      label: "Budget",
      minWidth: 130,
      sortable: true,
      getSortValue: row => row.budget,
      renderCell: row => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(row.budget),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <AppPageHeader
        icon={UsersIcon}
        titleKey="Gestion des clients"
        descriptionKey="Démo de FormDialog : cliquez une ligne pour consulter la fiche (lecture seule), puis « Modifier » pour l'éditer, ou créez un nouveau client."
        actions={[{ labelKey: "Nouveau client", icon: PlusIcon, onClick: ouvrirCreation }]}
      />

      <DataTable data={clients} columns={columns} getRowId={row => row.id} onRowClick={ouvrirFiche} defaultPageSize={10} columnVisibility={false} />

      <FormDialog<Client>
        open={open}
        onOpenChange={setOpen}
        data={selection}
        title={data => (creation ? "Nouveau client" : `Fiche : ${data.nom}`)}
        headerBadge={data => (data.statut ? <Badge variant={STATUT_VARIANTS[data.statut]}>{STATUT_LABELS[data.statut]}</Badge> : null)}
        schema={schema}
        onSave={enregistrer}
        defaultEditing={creation}
        saveLabel={creation ? "Créer le client" : "Enregistrer"}
      />
    </div>
  );
};

const meta: Meta = {
  title: "Démos/Gestion des clients",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Story de démonstration illustrant `FormDialog` dans un contexte applicatif réel : un tableau de clients dont chaque ligne ouvre une modale de consultation/édition, et un bouton de création. Le tableau se met à jour après chaque enregistrement — dans la continuité des démos « Portefeuille clients » et « Fiche client ».",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const GestionClients: Story = {
  name: "Tableau + édition en modale",
  render: () => <GestionClientsPage />,
};
