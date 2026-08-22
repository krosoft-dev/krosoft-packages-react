import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useServerTable } from "@/hooks/ui/useServerTable";

interface Filters {
  role: string;
  status: string;
}

const initialFilters: Filters = { role: "", status: "" };

/**
 * Demo component that shows the useServerTable hook managing server-side table state.
 */
const UseServerTableDemo = (): React.ReactElement => {
  const table = useServerTable<Filters>(initialFilters, "nom", {
    initialPageSize: 10,
    debounceMs: 300,
  });

  return (
    <div className="flex flex-col gap-4 p-4 w-full max-w-md">
      <div className="rounded-md border p-3 space-y-1 text-xs text-muted-foreground">
        <p>
          currentPage: <strong>{table.currentPage}</strong>
        </p>
        <p>
          pageSize: <strong>{table.pageSize}</strong>
        </p>
        <p>
          sortColumn: <strong>{table.sortColumn ?? "null"}</strong>
        </p>
        <p>
          sortDirection: <strong>{table.sortDirection}</strong>
        </p>
        <p>
          searchText: <strong>"{table.searchText}"</strong>
        </p>
        <p>
          debouncedSearchText: <strong>"{table.debouncedSearchText}"</strong>
        </p>
        <p>
          appliedFilters: <strong>{JSON.stringify(table.appliedFilters)}</strong>
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium block mb-1">Recherche</label>
          <input
            className="w-full rounded-md border px-3 py-1.5 text-sm"
            placeholder="Rechercher..."
            value={table.searchText}
            onChange={e => table.onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium block mb-1">Rôle</label>
            <select
              className="w-full rounded-md border px-3 py-1.5 text-sm"
              value={table.appliedFilters.role}
              onChange={e => table.onFiltersChange({ ...table.appliedFilters, role: e.target.value })}
            >
              <option value="">Tous</option>
              <option value="admin">Admin</option>
              <option value="user">Utilisateur</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium block mb-1">Statut</label>
            <select
              className="w-full rounded-md border px-3 py-1.5 text-sm"
              value={table.appliedFilters.status}
              onChange={e => table.onFiltersChange({ ...table.appliedFilters, status: e.target.value })}
            >
              <option value="">Tous</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-md border text-sm hover:bg-muted/80"
            onClick={() => table.onSortChange("nom", table.sortDirection === "asc" ? "desc" : "asc")}
          >
            Inverser le tri ({table.sortDirection})
          </button>
          <button className="px-3 py-1.5 rounded-md border text-sm hover:bg-muted/80" onClick={() => table.onPageSizeChange(table.pageSize === 10 ? 25 : 10)}>
            Page size: {table.pageSize}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            className="px-2 py-1 rounded border text-sm disabled:opacity-50"
            disabled={table.currentPage <= 1}
            onClick={() => table.onPageChange(p => p - 1)}
          >
            ← Précédent
          </button>
          <span className="px-2 py-1 text-sm">Page {table.currentPage}</span>
          <button className="px-2 py-1 rounded border text-sm" onClick={() => table.onPageChange(p => p + 1)}>
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof UseServerTableDemo> = {
  title: "Hooks/useServerTable",
  component: UseServerTableDemo,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof UseServerTableDemo>;

/**
 * Démonstration de useServerTable avec recherche debounced,
 * filtres, tri et pagination côté serveur.
 */
export const Default: Story = {};
