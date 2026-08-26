import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable } from "@/components/core/table/DataTable";
import type { ColumnDef } from "@/types";
import React from "react";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { PencilIcon, TrashIcon } from "lucide-react";

const meta: Meta<typeof DataTable> = {
  title: "Core/Table/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Le composant `DataTable` permet d'afficher des données sous forme de tableau avec des fonctionnalités avancées (tri, sélection, menu d'actions).\n\n### Fonctionnalités\n\n- **Tri** : Activez le tri colonne par colonne avec `sortable: true` dans `ColumnDef`. Un icône `↕` apparaît sur les colonnes triables ; `↑`/`↓` indique la colonne et le sens actifs.\n- **En-têtes i18n** : `headerKey` sur un `ColumnDef` est une clé i18n résolue dans le namespace de l'application (comme `labelKey`/`titleKey`). Sans traduction enregistrée — le cas de ce Storybook — la clé s'affiche telle quelle.\n- **Tri personnalisé** : `getSortValue` sur un `ColumnDef` fournit la valeur utilisée pour comparer les lignes, quand `row[key]` n'est pas directement triable (tableau, rendu formaté) ou que l'ordre naturel n'est pas celui attendu.\n- **Réorganisation des colonnes** : Glissez et déposez l'icône de poignée dans l'en-tête.\n- **Désactivation du glisser-déposer** : Vous pouvez figer toutes les colonnes en passant `config={{ draggableColumns: false }}`.\n- **Largeur des colonnes** : par défaut (`config.resizableColumns` non activé), `minWidth` sur un `ColumnDef` n'est qu'un plancher — la colonne s'élargit naturellement selon le contenu. Avec `config={{ resizableColumns: true }}`, `minWidth` devient la largeur figée de départ et une poignée sur le bord droit de l'en-tête permet de la redimensionner manuellement.\n- **Style de colonne** : `className` sur un `ColumnDef` s'applique à l'en-tête et à chaque cellule de la colonne.\n- **Alignement** : `align: \"left\" | \"center\" | \"right\"` range les cellules **et** leur en-tête du même côté. Il est déduit automatiquement quand `className` porte déjà `text-right` ou `text-center`.\n- **Mode compact** : `config={{ dense: true }}` réduit le padding vertical des cellules (en-têtes et corps) pour un affichage compact.\n- **Navigation au clic** : `onRowNavigate` retourne l'URL de destination d'une ligne ; un clic navigue via le router (react-router), Ctrl/Cmd + clic ouvre l'URL dans un nouvel onglet. Il est prioritaire sur `onRowClick`.\n- **Colonnes figées** : `fixed: \"left\" | \"right\"` sur un `ColumnDef` accroche la colonne à un bord ; l'en-tête est figé avec elle, au même pixel. `config.fixedActions` fige de la même façon la colonne des actions. Une colonne figée n'est pas déplaçable au glisser-déposer.\n- **Actions de ligne** : les entrées de `config.actions` (libellé `labelKey`, clé i18n résolue comme `headerKey`) s'affichent en ligne par défaut ; `overflow: true` les déplace dans le menu kebab. `visible(row)` masque une action au cas par cas, `disabled(row)` la désactive sans la masquer, `variant` contrôle son style de bouton.",
      },
    },
  },
};

export default meta;

type UserData = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  status: "active" | "inactive";
  lastLogin: string;
};

const mockData: UserData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-10-25T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-10-24T14:15:00Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "guest",
    status: "inactive",
    lastLogin: "2023-09-15T08:45:00Z",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-10-26T09:20:00Z",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "user",
    status: "inactive",
    lastLogin: "2023-10-10T11:10:00Z",
  },
];

const mockData50: UserData[] = Array.from({ length: 500 }, (_, index) => {
  const id = (index + 1).toString();
  const roles: ("admin" | "user" | "guest")[] = ["admin", "user", "guest"];
  const statuses: ("active" | "inactive")[] = ["active", "inactive"];
  return {
    id,
    name: `User ${id}`,
    email: `user.${id}@example.com`,
    role: roles[index % roles.length],
    status: statuses[index % statuses.length],
    lastLogin: new Date(2023, 9, 26 - (index % 15)).toISOString(),
  };
});

