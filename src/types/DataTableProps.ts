import { BulkAction } from "./BulkAction";
import { ColumnDef } from "./ColumnDef";
import { RowAction } from "./RowAction";

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string; // Fonction obligatoire pour identifier chaque ligne de façon unique
  onRowClick?: (row: T) => void;
  actions?: RowAction<T>[]; // Actions personnalisées pour le menu
  bulkActions?: BulkAction[]; // Actions rapides pour la sélection multiple
  draggableColumns?: boolean; // Permet d'activer/désactiver le drag and drop des colonnes
  resizableColumns?: boolean; // Permet d'activer/désactiver le redimensionnement des colonnes
  isLoading?: boolean; // Indique si les données sont en cours de chargement
  noDataMessage?: string; // Message affiché lorsque le tableau est vide
  defaultPageSize?: number; // Nombre par défaut de lignes par page
  pageSizeOptions?: number[]; // Options pour le nombre de lignes par page
}
