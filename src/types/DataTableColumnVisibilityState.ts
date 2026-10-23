/**
 * Visibilité choisie par l'utilisateur, colonne par colonne : clé de colonne → affichée ou non.
 *
 * Seules les colonnes que l'utilisateur a basculées y figurent : une colonne absente suit son
 * `defaultVisible`. Une colonne ajoutée plus tard prend donc son état par défaut au lieu d'être
 * masquée d'office, et une clé qui ne correspond plus à aucune colonne est simplement ignorée.
 */
export type DataTableColumnVisibilityState = Record<string, boolean>;
