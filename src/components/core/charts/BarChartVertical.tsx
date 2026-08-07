import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/helpers/tailwind.helper";
import { ChartDatum } from "@/types/ChartDatum";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { buildTooltipValueFormatter } from "./chartTooltip.helper";

export interface BarChartVerticalProps {
  data: ChartDatum[];
  /** Libellé de la série dans le tooltip. */
  label?: string;
  /** Couleur des barres, sauf celles dont la donnée porte son propre `color`. Par défaut la couleur primaire du thème. */
  color?: string;
  /** Inclinaison des libellés de l'axe des abscisses, en degrés (ex. `-45` quand ils se chevauchent). */
  labelAngle?: number;
  /** Mise en forme des valeurs sur l'axe et dans le tooltip (devise, pourcentage…). */
  valueFormatter?: (value: number) => string;
  /** Autorise les graduations décimales sur l'axe des ordonnées. */
  allowDecimals?: boolean;
  /** Rend les barres cliquables. */
  onSelect?: (datum: ChartDatum, index: number) => void;
  className?: string;
}

/**
 * Barres verticales, pour les séries ordonnées où l'axe des abscisses porte une
 * progression lisible de gauche à droite — typiquement une répartition par mois.
 */
export const BarChartVertical = ({
  data,
  label = "Valeur",
  color = "hsl(var(--primary))",
  labelAngle,
  valueFormatter,
  allowDecimals = false,
  onSelect,
  className,
}: BarChartVerticalProps): React.JSX.Element => {
  const config = React.useMemo(() => ({ value: { label, color } }), [label, color]);
  const tooltipFormatter = React.useMemo(() => buildTooltipValueFormatter(valueFormatter, label), [valueFormatter, label]);
  const isAngled = labelAngle !== undefined && labelAngle !== 0;
  // `fill` porté par la donnée : recharts l'étale sur le rectangle après les
  // props de `Bar`, il prime donc sur `color`. C'est le remplaçant de `Cell`,
  // déprécié depuis recharts 3.
  const chartData = React.useMemo(
    () => (data.some(datum => datum.color !== undefined) ? data.map(datum => ({ ...datum, fill: datum.color ?? color })) : data),
    [data, color],
  );

  return (
    <ChartContainer config={config} className={cn("aspect-auto size-full", className)}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: isAngled ? 20 : 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          angle={labelAngle}
          textAnchor={isAngled ? "end" : "middle"}
          height={isAngled ? 50 : undefined}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          allowDecimals={allowDecimals}
          tickLine={false}
          axisLine={false}
          width={valueFormatter ? 48 : 32}
          tickFormatter={valueFormatter ? value => valueFormatter(Number(value)) : undefined}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={tooltipFormatter} />} />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[4, 4, 0, 0]}
          className={onSelect ? "cursor-pointer" : undefined}
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
