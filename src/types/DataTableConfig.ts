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
  /** Clés i18n des messages d'état (vide, chargement). */
  messages?: DataTableMessages;
}
