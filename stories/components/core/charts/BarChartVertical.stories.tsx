import { BarChartVertical } from "@/components/core/charts/BarChartVertical";
import { ChartCard } from "@/components/core/charts/ChartCard";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarRange } from "lucide-react";

const data = [
  { name: "Jan", value: 420 },
  { name: "Fév", value: 380 },
  { name: "Mar", value: 510 },
  { name: "Avr", value: 470 },
  { name: "Mai", value: 620 },
  { name: "Juin", value: 580 },
];

const meta: Meta<typeof BarChartVertical> = {
  title: "Core/Charts/BarChartVertical",
  component: BarChartVertical,
  args: {
    data,
    label: "Ajoutés",
  },
  render: args => (
    <ChartCard title="Ajouts par mois" description="Sur les six derniers mois" icon={CalendarRange} isEmpty={args.data.length === 0}>
      <BarChartVertical {...args} />
    </ChartCard>
  ),
};

export default meta;

type Story = StoryObj<typeof BarChartVertical>;

export const Default: Story = {};

export const WithCurrency: Story = {
  args: {
    label: "Total",
    valueFormatter: value => `${value.toLocaleString("fr-FR")} €`,
  },
};

export const AngledLabels: Story = {
  args: {
    labelAngle: -45,
    data: [
      { name: "Janvier 2026", value: 420 },
      { name: "Février 2026", value: 380 },
      { name: "Mars 2026", value: 510 },
      { name: "Avril 2026", value: 470 },
      { name: "Mai 2026", value: 620 },
    ],
  },
};

export const CustomColor: Story = {
  args: { color: "hsl(var(--k-chart-2))" },
};

export const ColorPerDatum: Story = {
  args: {
    label: "Occupation",
    valueFormatter: value => `${value.toFixed(0)} %`,
    data: [
      { name: "Disque C", value: 42, color: "hsl(var(--k-success))" },
      { name: "Disque D", value: 78, color: "hsl(var(--k-warning))" },
      { name: "Disque E", value: 94, color: "hsl(var(--destructive))" },
    ],
  },
};
