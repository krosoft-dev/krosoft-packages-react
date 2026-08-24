import { cn } from "@/helpers/tailwind.helper";
import * as React from "react";

export interface CircularGaugeThresholds {
  /** Pourcentage de remplissage à partir duquel la jauge passe en warning. */
  warning: number;
  /** Pourcentage de remplissage à partir duquel la jauge passe en destructive. */
  danger: number;
}

export interface CircularGaugeProps {
  value: number;
  /** Valeur correspondant à une jauge pleine. */
  max?: number;
  /** Diamètre extérieur, en pixels. */
  size?: number;
  /** Épaisseur de l'anneau, en pixels. */
  strokeWidth?: number;
  /** Libellé sous la jauge. */
  label?: string;
  /** Unité affichée sous la valeur. */
  unit?: string;
  /**
   * Couleur fixe de l'anneau. À défaut, la couleur est déduite du taux de
   * remplissage via `thresholds`.
   */
  color?: string;
  /** Seuils de bascule de couleur, ignorés si `color` est fourni. */
  thresholds?: CircularGaugeThresholds;
  /** Mise en forme de la valeur affichée au centre. Une décimale par défaut. */
  valueFormatter?: (value: number) => string;
  className?: string;
}

const DEFAULT_THRESHOLDS: CircularGaugeThresholds = { warning: 50, danger: 80 };

const getThresholdColor = (percentage: number, thresholds: CircularGaugeThresholds): string => {
  if (percentage >= thresholds.danger) return "hsl(var(--destructive))";
  if (percentage >= thresholds.warning) return "hsl(var(--k-warning))";
  return "hsl(var(--k-success))";
};

/**
 * Jauge circulaire d'une valeur rapportée à un maximum, en SVG.
 *
 * Sans `color`, l'anneau vire au warning puis au destructive selon `thresholds` —
 * pour un indicateur où monter est mauvais (CPU, mémoire, disque). Pour un
 * indicateur neutre ou où monter est bon, passer une `color` explicite.
 */
export const CircularGauge = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  unit = "%",
  color,
  thresholds = DEFAULT_THRESHOLDS,
  valueFormatter = current => current.toFixed(1),
  className,
}: CircularGaugeProps): React.JSX.Element => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Borné : au-delà de max, l'arc ferait plus d'un tour et repartirait à zéro.
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const strokeColor = color ?? getThresholdColor(percentage, thresholds);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} className="stroke-muted" strokeWidth={strokeWidth} fill="transparent" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-card-foreground">{valueFormatter(value)}</span>
          {unit !== "" && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
      </div>
      {label !== undefined && label !== "" ? <span className="text-sm font-medium text-muted-foreground">{label}</span> : null}
    </div>
  );
};
