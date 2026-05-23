import type { Meta, StoryObj } from "@storybook/react";
import DataTable, { ColumnDef } from "@/components/core/table/DataTable";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { PencilIcon, TrashIcon } from "lucide-react";

const meta: Meta<typeof DataTable> = {
  title: "Core/Table/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Le composant `DataTable` permet d'afficher des données sous forme de tableau avec des fonctionnalités avancées (tri, sélection, menu d'actions).\n\n### Fonctionnalités\n\n- **Tri** : Activez le tri colonne par colonne avec `sortable: true` dans `ColumnDef`. Un icône `↕` apparaît sur les colonnes triables ; `↑`/`↓` indique la colonne et le sens actifs.\n- **Réorganisation des colonnes** : Glissez et déposez l'icône de poignée dans l'en-tête.\n- **Désactivation du glisser-déposer** : Vous pouvez figer toutes les colonnes en passant `draggableColumns={false}` au composant.\n- **Redimensionnement des colonnes** : Survoler le bord droit de l'en-tête d'une colonne pour la redimensionner. Vous pouvez désactiver cette option en passant `resizableColumns={false}` au composant.",
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
    label: "Name",
    minWidth: 150,
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    minWidth: 200,
    sortable: true,
  },
  {
    key: "role",
    label: "Role",
    minWidth: 100,
    renderCell: row => <span className="capitalize">{row.role}</span>,
  },
  {
    key: "status",
    label: "Status",
    minWidth: 100,
    renderCell: row => <Badge variant={row.status === "active" ? "default" : "secondary"}>{row.status === "active" ? "Active" : "Inactive"}</Badge>,
  },
  {
    key: "lastLogin",
    label: "Last Login",
    minWidth: 150,
    sortable: true,
    renderCell: row => new Date(row.lastLogin).toLocaleDateString(),
  },
];

type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
  },
};

export const WithRowClick: Story = {
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
    onRowClick: (row: UserData) => {
      console.warn(`Clicked on row: ${row.name}`);
    },
  },
};

export const NonDraggable: Story = {
  parameters: {
    docs: {
      description: {
        story: "Désactive le glisser-déposer et masque les icônes de poignée pour l'ensemble du tableau en définissant `draggableColumns: false`.",
      },
    },
  },
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
    draggableColumns: false,
  },
};

export const NonResizable: Story = {
  parameters: {
    docs: {
      description: {
        story: "Désactive le redimensionnement des colonnes pour l'ensemble du tableau en définissant `resizableColumns: false`.",
      },
    },
  },
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
    resizableColumns: false,
  },
};

export const WithActions: Story = {
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
    actions: [
      {
        label: "Modifier",
        icon: PencilIcon,
        onClick: (row: UserData): void => {
          console.warn(`Edit row: ${row.name}`);
        },
      },
      {
        label: "Supprimer",
        icon: TrashIcon,
        className: "text-destructive focus:bg-destructive/10 focus:text-destructive",
        onClick: (row: UserData): void => {
          console.warn(`Delete row: ${row.name}`);
        },
      },
    ],
  },
};

export const WithBulkActions: Story = {
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
    bulkActions: [
      {
        label: "Activate Selected",
        onClick: (selectedIds: string[], clearSelection: () => void): void => {
          console.warn(`Activating users with IDs: ${selectedIds.join(", ")}`);
          clearSelection();
        },
      },
      {
        label: "Delete Selected",
        variant: "destructive",
        onClick: (selectedIds: string[], clearSelection: () => void): void => {
          console.warn(`Deleting users with IDs: ${selectedIds.join(", ")}`);
          clearSelection();
        },
      },
    ],
  },
};

export const WithNoData: Story = {
  args: {
    data: [],
    columns,
    getRowId: (row: UserData) => row.id,
  },
};

export const WithNoDataCustomMessage: Story = {
  args: {
    data: [],
    columns,
    getRowId: (row: UserData) => row.id,
    noDataMessage: "Aucun utilisateur trouvé dans la base de données.",
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns,
    getRowId: (row: UserData) => row.id,
    isLoading: true,
  },
};

export const CustomPageSize: Story = {
  args: {
    data: mockData50,
    columns,
    getRowId: (row: UserData) => row.id,
    defaultPageSize: 5,
    pageSizeOptions: [5, 10, 25, 50],
  },
};

export const FullFeatured: Story = {
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
    onRowClick: (row: UserData) => {
      console.warn(`Clicked on row: ${row.name}`);
    },
    actions: [
      {
        label: "Modifier",
        icon: PencilIcon,
        onClick: (row: UserData): void => {
          console.warn(`Edit row: ${row.name}`);
        },
      },
      {
        label: "Supprimer",
        icon: TrashIcon,
        className: "text-destructive focus:bg-destructive/10 focus:text-destructive",
        onClick: (row: UserData): void => {
          console.warn(`Delete row: ${row.name}`);
        },
      },
    ],
    bulkActions: [
      {
        label: "Export Selected",
        onClick: (selectedIds: string[], clearSelection: () => void): void => {
          console.warn(`Exporting users with IDs: ${selectedIds.join(", ")}`);
          clearSelection();
        },
      },
      {
        label: "Delete Selected",
        variant: "destructive",
        onClick: (selectedIds: string[], clearSelection: () => void): void => {
          console.warn(`Deleting users with IDs: ${selectedIds.join(", ")}`);
          clearSelection();
        },
      },
    ],
  },
};

export const WithoutColumnVisibility: Story = {
  parameters: {
    docs: {
      description: {
        story: "Le bouton de visibilité des colonnes est masqué via `columnVisibility={false}`.",
      },
    },
  },
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
    columnVisibility: false,
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
    columns,
    getRowId: (row: UserData) => row.id,
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
    columns: columns.map(col => ({ ...col, sortable: true })),
    getRowId: (row: UserData) => row.id,
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
    columns: columns.map(({ sortable: _sortable, ...col }) => col),
    getRowId: (row: UserData) => row.id,
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
    data: mockData50,
    columns,
    getRowId: (row: UserData) => row.id,
  },
};