const columns: ColumnDef<UserData>[] = [
  {
    key: "name",
    headerKey: "Name",
    minWidth: 150,
    sortable: true,
  },
  {
    key: "email",
    headerKey: "Email",
    minWidth: 200,
    sortable: true,
  },
  {
    key: "role",
    headerKey: "Role",
    minWidth: 100,
    renderCell: row => <span className="capitalize">{row.role}</span>,
  },
  {
    key: "status",
    headerKey: "Status",
    minWidth: 100,
    renderCell: row => <Badge variant={row.status === "active" ? "default" : "secondary"}>{row.status === "active" ? "Active" : "Inactive"}</Badge>,
  },
  {
    key: "lastLogin",
    headerKey: "Last Login",
    minWidth: 150,
    sortable: true,
    renderCell: row => new Date(row.lastLogin).toLocaleDateString(),
  },
];

type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    data: mockData,
    config: { columns, getRowId: (row: UserData) => row.id },
  },
};

export const WithRowClick: Story = {
  args: {
    data: mockData,
    config: {
      columns,
      getRowId: (row: UserData) => row.id,
      onRowClick: (row: UserData) => {
        console.warn(`Clicked on row: ${row.name}`);
      },
    },
  },
};

export const WithRowNavigate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`onRowNavigate` calcule l'URL de destination de chaque ligne : un clic navigue via le router (react-router), Ctrl/Cmd + clic ouvre l'URL dans un nouvel onglet via `window.open`. Il est prioritaire sur `onRowClick`.",
      },
    },
  },
  args: {
    data: mockData,
    config: { columns, getRowId: (row: UserData) => row.id, onRowNavigate: (row: UserData) => `/users/${row.id}` },
  },
};

export const Dense: Story = {
  parameters: {
    docs: {
      description: {
        story: "`config={{ dense: true }}` réduit le padding vertical des cellules (en-têtes et corps) pour un affichage compact des lignes.",
      },
    },
  },
  args: {
    data: mockData,
    config: { columns, getRowId: (row: UserData) => row.id, dense: true },
  },
};

export const NonDraggable: Story = {
  parameters: {
    docs: {
      description: {
        story: "Désactive le glisser-déposer et masque les icônes de poignée pour l'ensemble du tableau en définissant `config={{ draggableColumns: false }}`.",
      },
    },
  },
  args: {
    data: mockData,
    config: { columns, getRowId: (row: UserData) => row.id, draggableColumns: false },
  },
};

export const NonResizable: Story = {
  parameters: {
    docs: {
      description: {
        story: "Désactive le redimensionnement des colonnes pour l'ensemble du tableau en définissant `config={{ resizableColumns: false }}`.",
      },
    },
  },
  args: {
    data: mockData,
    config: { columns, getRowId: (row: UserData) => row.id, resizableColumns: false },
  },
};

const dataWithLongEmail: UserData[] = [
  { ...mockData[0], email: "john.doe.avec.une.adresse.email.tres.longue.pour.la.demo@exemple-entreprise.com" },
  ...mockData.slice(1),
];

export const FlexibleColumnWidths: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Sans `config.resizableColumns` (comportement par défaut), `minWidth` sur un `ColumnDef` n'est qu'un plancher : la colonne s'élargit naturellement si le contenu le nécessite (ici l'email de John Doe dépasse largement les 200px de `minWidth`).",
      },
    },
  },
  args: {
    data: dataWithLongEmail,
    config: { columns, getRowId: (row: UserData) => row.id },
  },
};

export const WithResizableColumns: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Avec `config={{ resizableColumns: true }}`, `minWidth` redevient la largeur de départ figée de la colonne : le contenu qui dépasse est tronqué, et l'utilisateur peut redimensionner manuellement via la poignée sur le bord droit de l'en-tête.",
      },
    },
  },
  args: {
    data: dataWithLongEmail,
    config: { columns, getRowId: (row: UserData) => row.id, resizableColumns: true },
  },
};

export const WithActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Par défaut (`overflow` non défini), les actions s'affichent en ligne. `variant` contrôle le style du bouton (ex: `destructive` pour Supprimer).",
      },
    },
  },
  args: {
    data: mockData,
    config: {
      columns,
      getRowId: (row: UserData) => row.id,
      actions: [
        {
          labelKey: "Modifier",
          icon: PencilIcon,
          onClick: (row: UserData): void => {
            console.warn(`Edit row: ${row.name}`);
          },
        },
        {
          labelKey: "Supprimer",
          icon: TrashIcon,
          variant: "destructive",
          onClick: (row: UserData): void => {
            console.warn(`Delete row: ${row.name}`);
          },
        },
      ],
    },
  },
};

