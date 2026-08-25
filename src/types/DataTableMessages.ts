/**
 * Clés i18n des messages d'état du `DataTable`, résolues dans le namespace de
 * l'application (comme `labelKey`/`titleKey`). Non fournies, le tableau retombe
 * sur les libellés par défaut du package.
 */
export interface DataTableMessages {
  /** Clé i18n du message affiché quand le tableau ne contient aucune donnée. */
  emptyKey?: string;
  /** Clé i18n du message affiché pendant le chargement des données. */
  loadingKey?: string;
}
