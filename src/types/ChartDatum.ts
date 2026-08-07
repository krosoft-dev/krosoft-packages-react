/**
 * Point de données commun à tous les graphes du package.
 *
 * Les projets déclaraient chacun leur variante (`DataChart`, `IChartValue`,
 * `ChartValue`, `ChartDatum`…) pour la même forme `{ name, value }` : ce type
 * les remplace toutes.
 */
export interface ChartDatum {
  /** Libellé de la catégorie, affiché sur l'axe, dans la légende et le tooltip. */
  name: string;
  /** Valeur portée par la barre, la part ou le point. */
  value: number;
  /**
   * Couleur imposée pour ce point. À défaut, les graphes qui colorent chaque
   * donnée séparément (camembert, anneau) piochent dans `CHART_COLORS`.
   */
  color?: string;
}
