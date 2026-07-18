import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, ColumnDef } from "@/components/core/table/DataTable";
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
          "Le composant `DataTable` permet d'afficher des données sous forme de tableau avec des fonctionnalités avancées (tri, sélection, menu d'actions).\n\n### Fonctionnalités\n\n- **Tri** : Activez le tri colonne par colonne avec `sortable: true` dans `ColumnDef`. Un icône `↕` apparaît sur les colonnes triables ; `↑`/`↓` indique la colonne et le sens actifs.\n- **Réorganisation des colonnes** : Glissez et déposez l'icône de poignée dans l'en-tête.\n- **Désactivation du glisser-déposer** : Vous pouvez figer toutes les colonnes en passant `draggableColumns={false}` au composant.\n- **Redimensionnement des colonnes** : Survoler le bord droit de l'en-tête d'une colonne pour la redimensionner. Vous pouvez désactiver cette option en passant `resizableColumns={false}` au composant.\n- **Style de colonne** : `className` sur un `ColumnDef` s'applique à l'en-tête et à chaque cellule de la colonne.\n- **Actions de ligne** : les entrées de `actions` s'affichent en ligne par défaut ; `overflow: true` les déplace dans le menu kebab. `visible(row)` masque une action au cas par cas, `disabled(row)` la désactive sans la masquer, `variant` contrôle son style de bouton.",
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
        variant: "destructive",
        onClick: (row: UserData): void => {
          console.warn(`Delete row: ${row.name}`);
        },
      },
    ],
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
        label: "Dupliquer",
        onClick: (row: UserData): void => {
          console.warn(`Duplicate row: ${row.name}`);
        },
        overflow: true,
      },
      {
        label: "Supprimer",
        icon: TrashIcon,
        className: "text-destructive focus:bg-destructive/10 focus:text-destructive",
        onClick: (row: UserData): void => {
          console.warn(`Delete row: ${row.name}`);
        },
        overflow: true,
      },
    ],
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
    columns,
    getRowId: (row: UserData) => row.id,
    actions: [
      {
        label: "Modifier",
        icon: PencilIcon,
        disabled: (row: UserData) => row.role === "admin",
        onClick: (row: UserData): void => {
          console.warn(`Edit row: ${row.name}`);
        },
      },
      {
        label: "Supprimer",
        icon: TrashIcon,
        variant: "destructive",
        visible: (row: UserData) => row.status === "inactive",
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
    columns: columns.map(col => (col.key === "lastLogin" ? { ...col, className: "text-right text-muted-foreground" } : col)),
    getRowId: (row: UserData) => row.id,
    onRowClick: (row: UserData) => {
      console.warn(`Clicked on row: ${row.name}`);
    },
    actions: [
      {
        label: "Modifier",
        icon: PencilIcon,
        disabled: (row: UserData) => row.role === "admin",
        onClick: (row: UserData): void => {
          console.warn(`Edit row: ${row.name}`);
        },
      },
      {
        label: "Supprimer",
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

export const WithColumnClassName: Story = {
  parameters: {
    docs: {
      description: {
        story: "`className` sur un `ColumnDef` s'applique à l'en-tête et à chaque cellule de la colonne (ici **Last Login** est aligné à droite).",
      },
    },
  },
  args: {
    data: mockData,
    columns: columns.map(col => (col.key === "lastLogin" ? { ...col, className: "text-right text-muted-foreground" } : col)),
    getRowId: (row: UserData) => row.id,
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
    data: mockData50.slice(0, 50),
    columns,
    getRowId: (row: UserData) => row.id,
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
        columns={columns}
        getRowId={(row: UserData) => row.id}
        isLoading={isLoading}
        totalRows={mockData50.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        defaultPageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50]}
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
