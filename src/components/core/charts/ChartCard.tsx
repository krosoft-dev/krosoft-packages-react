import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/helpers/tailwind.helper";
import * as React from "react";

export interface ChartCardProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  /** Contenu aligné à droite de l'en-tête : filtre de période, bascule détaillé/agrégé… */
  actions?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyLabel?: string;
  /**
   * Hauteur de la zone de rendu, en pixels. Appliquée en style inline et non en
   * classe Tailwind : une classe arbitraire construite dynamiquement ne serait
   * jamais générée dans le CSS du projet consommateur.
   */
  height?: number;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

/**
 * Carte d'accueil d'un graphe : en-tête (titre, description, icône, actions) et
 * zone de rendu à hauteur fixe qui gère elle-même les états de chargement et
 * d'absence de données.
 *
 * Le graphe passé en `children` remplit la zone via `ChartContainer` en
 * `aspect-auto h-full w-full` — la carte ne monte pas de `ResponsiveContainer`,
 * c'est `ChartContainer` qui s'en charge.
 */
export const ChartCard = ({
  title,
  description,
  icon,
  actions,
  isLoading = false,
  isEmpty = false,
  emptyLabel = "Aucune donnée disponible",
  height = 300,
  className,
  contentClassName,
  children,
}: ChartCardProps): React.JSX.Element => {
  const Icon = icon;

  const renderContent = (): React.ReactNode => {
    if (isLoading) {
      return <Skeleton className="size-full rounded-surface" />;
    }

    if (isEmpty) {
      return (
        <div className="flex size-full items-center justify-center">
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        </div>
      );
    }

    return children;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2">
              {Icon && <Icon className="size-5 shrink-0" />}
              <span className="truncate">{title}</span>
            </CardTitle>
            {description !== undefined && description !== "" ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {actions !== undefined && actions !== null ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("w-full", contentClassName)} style={{ height }}>
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
};
