import type { BaseTickContentProps } from "recharts";
import { truncateLabel } from "./truncateLabel";

/** Décalage vertical de la ligne principale par rapport au centre de la rangée, en pixels. */
const PRIMARY_LINE_OFFSET = -1;
/** Décalage vertical de la ligne secondaire par rapport au centre de la rangée, en pixels. */
const SECONDARY_LINE_OFFSET = 8;
const SECONDARY_FONT_SIZE = 10;

export interface BarChartHorizontalTickProps extends Pick<BaseTickContentProps, "x" | "y" | "fill" | "payload"> {
  secondaryLabel?: string;
  maxLabelLength: number;
}

/**
 * Tick de l'axe des catégories sur deux lignes alignées à droite contre l'axe :
 * le libellé principal, puis le libellé secondaire plus petit et estompé.
 */
export const BarChartHorizontalTick = ({ x, y, fill, payload, secondaryLabel, maxLabelLength }: BarChartHorizontalTickProps): React.JSX.Element => (
  <g transform={`translate(${String(x)},${String(y)})`}>
    <text x={0} y={PRIMARY_LINE_OFFSET} textAnchor="end" fill={fill}>
      {truncateLabel(String(payload.value), maxLabelLength)}
    </text>
    {secondaryLabel ? (
      <text x={0} y={SECONDARY_LINE_OFFSET} textAnchor="end" fontSize={SECONDARY_FONT_SIZE} style={{ fill: "hsl(var(--muted-foreground))" }}>
        {truncateLabel(secondaryLabel, maxLabelLength)}
      </text>
    ) : null}
  </g>
);
