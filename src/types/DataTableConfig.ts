import React from "react";
import type { DataTableBulkAction } from "./DataTableBulkAction";
import type { DataTableColumn } from "./DataTableColumn";
import type { DataTableMessages } from "./DataTableMessages";
import type { DataTableRowAction } from "./DataTableRowAction";

/**
 * Options de comportement/présentation du `DataTable`, regroupées en un seul objet.
 *
 * Seuls les données et l'état contrôlé (data, isLoading, error, pagination/tri server-side)
 * restent passés à plat en props.
 */
export interface DataTableConfig<T> {
  /** Définition des colonnes du tableau. */
  columns: DataTableColumn<T>[];
  /** Retourne la clé unique de la ligne (key React, sélection). */
  rowKey: (row: T) => string;
  /**
   * Autorise ou non la sélection d'une ligne (cases à cocher + « tout sélectionner »).
   * Une ligne non sélectionnable a sa case désactivée et est ignorée par le « tout sélectionner ».
   * Par défaut toutes les lignes sont sélectionnables.
   */
  rowSelectable?: (row: T) => boolean;
  onRowClick?: (row: T, event: React.MouseEvent<HTMLTableRowElement>) => void;
  /**
   * Retourne l'URL de destination de la ligne au clic (prioritaire sur onRowClick).
   * Une ligne non navigable (voir `rowNavigable`) perd son curseur de lien et son clic retombe sur `onRowClick`.
   */
  onRowNavigate?: (row: T) => string;
  /**
   * Autorise ou non la navigation au clic sur une ligne (`onRowNavigate`).
   * Une ligne non navigable perd son curseur de lien et son clic retombe sur `onRowClick`.
   * Par défaut toutes les lignes sont navigables.
   */
  rowNavigable?: (row: T) => boolean;
  /** Actions par ligne, affichées en ligne ou dans le menu kebab (`overflow`). */
  actions?: DataTableRowAction<T>[];
  /** Actions rapides sur la sélection multiple. */
  bulkActions?: DataTableBulkAction<T>[];
  /** Nombre de lignes par page au premier affichage. */
  pageSizeDefault?: number;
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
