import { ChartCard } from "@/components/core/charts/ChartCard";
import { LineChart } from "@/components/core/charts/LineChart";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cpu } from "lucide-react";

const data = [
  { name: "08:00", value: 24.5 },
  { name: "09:00", value: 38.2 },
  { name: "10:00", value: 61.7 },
  { name: "11:00", value: 54.3 },
  { name: "12:00", value: 42.8 },
  { name: "13:00", value: 71.4 },
  { name: "14:00", value: 66.9 },
  { name: "15:00", value: 48.1 },
];

const meta: Meta<typeof LineChart> = {
  title: "Core/Charts/LineChart",
  component: LineChart,
  args: {
    data,
    label: "Utilisation CPU",
    yAxisDomain: [0, 100],
    valueFormatter: value => `${value.toFixed(0)} %`,
  },
  render: args => (
    <ChartCard title="Utilisation CPU" description="Sur les huit dernières heures" icon={Cpu} isEmpty={args.data.length === 0}>
      <LineChart {...args} />
    </ChartCard>
  ),
};

export default meta;

type Story = StoryObj<typeof LineChart>;

export const Default: Story = {};

export const AutoDomain: Story = {
  args: { yAxisDomain: undefined, valueFormatter: undefined, label: "Requêtes" },
};

export const WithoutDots: Story = {
  args: { showDots: false },
};

export const CustomColor: Story = {
  args: { color: "hsl(var(--k-chart-2))", label: "Utilisation mémoire" },
};
