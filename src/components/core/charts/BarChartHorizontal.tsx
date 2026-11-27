import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/helpers/tailwind.helper";
import { ChartDatum } from "@/types/ChartDatum";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis, type BarShapeProps, type BaseTickContentProps } from "recharts";
import { BarChartHorizontalTick } from "./BarChartHorizontalTick";
import { buildTooltipValueFormatter } from "./chartTooltip.helper";
import { truncateLabel } from "./truncateLabel";

/** Opacité des barres non survolées quand le graphe est cliquable. */
const DIMMED_BAR_OPACITY = 0.35;

export interface BarChartHorizontalProps {
  data: ChartDatum[];
  /** Libellé de la série dans le tooltip. */
  label?: string;
  /** Couleur des barres, sauf celles dont la donnée porte son propre `color`. Par défaut la couleur primaire du thème. */
  color?: string;
  /** Largeur réservée aux libellés de catégories, en pixels. */
  categoryWidth?: number;
  /** Longueur max d'un libellé, principal comme secondaire, avant troncature. `0` désactive la troncature. */
  maxLabelLength?: number;
  /** Mise en forme des valeurs sur l'axe et dans le tooltip (devise, pourcentage…). */
  valueFormatter?: (value: number) => string;
  /** Rend les barres cliquables. */
  onSelect?: (datum: ChartDatum, index: number) => void;
  className?: string;
}

/**
 * Barres horizontales, pour les classements « top N » où les libellés de
 * catégories sont trop longs pour tenir sur un axe des abscisses.
 */
export const BarChartHorizontal = ({
  data,
  label = "Valeur",
  color = "hsl(var(--primary))",
  categoryWidth = 140,
  maxLabelLength = 22,
  valueFormatter,
  onSelect,
  className,
}: BarChartHorizontalProps): React.JSX.Element => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const config = React.useMemo(() => ({ value: { label, color } }), [label, color]);
  const tooltipFormatter = React.useMemo(() => buildTooltipValueFormatter(valueFormatter, label), [valueFormatter, label]);
  // `fill` porté par la donnée : recharts l'étale sur le rectangle après les
  // props de `Bar`, il prime donc sur `color`. C'est le remplaçant de `Cell`,
  // déprécié depuis recharts 3.
  const chartData = React.useMemo(
    () => (data.some(datum => datum.color !== undefined) ? data.map(datum => ({ ...datum, fill: datum.color ?? color })) : data),
    [data, color],
  );
  const hasSecondaryLabel = React.useMemo(() => data.some(datum => datum.secondaryLabel), [data]);
  const tooltipLabelFormatter = React.useMemo(
    () =>
      hasSecondaryLabel
        ? (value: unknown, payload: unknown[]): React.ReactNode => {
            const secondaryLabel = (payload[0] as { payload?: ChartDatum } | undefined)?.payload?.secondaryLabel;
            return (
              <>
                <div>{String(value)}</div>
                {secondaryLabel ? <div className="font-normal text-muted-foreground">{secondaryLabel}</div> : null}
              </>
            );
          }
        : undefined,
    [hasSecondaryLabel],
  );

  return (
    <ChartContainer config={config} className={cn("aspect-auto size-full", className)}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          dataKey="value"
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={valueFormatter ? value => valueFormatter(Number(value)) : undefined}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={categoryWidth}
          tickLine={false}
          axisLine={false}
          tickFormatter={value => truncateLabel(String(value), maxLabelLength)}
          {...(hasSecondaryLabel && {
            interval: 0,
            tick: (props: BaseTickContentProps) => (
              <BarChartHorizontalTick {...props} secondaryLabel={data[props.payload.index]?.secondaryLabel} maxLabelLength={maxLabelLength} />
            ),
          })}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={tooltipFormatter} labelFormatter={tooltipLabelFormatter} />} />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[0, 4, 4, 0]}
          className={onSelect ? "cursor-pointer" : undefined}
          // Une barre cliquable ressort au survol, les autres s'estompant, pour signaler le lien.
          onMouseEnter={
            onSelect
              ? (_, index) => {
                  setHoveredIndex(index);
                }
              : undefined
          }
          onMouseLeave={
            onSelect
              ? () => {
                  setHoveredIndex(null);
                }
              : undefined
          }
          shape={(props: BarShapeProps) => (
            <Rectangle {...props} fillOpacity={hoveredIndex !== null && hoveredIndex !== props.index ? DIMMED_BAR_OPACITY : 1} />
          )}
          onClick={
            onSelect
              ? (_, index) => {
                  onSelect(data[index], index);
                }
              : undefined
          }
        />
      </BarChart>
    </ChartContainer>
  );
};
