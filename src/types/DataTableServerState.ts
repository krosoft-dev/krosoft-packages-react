/**
 * État contrôlé du `DataTable` en mode server-side : la pagination (et le tri
 * s'il est délégué) sont pilotés par le parent, qui recharge les données à
 * chaque changement. La présence de cet objet active le mode server-side.
 *
 * Le retour de `useServerTable` s'emboîte directement : `server={{ ...table, totalRows }}`.
 */
export interface DataTableServerState {
  /** Nombre total de lignes côté serveur (toutes pages confondues). */
  totalRows: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  /** Tri server-side (optionnel) : sans onSortChange, le tri reste local. */
  sortColumn?: string | null;
  sortDirection?: "asc" | "desc";
  onSortChange?: (column: string | null, direction: "asc" | "desc") => void;
}
