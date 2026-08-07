import { ChartCard } from "@/components/core/charts/ChartCard";
import { PieChart } from "@/components/core/charts/PieChart";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PieChartIcon } from "lucide-react";

const data = [
  { name: "Film", value: 128 },
  { name: "Série", value: 96 },
  { name: "Livre", value: 74 },
  { name: "Jeu", value: 51 },
  { name: "Album", value: 33 },
];

const meta: Meta<typeof PieChart> = {
  title: "Core/Charts/PieChart",
  component: PieChart,
  args: { data },
  render: args => (
    <ChartCard title="Répartition par type" description="Sur l'ensemble de la bibliothèque" icon={PieChartIcon} isEmpty={args.data.length === 0}>
      <PieChart {...args} />
    </ChartCard>
  ),
};

export default meta;

type Story = StoryObj<typeof PieChart>;

export const Default: Story = {};

export const FullPie: Story = {
  args: { innerRadius: 0 },
};

export const WithLabels: Story = {
  args: { showLabels: true, showLegend: false, outerRadius: 80 },
};

export const ExplicitColors: Story = {
  args: {
    data: [
      { name: "Succès", value: 842, color: "hsl(var(--k-success))" },
      { name: "Échec", value: 96, color: "hsl(var(--destructive))" },
      { name: "En attente", value: 51, color: "hsl(var(--k-warning))" },
    ],
  },
};

export const WithCurrency: Story = {
  args: {
    valueFormatter: value => `${value.toLocaleString("fr-FR")} €`,
  },
};
