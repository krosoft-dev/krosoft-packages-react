import * as React from "react";

/**
 * Construit le `formatter` de `ChartTooltipContent` pour afficher une valeur
 * formatée (devise, pourcentage, durée…) plutôt que le `toLocaleString()` par
 * défaut de shadcn.
 *
 * Renvoie `undefined` quand aucun formatage n'est demandé, pour laisser le
 * rendu natif — y compris l'indicateur de couleur, que `formatter` remplace.
 *
 * @param valueFormatter Mise en forme de la valeur numérique.
 * @param label Libellé affiché à gauche. À défaut, le nom de la série.
 */
export const buildTooltipValueFormatter = (
  valueFormatter?: (value: number) => string,
  label?: string,
): ((value: unknown, name: unknown) => React.ReactNode) | undefined => {
  if (!valueFormatter) {
    return undefined;
  }

  const ChartTooltipValue = (value: unknown, name: unknown): React.ReactNode => (
    <div className="flex flex-1 justify-between gap-4">
      <span className="text-muted-foreground">{label ?? String(name)}</span>
      <span className="font-mono font-medium tabular-nums text-foreground">{valueFormatter(Number(value))}</span>
    </div>
  );

  return ChartTooltipValue;
};
