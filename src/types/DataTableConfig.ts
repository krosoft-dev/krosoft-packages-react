import React from "react";
import type { BulkAction } from "./BulkAction";
import type { ColumnDef } from "./ColumnDef";
import type { DataTableMessages } from "./DataTableMessages";
import type { RowAction } from "./RowAction";

/**
 * Options de comportement/présentation du `DataTable`, regroupées en un seul objet.
 *
 * Seuls les données et l'état contrôlé (data, isLoading, error, pagination/tri server-side)
 * restent passés à plat en props.
 */
export interface DataTableConfig<T> {
  /** Définition des colonnes du tableau. */
  columns: ColumnDef<T>[];
  /** Retourne la clé unique de la ligne (key React, sélection). */
  rowKey: (row: T) => string;
  onRowClick?: (row: T, event: React.MouseEvent<HTMLTableRowElement>) => void;
  /** Retourne l'URL de destination de la ligne au clic (prioritaire sur onRowClick). */
  onRowNavigate?: (row: T) => string;
  /** Actions par ligne, affichées en ligne ou dans le menu kebab (`overflow`). */
  actions?: RowAction<T>[];
  /** Actions rapides sur la sélection multiple. */
  bulkActions?: BulkAction[];
  /** Nombre de lignes par page au premier affichage. */
  defaultPageSize?: number;
  /** Options proposées pour le nombre de lignes par page. */
  pageSizeOptions?: number[];
  /** Réduit la hauteur des lignes pour un affichage compact. */
  dense?: boolean;
  /** Affiche les bordures entre colonnes. */
  bordered?: boolean;
  /** Active le glisser-déposer des colonnes. */
  draggableColumns?: boolean;
  /** Active le redimensionnement des colonnes. */
  resizableColumns?: boolean;
  /** Affiche le bouton de gestion de la visibilité des colonnes. */
  columnVisibility?: boolean;
  /** Fige la colonne des actions (et du réglage des colonnes) sur le bord droit. */
  fixedActions?: boolean;
  /** Clés i18n des messages d'état (vide, chargement). */
  messages?: DataTableMessages;
}
