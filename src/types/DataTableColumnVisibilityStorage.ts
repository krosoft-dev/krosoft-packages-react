import type { DataTableColumnVisibilityState } from "./DataTableColumnVisibilityState";

/**
 * Stockage du choix des colonnes côté navigateur (localStorage, sessionStorage, clé par utilisateur…).
 *
 * Volontairement synchrone : lu une fois au montage, écrit à chaque changement. Pour une persistance
 * asynchrone (base de données), passer plutôt par le mode contrôlé (`columnVisibilityState` +
 * `onColumnVisibilityChange`), où l'application gère elle-même chargement et erreurs.
 *
 * Une implémentation doit absorber ses propres erreurs : `read` renvoie `undefined` quand rien n'est
 * lisible, et `write` ne doit pas lever d'exception.
 */
export interface DataTableColumnVisibilityStorage {
  read: () => DataTableColumnVisibilityState | undefined;
  write: (state: DataTableColumnVisibilityState) => void;
}