export const WithOverflowActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Les actions marquées `overflow: true` sont regroupées dans le menu kebab plutôt qu'affichées en ligne. Ici seule **Modifier** reste visible directement, **Dupliquer** et **Supprimer** passent dans le menu.",
      },
    },
  },
  args: {
    data: mockData,
    config: {
      columns,
      getRowId: (row: UserData) => row.id,
      actions: [
        {
          labelKey: "Modifier",
          icon: PencilIcon,
          onClick: (row: UserData): void => {
            console.warn(`Edit row: ${row.name}`);
          },
        },
        {
          labelKey: "Dupliquer",
          onClick: (row: UserData): void => {
            console.warn(`Duplicate row: ${row.name}`);
          },
          overflow: true,
        },
        {
          labelKey: "Supprimer",
          icon: TrashIcon,
          className: "text-destructive focus:bg-destructive/10 focus:text-destructive",
          onClick: (row: UserData): void => {
            console.warn(`Delete row: ${row.name}`);
          },
          overflow: true,
        },
      ],
    },
  },
};

export const WithConditionalActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`visible` masque l'action au cas par cas (ici **Supprimer** n'apparaît que pour le statut `inactive`), `disabled` la désactive sans la masquer (ici **Modifier** est désactivée pour `admin`).",
      },
    },
  },
  args: {
    data: mockData,
    config: {
      columns,
      getRowId: (row: UserData) => row.id,
      actions: [
        {
          labelKey: "Modifier",
          icon: PencilIcon,
          disabled: (row: UserData) => row.role === "admin",
          onClick: (row: UserData): void => {
            console.warn(`Edit row: ${row.name}`);
          },
        },
        {
          labelKey: "Supprimer",
          icon: TrashIcon,
          variant: "destructive",
          visible: (row: UserData) => row.status === "inactive",
          onClick: (row: UserData): void => {
            console.warn(`Delete row: ${row.name}`);
          },
        },
      ],
    },
  },
};

export const WithBulkActions: Story = {
  args: {
    data: mockData,
    config: {
      columns,
      getRowId: (row: UserData) => row.id,
      bulkActions: [
        {
          labelKey: "Activate Selected",
          onClick: (selectedIds: string[], clearSelection: () => void): void => {
            console.warn(`Activating users with IDs: ${selectedIds.join(", ")}`);
            clearSelection();
          },
        },
        {
          labelKey: "Delete Selected",
          variant: "destructive",
          onClick: (selectedIds: string[], clearSelection: () => void): void => {
            console.warn(`Deleting users with IDs: ${selectedIds.join(", ")}`);
            clearSelection();
          },
        },
      ],
    },
  },
};

export const WithNoData: Story = {
  args: {
    data: [],
    config: { columns, getRowId: (row: UserData) => row.id },
  },
};

export const WithNoDataCustomMessage: Story = {
  args: {
    data: [],
    config: { columns, getRowId: (row: UserData) => row.id, messages: { emptyKey: "Aucun utilisateur trouvé dans la base de données." } },
  },
};

export const Loading: Story = {
  args: {
    data: [],
    config: { columns, getRowId: (row: UserData) => row.id },
    isLoading: true,
  },
};

export const WithError: Story = {
  args: {
    data: [],
    config: { columns, getRowId: (row: UserData) => row.id },
    error: "Impossible de charger les données. Veuillez réessayer.",
  },
};

export const CustomPageSize: Story = {
  args: {
    data: mockData50,
    config: { columns, getRowId: (row: UserData) => row.id, defaultPageSize: 5, pageSizeOptions: [5, 10, 25, 50] },
  },
};

