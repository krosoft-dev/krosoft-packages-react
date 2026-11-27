import type { BaseTickContentProps } from "recharts";
import { truncateLabel } from "./truncateLabel";

/** Décalages verticaux des deux lignes par rapport au centre de la rangée, au plus serré, en pixels. */
const PRIMARY_LINE_OFFSET = -1;
const SECONDARY_LINE_OFFSET = 8;
/** Hauteur de rangée sous laquelle les deux lignes restent au plus serré. */
const COMPACT_ROW_HEIGHT = 21;
/** Écart ajouté au plus à chaque ligne quand la rangée a de la place. */
const MAX_EXTRA_SPACING = 2;
const SECONDARY_FONT_SIZE = 10;

export interface BarChartHorizontalTickProps extends Pick<BaseTickContentProps, "x" | "y" | "payload" | "height" | "visibleTicksCount"> {
  secondaryLabel?: string;
  maxLabelLength: number;
}

const getExtraSpacing = (height: BarChartHorizontalTickProps["height"], visibleTicksCount: number): number => {
  const rowHeight = Number(height) / visibleTicksCount;
  return Number.isFinite(rowHeight) ? Math.min(Math.max((rowHeight - COMPACT_ROW_HEIGHT) / 2, 0), MAX_EXTRA_SPACING) : 0;
};

/**
 * Tick de l'axe des catégories sur deux lignes alignées à droite contre l'axe :
 * le libellé principal, puis le libellé secondaire plus petit et estompé.
 * L'écart entre les lignes s'élargit quand la hauteur des rangées le permet.
 */
export const BarChartHorizontalTick = ({
  x,
  y,
  payload,
  height,
  visibleTicksCount,
  secondaryLabel,
  maxLabelLength,
}: BarChartHorizontalTickProps): React.JSX.Element => {
  const extraSpacing = getExtraSpacing(height, visibleTicksCount);

  return (
    <g transform={`translate(${String(x)},${String(y)})`}>
      <text
        x={0}
        y={secondaryLabel ? PRIMARY_LINE_OFFSET - extraSpacing : 0}
        dy={secondaryLabel ? undefined : "0.355em"}
        textAnchor="end"
        style={{ fill: "hsl(var(--foreground))" }}
      >
        {truncateLabel(String(payload.value), maxLabelLength)}
      </text>
      {secondaryLabel ? (
        <text x={0} y={SECONDARY_LINE_OFFSET + extraSpacing} textAnchor="end" fontSize={SECONDARY_FONT_SIZE} style={{ fill: "hsl(var(--muted-foreground))" }}>
          {truncateLabel(secondaryLabel, maxLabelLength)}
        </text>
      ) : null}
    </g>
  );
};
