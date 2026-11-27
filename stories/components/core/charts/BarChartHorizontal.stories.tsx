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

/** Flux de même nom sur plusieurs tenants : le tenant s'affiche en secondaire sous le nom, sur l'axe et dans le tooltip. */
export const WithSecondaryLabel: Story = {
  args: {
    label: "Échecs",
    categoryWidth: 160,
    data: [
      { name: "reception_factures", secondaryLabel: "Acme Industries", value: 42 },
      { name: "reception_factures", secondaryLabel: "Globex", value: 37 },
      { name: "emission_factures", secondaryLabel: "Acme Industries", value: 31 },
      { name: "reception_factures", secondaryLabel: "Initech", value: 28 },
      { name: "emission_factures", secondaryLabel: "Umbrella Corporation Europe", value: 22 },
      { name: "reception_factures", secondaryLabel: "Stark Logistics", value: 19 },
      { name: "emission_factures", secondaryLabel: "Globex", value: 15 },
      { name: "reception_factures", secondaryLabel: "Wayne Distribution", value: 11 },
      { name: "emission_factures", secondaryLabel: "Initech", value: 8 },
      { name: "reception_factures", secondaryLabel: "Hooli", value: 5 },
    ],
  },
  render: args => (
    <ChartCard title="Top flux en échec" description="10 barres dans 250px" icon={BarChart3} height={250}>
      <BarChartHorizontal {...args} />
    </ChartCard>
  ),
};

/** Au survol, les autres barres s'estompent pour signaler que la barre pointée est cliquable. */
export const Clickable: Story = {
  args: {
    onSelect: datum => {
      // eslint-disable-next-line no-alert
      alert(`${datum.name} : ${String(datum.value)}`);
    },
  },
};