export const FullFeatured: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Combine toutes les fonctionnalités : tri, sélection avec actions groupées, colonne stylée (`className`), et actions de ligne mêlant inline/overflow/variant/visible/disabled.",
      },
    },
  },
  args: {
    data: mockData,
    config: {
      columns: columns.map(col => (col.key === "lastLogin" ? { ...col, className: "text-right text-muted-foreground" } : col)),
      getRowId: (row: UserData) => row.id,
      onRowClick: (row: UserData) => {
        console.warn(`Clicked on row: ${row.name}`);
      },
      actions: [
        {
          labelKey: "Modifier",
          icon: PencilIcon,
          disabled: (row: UserData) => row.role === "admin",
          onClick: (row: UserData): void => {
            console.warn(`Edit row: ${row.name}`);
          },
        },
        {
          labelKey: "Supprimer",
          icon: TrashIcon,
          variant: "destructive",
          visible: (row: UserData) => row.status === "inactive",
          overflow: true,
          onClick: (row: UserData): void => {
            console.warn(`Delete row: ${row.name}`);
          },
        },
      ],
      bulkActions: [
        {
          labelKey: "Export Selected",
          onClick: (selectedIds: string[], clearSelection: () => void): void => {
            console.warn(`Exporting users with IDs: ${selectedIds.join(", ")}`);
            clearSelection();
          },
        },
        {
          labelKey: "Delete Selected",
          variant: "destructive",
          onClick: (selectedIds: string[], clearSelection: () => void): void => {
            console.warn(`Deleting users with IDs: ${selectedIds.join(", ")}`);
            clearSelection();
          },
        },
      ],
    },
  },
};

export const WithoutColumnVisibility: Story = {
  parameters: {
    docs: {
      description: {
        story: "Le bouton de visibilité des colonnes est masqué via `config={{ columnVisibility: false }}`.",
      },
    },
  },
  args: {
    data: mockData,
    config: { columns, getRowId: (row: UserData) => row.id, columnVisibility: false },
  },
};

const wideColumns: ColumnDef<UserData>[] = [
  { ...columns[0], fixed: "left" },
  ...columns.slice(1),
  { key: "team", headerKey: "Team", minWidth: 160, renderCell: row => `Team ${row.id}` },
  { key: "manager", headerKey: "Manager", minWidth: 180, renderCell: row => `Manager ${row.id}` },
  { key: "location", headerKey: "Location", minWidth: 180, renderCell: () => "Paris, France" },
  { key: "phone", headerKey: "Phone", minWidth: 160, renderCell: () => "+33 1 23 45 67 89" },
];

export const WithFixedColumns: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Le tableau déborde en largeur : **Name** est figée à gauche (`fixed: "left"`) et la colonne des actions à droite (`config.fixedActions`). Faites défiler horizontalement — les en-têtes restent accrochés en même temps que leurs cellules, et la case de sélection est figée avec la première colonne.',
      },
    },
  },
  args: {
    data: mockData,
    config: {
      columns: wideColumns,
      getRowId: (row: UserData) => row.id,
      fixedActions: true,
      columnVisibility: true,
      bulkActions: [
        {
          labelKey: "Supprimer",
          icon: TrashIcon,
          variant: "destructive" as const,
          onClick: (selectedIds: string[], clearSelection: () => void): void => {
            console.warn(`Deleting users with IDs: ${selectedIds.join(", ")}`);
            clearSelection();
          },
        },
      ],
      actions: [
        {
          labelKey: "Modifier",
          icon: PencilIcon,
          onClick: (row: UserData): void => {
            console.warn("Edit", row.id);
          },
        },
        {
          labelKey: "Supprimer",
          icon: TrashIcon,
          overflow: true,
          onClick: (row: UserData): void => {
            console.warn("Delete", row.id);
          },
        },
      ],
    },
  },
};

export const WithColumnClassName: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`className` sur un `ColumnDef` s'applique à l'en-tête et à chaque cellule de la colonne (ici **Last Login** est aligné à droite). L'en-tête suit l'alignement des cellules : le libellé et l'icône de tri se regroupent au bord droit.",
      },
    },
  },
  args: {
    data: mockData,
    config: {
      columns: columns.map(col => (col.key === "lastLogin" ? { ...col, className: "text-right text-muted-foreground" } : col)),
      getRowId: (row: UserData) => row.id,
    },
  },
};

