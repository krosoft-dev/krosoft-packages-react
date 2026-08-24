import { BarChartHorizontal } from "@/components/core/charts/BarChartHorizontal";
import { ChartCard } from "@/components/core/charts/ChartCard";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3 } from "lucide-react";

const data = [
  { name: "Documentation technique", value: 128 },
  { name: "Rétrospective", value: 96 },
  { name: "Onboarding", value: 74 },
  { name: "Architecture décisionnelle", value: 51 },
  { name: "Veille", value: 33 },
];

const meta: Meta<typeof BarChartHorizontal> = {
  title: "Core/Charts/BarChartHorizontal",
  component: BarChartHorizontal,
  args: {
    data,
    label: "Médias",
  },
  render: args => (
    <ChartCard title="Tags les plus utilisés" description="Par nombre de médias associés" icon={BarChart3} isEmpty={args.data.length === 0}>
      <BarChartHorizontal {...args} />
    </ChartCard>
  ),
};

export default meta;

type Story = StoryObj<typeof BarChartHorizontal>;

export const Default: Story = {};

export const WithCurrency: Story = {
  args: {
    label: "Total dépensé",
    valueFormatter: value => `${value.toLocaleString("fr-FR")} €`,
    categoryWidth: 160,
  },
};

export const WithoutTruncation: Story = {
  args: { maxLabelLength: 0, categoryWidth: 200 },
};

export const Clickable: Story = {
  args: {
    onSelect: datum => {
      // eslint-disable-next-line no-alert
      alert(`${datum.name} : ${String(datum.value)}`);
    },
  },
};
