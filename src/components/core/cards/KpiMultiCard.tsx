import React from "react";
import { useKrosoftTranslation } from "@/i18n";
import { cn } from "@/helpers/tailwind.helper";
import { Card, CardTitle } from "../../ui";
import { KpiCardProps } from "./KpiCard";
import { KpiCardValue } from "./KpiCardValue";

type P = KpiCardProps;

/** 2, 4, 6 ou 8 compteurs : le nombre pilote la grille. */
export type KpiMultiCardItems = [P, P] | [P, P, P, P] | [P, P, P, P, P, P] | [P, P, P, P, P, P, P, P];

/**
 * Grille selon le nombre de compteurs. Les classes sont écrites en toutes lettres : Tailwind ne détecte pas les noms
 * construits dynamiquement. Surchargeables via `className` (tailwind-merge).
 */
const GRID_CLASSES: Record<KpiMultiCardItems["length"], string> = {
  2: "grid-cols-2",
  4: "grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 xl:grid-cols-6",
  8: "grid-cols-2 md:grid-cols-4",
};

export interface KpiMultiCardProps {
  /** Les compteurs liés, dans l'ordre d'affichage. Chacun garde son propre clic, chargement et erreur. */
  items: KpiMultiCardItems;
  /** Chargement commun, appliqué aux compteurs qui ne précisent pas le leur. */
  isLoading?: boolean;
  /** Erreur commune, appliquée aux compteurs qui ne précisent pas la leur. */
  error?: string | null;
  className?: string;
}

/**
 * Plusieurs KPI liés (2, 4, 6 ou 8) dans une même carte, séparés par un trait fin. Chaque case reprend le rendu de `KpiCard`.
 * Les traits sont l'espace d'un pixel entre les cases sur fond de bordure : ils restent justes quand la grille passe à la ligne.
 */
export const KpiMultiCard = ({ items, isLoading, error, className }: KpiMultiCardProps): React.ReactElement => {
  const { t } = useKrosoftTranslation();

  return (
    <Card className={cn("grid gap-px overflow-hidden bg-border", GRID_CLASSES[items.length], className)}>
      {items.map(({ titleKey, value, valueClassName, icon: Icon, iconClassName, description, descriptionClassName, onClick, ...item }) => {
        const isClickable = onClick !== undefined;

        return (
          <div
            key={titleKey}
            className={cn("min-w-0 bg-card", isClickable ? "cursor-pointer hover:rounded-surface hover:ring-1 hover:ring-inset hover:ring-primary" : "")}
            onClick={onClick}
            onKeyDown={
              isClickable
                ? event => {
                    if (event.key === "Enter") {
                      onClick();
                    }
                  }
                : undefined
            }
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
          >
            <div className="flex flex-row items-center justify-between gap-2 p-6 pb-2">
              <CardTitle className="truncate text-sm font-medium">{t(titleKey)}</CardTitle>
              <Icon className={cn("size-6 shrink-0 text-muted-foreground", iconClassName)} />
            </div>
            <div className="p-6 pt-0">
              <KpiCardValue
                value={value}
                valueClassName={valueClassName}
                description={description}
                descriptionClassName={descriptionClassName}
                isLoading={item.isLoading ?? isLoading}
                error={item.error !== undefined ? item.error : error}
              />
            </div>
          </div>
        );
      })}
    </Card>
  );
};