export const WithAlignedColumns: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`align` range les cellules et leur en-tête du même côté : **Role** est centrée, **Last Login** est alignée à droite. Sans cela le libellé resterait à gauche, au-dessus du vide laissé par des valeurs poussées à droite.",
      },
    },
  },
  args: {
    data: mockData,
    config: {
      columns: columns.map(col => {
        if (col.key === "lastLogin") return { ...col, align: "right" as const };
        if (col.key === "role") return { ...col, align: "center" as const };
        return col;
      }),
      getRowId: (row: UserData) => row.id,
    },
  },
};

export const WithSortableColumns: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Illustre la différence visuelle entre colonnes triables (`sortable: true`) et non triables. Les colonnes **Name**, **Email** et **Last Login** affichent l'icône `↕` et réagissent au clic. **Role** et **Status** n'ont pas d'icône et ignorent le clic.",
      },
    },
  },
  args: {
    data: mockData,
    config: { columns, getRowId: (row: UserData) => row.id },
  },
};

export const AllSortable: Story = {
  parameters: {
    docs: {
      description: {
        story: "Toutes les colonnes sont triables.",
      },
    },
  },
  args: {
    data: mockData,
    config: { columns: columns.map(col => ({ ...col, sortable: true })), getRowId: (row: UserData) => row.id },
  },
};

export const NoSortable: Story = {
  parameters: {
    docs: {
      description: {
        story: "Aucune colonne n'est triable — aucune icône ni curseur pointer sur les en-têtes.",
      },
    },
  },
  args: {
    data: mockData,
    config: { columns: columns.map(({ sortable: _sortable, ...col }) => col), getRowId: (row: UserData) => row.id },
  },
};

// Instance i18next locale : passée via I18nextProvider, elle ne touche pas l'instance globale —
// les autres stories restent sur le repli clé → libellé.
const headersI18n = createInstance();
void headersI18n.init({
  lng: "fr",
  resources: {
    fr: {
      translation: {
        "users.columns.name": "Nom",
        "users.columns.email": "Email",
        "users.columns.role": "Rôle",
        "users.columns.status": "Statut",
        "users.columns.lastLogin": "Dernière connexion",
      },
    },
    en: {
      translation: {
        "users.columns.name": "Name",
        "users.columns.email": "Email",
        "users.columns.role": "Role",
        "users.columns.status": "Status",
        "users.columns.lastLogin": "Last login",
      },
    },
  },
});

const translatedColumns: ColumnDef<UserData>[] = columns.map(col => ({ ...col, headerKey: `users.columns.${col.key}` }));

