import type { DataTableMessages } from "./DataTableMessages";

/**
 * Options de comportement/présentation du `DataTable`, regroupées en un seul objet.
 *
 * Destinée à accueillir progressivement les réglages aujourd'hui passés à plat en props
 * (bordered, colonnes figées…).
 *
 * Le paramètre générique `T` est conservé dès maintenant : les prochains réglages
 * (rendu de ligne conditionnel, etc.) dépendront du type de la donnée.
 */
export interface DataTableConfig<T> {
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
