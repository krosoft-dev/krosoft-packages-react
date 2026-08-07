import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/helpers/tailwind.helper";
import { useMobile } from "@/hooks/ui/useMobile";
import { ChartDatum } from "@/types/ChartDatum";
import * as React from "react";
import { Pie, PieChart as RechartsPieChart, type PieLabelRenderProps } from "recharts";
import { getChartColor } from "./chartColors";
import { buildTooltipValueFormatter } from "./chartTooltip.helper";

export interface PieChartProps {
  data: ChartDatum[];
  /** Rayon intérieur, en pixels. `0` donne un camembert plein. Par défaut un anneau, adapté au mobile. */
  innerRadius?: number;
  /** Rayon extérieur, en pixels. Par défaut adapté au mobile. */
  outerRadius?: number;
  /** Légende sous le graphe. */
  showLegend?: boolean;
  /** Libellés `nom (valeur)` posés à l'extérieur des parts. Illisible au-delà de 5 ou 6 parts. */
  showLabels?: boolean;
  /** Mise en forme des valeurs dans le tooltip (devise, pourcentage…). */
  valueFormatter?: (value: number) => string;
  /** Rend les parts cliquables. */
  onSelect?: (datum: ChartDatum, index: number) => void;
  className?: string;
}

/**
 * Répartition en parts, en anneau par défaut.
 *
 * Chaque donnée est coloriée par son `color`, sinon par la palette
 * `CHART_COLORS` dans l'ordre.
 */
export const PieChart = ({
  data,
  innerRadius,
  outerRadius,
  showLegend = true,
  showLabels = false,
  valueFormatter,
  onSelect,
  className,
}: PieChartProps): React.JSX.Element => {
  const isMobile = useMobile();

  // `fill` porté par la donnée : recharts colore la part avec, et le tooltip
  // comme la légende de shadcn y lisent la couleur de leur pastille.
  const chartData = React.useMemo(() => data.map((datum, index) => ({ ...datum, fill: datum.color ?? getChartColor(index) })), [data]);

  const config = React.useMemo(
    () => Object.fromEntries(data.map((datum, index) => [datum.name, { label: datum.name, color: datum.color ?? getChartColor(index) }])),
    [data],
  );

  const tooltipFormatter = React.useMemo(() => buildTooltipValueFormatter(valueFormatter), [valueFormatter]);

  const resolvedInnerRadius = innerRadius ?? (isMobile ? 45 : 60);
  const resolvedOuterRadius = outerRadius ?? (isMobile ? 80 : 100);

  return (
    <ChartContainer config={config} className={cn("aspect-auto size-full", className)}>
      <RechartsPieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel formatter={tooltipFormatter} />} />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy={showLegend ? "45%" : "50%"}
          innerRadius={resolvedInnerRadius}
          outerRadius={resolvedOuterRadius}
          paddingAngle={resolvedInnerRadius > 0 ? 2 : 0}
          label={showLabels ? ({ name, value }: PieLabelRenderProps) => `${String(name)} (${String(value)})` : undefined}
          // Sans cela les parts se remontent à chaque changement de filtre, ce qui
          // rend le graphe illisible sur un tableau de bord qui se rafraîchit.
          isAnimationActive={false}
          className={cn("stroke-background", onSelect && "cursor-pointer")}
          onClick={
            onSelect
              ? (_, index) => {
                  onSelect(data[index], index);
                }
              : undefined
          }
        />
        {showLegend && <ChartLegend content={<ChartLegendContent nameKey="name" className="flex-wrap text-muted-foreground" />} />}
      </RechartsPieChart>
    </ChartContainer>
  );
};