const TranslatedHeadersDemo = (): React.JSX.Element => {
  const [language, setLanguage] = React.useState("fr");

  const switchTo = (lang: string): void => {
    void headersI18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <I18nextProvider i18n={headersI18n}>
      <div className="space-y-4">
        <div className="flex gap-2">
          {["fr", "en"].map(lang => (
            <button
              key={lang}
              className={`px-3 py-1 rounded border text-sm ${language === lang ? "bg-primary text-primary-foreground" : "bg-background"}`}
              onClick={() => {
                switchTo(lang);
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <DataTable data={mockData} config={{ columns: translatedColumns, getRowId: (row: UserData) => row.id }} />
      </div>
    </I18nextProvider>
  );
};

export const WithTranslatedHeaders: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`headerKey` est passée à `t()` : quand l'application a enregistré des traductions, les en-têtes suivent sa langue (ici `users.columns.name` → « Nom »/« Name », via une instance i18next locale — basculez FR/EN). Le menu de visibilité des colonnes est traduit de la même façon. Les autres stories montrent le repli : sans traduction enregistrée, la clé s'affiche telle quelle.",
      },
    },
  },
  render: () => <TranslatedHeadersDemo />,
};

type ContactData = {
  id: string;
  name: string;
  emails: string[];
  priority: "low" | "medium" | "high";
};

const contacts: ContactData[] = [
  { id: "1", name: "Alice Martin", emails: ["z.martin@perso.example.com", "alice.martin@example.com"], priority: "medium" },
  { id: "2", name: "Bruno Lefevre", emails: ["bruno.lefevre@example.com"], priority: "high" },
  { id: "3", name: "Chloé Dubois", emails: ["a.dubois@perso.example.com", "chloe.dubois@example.com"], priority: "low" },
  { id: "4", name: "David Morel", emails: ["david.morel@example.com", "dmorel@perso.example.com"], priority: "high" },
  { id: "5", name: "Emma Petit", emails: ["m.petit@perso.example.com"], priority: "medium" },
];

const PRIORITY_RANKS: Record<ContactData["priority"], number> = { low: 0, medium: 1, high: 2 };
const PRIORITY_LABELS: Record<ContactData["priority"], string> = { low: "Faible", medium: "Moyenne", high: "Haute" };

const contactColumns: ColumnDef<ContactData>[] = [
  { key: "name", headerKey: "Nom", minWidth: 150, sortable: true },
  {
    key: "emails",
    headerKey: "Emails",
    minWidth: 280,
    sortable: true,
    // `row.emails` est un tableau : sans getSortValue, le tri n'aurait aucune valeur comparable.
    getSortValue: row => row.emails[0],
    renderCell: row => (
      <div className="flex flex-wrap gap-1">
        {row.emails.map(email => (
          <Badge key={email} variant="outline">
            {email}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "priority",
    headerKey: "Priorité",
    minWidth: 110,
    sortable: true,
    // Tri par niveau : l'ordre alphabétique des libellés donnerait Faible < Haute < Moyenne.
    getSortValue: row => PRIORITY_RANKS[row.priority],
    renderCell: row => PRIORITY_LABELS[row.priority],
  },
];

export const WithGetSortValue: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Par défaut, trier une colonne compare la valeur brute `row[column.key]`. `getSortValue` remplace cette valeur de comparaison, ligne par ligne. Deux cas où c'est indispensable : **Emails** contient un tableau — le tri se cale sur le premier email — et **Priorité** affiche un libellé dont l'ordre alphabétique (Faible < Haute < Moyenne) ne correspond pas à l'ordre métier — `getSortValue` renvoie un rang numérique à la place. Inutile quand `row[key]` est déjà la bonne valeur (string, nombre, date ISO), et sans effet en mode contrôlé (`onSortChange`), où le tri est délégué au parent.",
      },
    },
  },
  args: {
    data: contacts,
    config: { columns: contactColumns, getRowId: (row: ContactData) => row.id },
  },
};

export const FiftyRows: Story = {
  parameters: {
    docs: {
      description: {
        story: "Affiche le tableau avec un jeu de données contenant 50 lignes.",
      },
    },
  },
  args: {
    data: mockData50.slice(0, 50),
    config: { columns, getRowId: (row: UserData) => row.id },
  },
};

const ServerSideDataTableWrapper = (): React.JSX.Element => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState<string | null>("name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
  const [data, setData] = React.useState<UserData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Tri côté "serveur"
      const sorted = [...mockData50];
      if (sortColumn) {
        sorted.sort((a, b) => {
          const aVal = a[sortColumn as keyof UserData];
          const bVal = b[sortColumn as keyof UserData];
          if (typeof aVal === "string" && typeof bVal === "string") {
            return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          }
          const numA = Number(aVal);
          const numB = Number(bVal);
          if (numA < numB) return sortDirection === "asc" ? -1 : 1;
          if (numA > numB) return sortDirection === "asc" ? 1 : -1;
          return 0;
        });
      }

      // Pagination côté "serveur"
      const startIndex = (currentPage - 1) * pageSize;
      const paginated = sorted.slice(startIndex, startIndex + pageSize);

      setData(paginated);
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [currentPage, pageSize, sortColumn, sortDirection]);

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-900/50">
        📡 <strong>Simulation Supabase / API :</strong> Les opérations de tri, de pagination et de chargement (délai de 500ms) sont entièrement gérées à
        l&apos;extérieur de la table.
      </div>
      <DataTable
        data={data}
        config={{ columns, getRowId: (row: UserData) => row.id, defaultPageSize: pageSize, pageSizeOptions: [5, 10, 20, 50] }}
        isLoading={isLoading}
        totalRows={mockData50.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={size => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={(col, dir) => {
          setSortColumn(col);
          setSortDirection(dir);
        }}
      />
    </div>
  );
};

export const ServerSideSupabaseMock: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Simule le fonctionnement avec une base de données distante (Supabase/API). La table ne reçoit que les lignes de la page active et délègue le tri et la pagination au parent via des callbacks.",
      },
    },
  },
  render: () => <ServerSideDataTableWrapper />,
};
