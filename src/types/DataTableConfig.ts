import React from "react";
import type { ColumnDef } from "./ColumnDef";
import type { DataTableMessages } from "./DataTableMessages";

/**
 * Options de comportement/présentation du `DataTable`, regroupées en un seul objet.
 *
 * Destinée à accueillir progressivement les réglages aujourd'hui passés à plat en props
 * (bordered, colonnes figées…).
 */
export interface DataTableConfig<T> {
  /** Définition des colonnes du tableau. */
  columns: ColumnDef<T>[];
  /** Identifie chaque ligne de façon unique. */
  getRowId: (row: T) => string;
  onRowClick?: (row: T, event: React.MouseEvent<HTMLTableRowElement>) => void;
  /** Retourne l'URL de destination de la ligne au clic (prioritaire sur onRowClick). */
  onRowNavigate?: (row: T) => string;
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
