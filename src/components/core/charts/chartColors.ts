/**
 * Palette par défaut des graphes, appliquée dans l'ordre aux données qui ne
 * portent pas de couleur explicite.
 *
 * Les variables sont déclarées dans `styles/globals.css` sur `:root` uniquement :
 * ces teintes sont choisies pour rester lisibles aussi bien sur fond clair que
 * sur les thèmes sombres, sans avoir à être redéfinies par chacun d'eux. Un
 * projet qui veut sa propre palette surcharge `--k-chart-1` … `--k-chart-5`.
 */
export const CHART_COLORS = [
  "hsl(var(--k-chart-1))",
  "hsl(var(--k-chart-2))",
  "hsl(var(--k-chart-3))",
  "hsl(var(--k-chart-4))",
  "hsl(var(--k-chart-5))",
] as const;

/** Couleur de la palette pour un index de série, en boucle au-delà de 5 entrées. */
export const getChartColor = (index: number): string => CHART_COLORS[index % CHART_COLORS.length];
