import {
  SimpleTableHeader,
  SimpleTableFooter,
  SimpleTable,
  SimpleTableCaption,
  SimpleTableCell,
  SimpleTableBody,
  SimpleTableHead,
  SimpleTableRow,
} from "@/components/ui/simple-table";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof SimpleTable> = {
  title: "UI/SimpleTable",
  component: SimpleTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof SimpleTable>;

export const Default: Story = {
  render: () => (
    <SimpleTable>
      <SimpleTableCaption>Liste des dernières factures.</SimpleTableCaption>
      <SimpleTableHeader>
        <SimpleTableRow>
          <SimpleTableHead className="w-[120px]">Facture</SimpleTableHead>
          <SimpleTableHead>Statut</SimpleTableHead>
          <SimpleTableHead>Méthode</SimpleTableHead>
          <SimpleTableHead className="text-right">Montant</SimpleTableHead>
        </SimpleTableRow>
      </SimpleTableHeader>
      <SimpleTableBody>
        <SimpleTableRow>
          <SimpleTableCell className="font-medium">FAC-001</SimpleTableCell>
          <SimpleTableCell>Payée</SimpleTableCell>
          <SimpleTableCell>Carte bancaire</SimpleTableCell>
          <SimpleTableCell className="text-right">250,00 €</SimpleTableCell>
        </SimpleTableRow>
        <SimpleTableRow>
          <SimpleTableCell className="font-medium">FAC-002</SimpleTableCell>
          <SimpleTableCell>En attente</SimpleTableCell>
          <SimpleTableCell>Virement</SimpleTableCell>
          <SimpleTableCell className="text-right">125,00 €</SimpleTableCell>
        </SimpleTableRow>
        <SimpleTableRow>
          <SimpleTableCell className="font-medium">FAC-003</SimpleTableCell>
          <SimpleTableCell>Impayée</SimpleTableCell>
          <SimpleTableCell>PayPal</SimpleTableCell>
          <SimpleTableCell className="text-right">500,00 €</SimpleTableCell>
        </SimpleTableRow>
      </SimpleTableBody>
    </SimpleTable>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <SimpleTable>
      <SimpleTableHeader>
        <SimpleTableRow>
          <SimpleTableHead>Produit</SimpleTableHead>
          <SimpleTableHead className="text-right">Qté</SimpleTableHead>
          <SimpleTableHead className="text-right">Prix unitaire</SimpleTableHead>
          <SimpleTableHead className="text-right">Total</SimpleTableHead>
        </SimpleTableRow>
      </SimpleTableHeader>
      <SimpleTableBody>
        <SimpleTableRow>
          <SimpleTableCell className="font-medium">Licence Pro</SimpleTableCell>
          <SimpleTableCell className="text-right">3</SimpleTableCell>
          <SimpleTableCell className="text-right">199,00 €</SimpleTableCell>
          <SimpleTableCell className="text-right">597,00 €</SimpleTableCell>
        </SimpleTableRow>
        <SimpleTableRow>
          <SimpleTableCell className="font-medium">Support Premium</SimpleTableCell>
          <SimpleTableCell className="text-right">1</SimpleTableCell>
          <SimpleTableCell className="text-right">99,00 €</SimpleTableCell>
          <SimpleTableCell className="text-right">99,00 €</SimpleTableCell>
        </SimpleTableRow>
        <SimpleTableRow>
          <SimpleTableCell className="font-medium">Formation</SimpleTableCell>
          <SimpleTableCell className="text-right">2</SimpleTableCell>
          <SimpleTableCell className="text-right">350,00 €</SimpleTableCell>
          <SimpleTableCell className="text-right">700,00 €</SimpleTableCell>
        </SimpleTableRow>
      </SimpleTableBody>
      <SimpleTableFooter>
        <SimpleTableRow>
          <SimpleTableCell colSpan={3}>Total</SimpleTableCell>
          <SimpleTableCell className="text-right">1 396,00 €</SimpleTableCell>
        </SimpleTableRow>
      </SimpleTableFooter>
    </SimpleTable>
  ),
};

export const WithSelectedRow: Story = {
  render: () => (
    <SimpleTable>
      <SimpleTableHeader>
        <SimpleTableRow>
          <SimpleTableHead>Nom</SimpleTableHead>
          <SimpleTableHead>Rôle</SimpleTableHead>
          <SimpleTableHead>Statut</SimpleTableHead>
        </SimpleTableRow>
      </SimpleTableHeader>
      <SimpleTableBody>
        <SimpleTableRow>
          <SimpleTableCell className="font-medium">Alice Martin</SimpleTableCell>
          <SimpleTableCell>Administrateur</SimpleTableCell>
          <SimpleTableCell>Actif</SimpleTableCell>
        </SimpleTableRow>
        <SimpleTableRow data-state="selected">
          <SimpleTableCell className="font-medium">Bob Dupont</SimpleTableCell>
          <SimpleTableCell>Développeur</SimpleTableCell>
          <SimpleTableCell>Actif</SimpleTableCell>
        </SimpleTableRow>
        <SimpleTableRow>
          <SimpleTableCell className="font-medium">Claire Lemoine</SimpleTableCell>
          <SimpleTableCell>Designer</SimpleTableCell>
          <SimpleTableCell>Inactif</SimpleTableCell>
        </SimpleTableRow>
      </SimpleTableBody>
    </SimpleTable>
  ),
};

export const WithStatusBadges: Story = {
  render: () => {
    const statusClass: Record<string, string> = {
      Actif: "bg-green-100 text-green-800",
      Inactif: "bg-gray-100 text-gray-600",
      "En cours": "bg-blue-100 text-blue-800",
      Erreur: "bg-red-100 text-red-800",
    };

    const rows = [
      { id: "JOB-01", label: "Import clients", status: "Actif", date: "26/05/2026 09:00" },
      { id: "JOB-02", label: "Envoi e-mails", status: "En cours", date: "26/05/2026 09:15" },
      { id: "JOB-03", label: "Sauvegarde BDD", status: "Inactif", date: "25/05/2026 23:00" },
      { id: "JOB-04", label: "Sync entrepôt", status: "Erreur", date: "26/05/2026 07:30" },
    ];

    return (
      <SimpleTable>
        <SimpleTableHeader>
          <SimpleTableRow>
            <SimpleTableHead>ID</SimpleTableHead>
            <SimpleTableHead>Tâche</SimpleTableHead>
            <SimpleTableHead>Statut</SimpleTableHead>
            <SimpleTableHead>Dernière exécution</SimpleTableHead>
          </SimpleTableRow>
        </SimpleTableHeader>
        <SimpleTableBody>
          {rows.map(row => (
            <SimpleTableRow key={row.id}>
              <SimpleTableCell className="font-mono text-xs">{row.id}</SimpleTableCell>
              <SimpleTableCell className="font-medium">{row.label}</SimpleTableCell>
              <SimpleTableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[row.status]}`}>{row.status}</span>
              </SimpleTableCell>
              <SimpleTableCell className="text-muted-foreground">{row.date}</SimpleTableCell>
            </SimpleTableRow>
          ))}
        </SimpleTableBody>
      </SimpleTable>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <SimpleTable>
      <SimpleTableHeader>
        <SimpleTableRow>
          <SimpleTableHead>Référence</SimpleTableHead>
          <SimpleTableHead>Client</SimpleTableHead>
          <SimpleTableHead>Date</SimpleTableHead>
          <SimpleTableHead className="text-right">Montant</SimpleTableHead>
        </SimpleTableRow>
      </SimpleTableHeader>
      <SimpleTableBody>
        <SimpleTableRow>
          <SimpleTableCell colSpan={4} className="h-24 text-center text-muted-foreground">
            Aucun résultat.
          </SimpleTableCell>
        </SimpleTableRow>
      </SimpleTableBody>
    </SimpleTable>
  ),
};

export const ManyColumns: Story = {
  render: () => (
    <SimpleTable>
      <SimpleTableHeader>
        <SimpleTableRow>
          <SimpleTableHead className="w-[80px]">ID</SimpleTableHead>
          <SimpleTableHead>Nom</SimpleTableHead>
          <SimpleTableHead>Prénom</SimpleTableHead>
          <SimpleTableHead>Email</SimpleTableHead>
          <SimpleTableHead>Téléphone</SimpleTableHead>
          <SimpleTableHead>Ville</SimpleTableHead>
          <SimpleTableHead>Département</SimpleTableHead>
          <SimpleTableHead>Contrat</SimpleTableHead>
          <SimpleTableHead className="text-right">Salaire</SimpleTableHead>
        </SimpleTableRow>
      </SimpleTableHeader>
      <SimpleTableBody>
        {[
          {
            id: 1,
            nom: "Martin",
            prenom: "Alice",
            email: "alice.martin@example.com",
            tel: "06 11 22 33 44",
            ville: "Lyon",
            dept: "Rhône",
            contrat: "CDI",
            salaire: "3 200 €",
          },
          {
            id: 2,
            nom: "Dupont",
            prenom: "Bob",
            email: "bob.dupont@example.com",
            tel: "07 55 66 77 88",
            ville: "Paris",
            dept: "Paris",
            contrat: "CDD",
            salaire: "2 800 €",
          },
          {
            id: 3,
            nom: "Lemoine",
            prenom: "Claire",
            email: "claire.lemoine@example.com",
            tel: "06 99 00 11 22",
            ville: "Grenoble",
            dept: "Isère",
            contrat: "CDI",
            salaire: "3 500 €",
          },
        ].map(row => (
          <SimpleTableRow key={row.id}>
            <SimpleTableCell className="font-mono text-xs">{row.id}</SimpleTableCell>
            <SimpleTableCell className="font-medium">{row.nom}</SimpleTableCell>
            <SimpleTableCell>{row.prenom}</SimpleTableCell>
            <SimpleTableCell className="text-muted-foreground">{row.email}</SimpleTableCell>
            <SimpleTableCell>{row.tel}</SimpleTableCell>
            <SimpleTableCell>{row.ville}</SimpleTableCell>
            <SimpleTableCell>{row.dept}</SimpleTableCell>
            <SimpleTableCell>{row.contrat}</SimpleTableCell>
            <SimpleTableCell className="text-right">{row.salaire}</SimpleTableCell>
          </SimpleTableRow>
        ))}
      </SimpleTableBody>
    </SimpleTable>
  ),
};

export const Compact: Story = {
  render: () => (
    <SimpleTable>
      <SimpleTableHeader>
        <SimpleTableRow>
          <SimpleTableHead className="h-8 py-1 text-xs">Clé</SimpleTableHead>
          <SimpleTableHead className="h-8 py-1 text-xs">Valeur</SimpleTableHead>
          <SimpleTableHead className="h-8 py-1 text-xs">Type</SimpleTableHead>
        </SimpleTableRow>
      </SimpleTableHeader>
      <SimpleTableBody>
        {[
          { key: "app.name", value: "Krosoft Platform", type: "string" },
          { key: "app.version", value: "2.4.1", type: "string" },
          { key: "feature.dark_mode", value: "true", type: "boolean" },
          { key: "pagination.page_size", value: "25", type: "number" },
          { key: "cache.ttl", value: "3600", type: "number" },
        ].map(row => (
          <SimpleTableRow key={row.key}>
            <SimpleTableCell className="py-1 font-mono text-xs">{row.key}</SimpleTableCell>
            <SimpleTableCell className="py-1 text-xs">{row.value}</SimpleTableCell>
            <SimpleTableCell className="py-1 text-xs text-muted-foreground">{row.type}</SimpleTableCell>
          </SimpleTableRow>
        ))}
      </SimpleTableBody>
    </SimpleTable>
  ),
};
