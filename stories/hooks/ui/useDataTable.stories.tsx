import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useDataTable } from "@/hooks/ui/useDataTable";
import type { ColumnDef } from "@/types/ColumnDef";

interface User {
  id: string;
  nom: string;
  email: string;
  role: string;
}

const sampleData: User[] = [
  { id: "1", nom: "Dupont", email: "dupont@example.com", role: "Admin" },
  { id: "2", nom: "Martin", email: "martin@example.com", role: "Utilisateur" },
  { id: "3", nom: "Bernard", email: "bernard@example.com", role: "Éditeur" },
  { id: "4", nom: "Petit", email: "petit@example.com", role: "Utilisateur" },
  { id: "5", nom: "Robert", email: "robert@example.com", role: "Admin" },
  { id: "6", nom: "Richard", email: "richard@example.com", role: "Éditeur" },
  { id: "7", nom: "Durand", email: "durand@example.com", role: "Utilisateur" },
  { id: "8", nom: "Leroy", email: "leroy@example.com", role: "Admin" },
];

const columns: ColumnDef<User>[] = [
  { key: "nom", headerKey: "Nom", sortable: true, minWidth: 150 },
  { key: "email", headerKey: "Email", sortable: true, minWidth: 200 },
  { key: "role", headerKey: "Rôle", sortable: true, minWidth: 120 },
];

/**
 * Demo component that shows the useDataTable hook managing table state.
 */
const UseDataTableDemo = ({ defaultPageSize }: { defaultPageSize: number }): React.ReactElement => {
  const table = useDataTable<User>({
    data: sampleData,
    columns,
    getRowId: row => row.id,
    defaultPageSize,
  });

  return (
    <div className="flex flex-col gap-4 p-4 w-full max-w-2xl">
      <div className="rounded-md border p-3 space-y-1 text-xs text-muted-foreground">
        <p>
          sortColumn: <strong>{table.sortColumn ?? "null"}</strong>
        </p>
        <p>
          sortDirection: <strong>{table.sortDirection}</strong>
        </p>
        <p>
          currentPage: <strong>{table.currentPage}</strong> / {table.totalPages}
        </p>
        <p>
          pageSize: <strong>{table.pageSize}</strong>
        </p>
        <p>
          visibleColumns: <strong>{table.visibleColumnsArray.map(c => c.key).join(", ")}</strong>
        </p>
      </div>

      <table ref={table.tableRef} className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {table.visibleColumnsArray.map(col => (
              <th
                key={col.key}
                className="px-3 py-2 text-left font-medium cursor-pointer hover:bg-muted/80 select-none"
                style={{ width: table.columnWidths[col.key] }}
                onClick={() => table.handleSort(col.key)}
              >
                <span className="flex items-center gap-1">
                  {col.headerKey}
                  {table.sortColumn === col.key && <span className="text-xs">{table.sortDirection === "asc" ? "▲" : "▼"}</span>}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.paginatedData.map(row => (
            <tr key={row.id} className="border-b hover:bg-muted/30">
              {table.visibleColumnsArray.map(col => (
                <td key={col.key} className="px-3 py-2">
                  {col.renderCell ? col.renderCell(row) : String(row[col.key as keyof User])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {table.startIndex + 1}–{table.endIndex} sur {sampleData.length}
        </span>
        <div className="flex gap-2">
          <button className="px-2 py-1 rounded border disabled:opacity-50" disabled={table.currentPage <= 1} onClick={() => table.setCurrentPage(p => p - 1)}>
            ← Précédent
          </button>
          <button
            className="px-2 py-1 rounded border disabled:opacity-50"
            disabled={table.currentPage >= table.totalPages}
            onClick={() => table.setCurrentPage(p => p + 1)}
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof UseDataTableDemo> = {
  title: "Hooks/useDataTable",
  component: UseDataTableDemo,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    defaultPageSize: {
      control: { type: "number", min: 1, max: 10 },
      description: "Nombre de lignes par page",
    },
  },
};

export default meta;
type Story = StoryObj<typeof UseDataTableDemo>;

/**
 * Utilisation par défaut avec pagination et tri.
 */
export const Default: Story = {
  args: {
    defaultPageSize: 3,
  },
};

/**
 * Affichage de toutes les lignes sur une seule page.
 */
export const SinglePage: Story = {
  args: {
    defaultPageSize: 10,
  },
};
