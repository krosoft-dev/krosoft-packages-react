import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/helpers/tailwind.helper";
import { ChartDatum } from "@/types/ChartDatum";
import * as React from "react";
import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis, YAxis } from "recharts";
import { buildTooltipValueFormatter } from "./chartTooltip.helper";

export interface LineChartProps {
  data: ChartDatum[];
  /** Libellé de la série dans le tooltip. */
  label?: string;
  /** Couleur de la courbe. Par défaut la couleur primaire du thème. */
  color?: string;
  /** Bornes de l'axe des ordonnées, ex. `[0, 100]` pour un pourcentage. Auto par défaut. */
  yAxisDomain?: [number, number];
  /** Mise en forme des valeurs sur l'axe et dans le tooltip (devise, pourcentage…). */
  valueFormatter?: (value: number) => string;
  /** Mise en forme des libellés de l'axe des abscisses (date, heure…). */
  labelFormatter?: (name: string) => string;
  /** Points sur chaque valeur. À couper au-delà d'une cinquantaine de points. */
  showDots?: boolean;
  className?: string;
}

/**
 * Courbe d'évolution d'une série de valeurs dans le temps.
 */
export const LineChart = ({
  data,
  label = "Valeur",
  color = "hsl(var(--primary))",
  yAxisDomain,
  valueFormatter,
  labelFormatter,
  showDots = true,
  className,
}: LineChartProps): React.JSX.Element => {
  const config = React.useMemo(() => ({ value: { label, color } }), [label, color]);
  const tooltipFormatter = React.useMemo(() => buildTooltipValueFormatter(valueFormatter, label), [valueFormatter, label]);

  return (
    <ChartContainer config={config} className={cn("aspect-auto size-full", className)}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
          tickFormatter={labelFormatter ? value => labelFormatter(String(value)) : undefined}
        />
        <YAxis
          domain={yAxisDomain}
          tickLine={false}
          axisLine={false}
          width={valueFormatter ? 48 : 32}
          tickFormatter={valueFormatter ? value => valueFormatter(Number(value)) : undefined}
        />
        <ChartTooltip
          content={<ChartTooltipContent formatter={tooltipFormatter} labelFormatter={labelFormatter ? value => labelFormatter(String(value)) : undefined} />}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={showDots ? { fill: "var(--color-value)", strokeWidth: 0, r: 3 } : false}
          activeDot={{ r: 5, strokeWidth: 2, className: "stroke-background" }}
        />
      </RechartsLineChart>
    </ChartContainer>
  );
};
