import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/helpers/tailwind.helper";
import { ChartDatum } from "@/types/ChartDatum";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { buildTooltipValueFormatter } from "./chartTooltip.helper";

export interface BarChartHorizontalProps {
  data: ChartDatum[];
  /** Libellé de la série dans le tooltip. */
  label?: string;
  /** Couleur des barres. Par défaut la couleur primaire du thème. */
  color?: string;
  /** Largeur réservée aux libellés de catégories, en pixels. */
  categoryWidth?: number;
  /** Longueur max d'un libellé avant troncature. `0` désactive la troncature. */
  maxLabelLength?: number;
  /** Mise en forme des valeurs sur l'axe et dans le tooltip (devise, pourcentage…). */
  valueFormatter?: (value: number) => string;
  /** Rend les barres cliquables. */
  onSelect?: (datum: ChartDatum, index: number) => void;
  className?: string;
}

const truncate = (value: string, maxLength: number): string => (maxLength > 0 && value.length > maxLength ? `${value.slice(0, maxLength)}…` : value);

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
  const config = React.useMemo(() => ({ value: { label, color } }), [label, color]);
  const tooltipFormatter = React.useMemo(() => buildTooltipValueFormatter(valueFormatter, label), [valueFormatter, label]);

  return (
    <ChartContainer config={config} className={cn("aspect-auto size-full", className)}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          tickFormatter={value => truncate(String(value), maxLabelLength)}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={tooltipFormatter} />} />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[0, 4, 4, 0]}
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
