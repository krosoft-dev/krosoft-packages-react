import { formatNumber } from "@krosoft/core/helpers";
import React from "react";
import { cn } from "@/helpers/tailwind.helper";
import { Skeleton } from "../../ui";

interface KpiCardValueProps {
  value: number | string | Date;
  valueClassName?: string;
  description?: string;
  descriptionClassName?: string;
  isLoading?: boolean;
  error?: string | null;
}

/** Valeur et description d'un KPI, avec ses états de chargement et d'erreur. Partagé par `KpiCard` et `KpiMultiCard`. */
export const KpiCardValue = ({ value, valueClassName, description, descriptionClassName, isLoading, error }: KpiCardValueProps): React.ReactElement => {
  if (isLoading) {
    return (
      <>
        <Skeleton className="h-8 w-24 mb-1" />
        <Skeleton className="h-3 w-32" />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="text-2xl font-bold text-destructive">—</div>
        <p className="text-xs text-destructive">{error}</p>
      </>
    );
  }

  return (
    <>
      <div className={cn("text-2xl font-bold", valueClassName)}>
        {typeof value === "number" ? formatNumber(value) : value instanceof Date ? value.toLocaleDateString() : value}
      </div>
      <p className={cn("text-xs text-muted-foreground", descriptionClassName)}>{description}</p>
    </>
  );
};
