import React from "react";
import { cn } from "@/helpers/tailwind.helper";
import { KpiCardProps, KpiCard } from "./KpiCard";

/**
 * Nombre de colonnes possibles au point de rupture `lg`. Les classes doivent être écrites en
 * toutes lettres : Tailwind ne détecte pas les noms de classes construits dynamiquement.
 */
const GRID_COLUMNS_CLASSES: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

/** Nombre de colonnes par défaut, conservé pour ne pas modifier la mise en page existante. */
const DEFAULT_COLUMNS = 4;

interface KpiCardsProps {
  stats: KpiCardProps[];
  /** Nombre de colonnes affichées au point de rupture `lg` (1 à 6). Par défaut 4. */
  columns?: number;
  isLoading?: boolean;
  error?: string | null;
}

export const KpiCards = ({ stats, columns = DEFAULT_COLUMNS, isLoading, error }: KpiCardsProps): React.JSX.Element => (
  <div className={cn("grid gap-6 md:grid-cols-2", GRID_COLUMNS_CLASSES[columns] ?? GRID_COLUMNS_CLASSES[DEFAULT_COLUMNS])}>
    {stats.map(stat => (
      <KpiCard
        key={stat.titleKey}
        titleKey={stat.titleKey}
        value={stat.value}
        valueClassName={stat.valueClassName}
        icon={stat.icon}
        iconClassName={stat.iconClassName}
        description={stat.description}
        descriptionClassName={stat.descriptionClassName}
        onClick={stat.onClick}
        isLoading={isLoading}
        error={error}
      />
    ))}
  </div>
);
