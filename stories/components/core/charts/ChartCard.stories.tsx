import { BarChartVertical } from "@/components/core/charts/BarChartVertical";
import { ChartCard } from "@/components/core/charts/ChartCard";
import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrendingUp } from "lucide-react";

const data = [
  { name: "Jan", value: 420 },
  { name: "Fév", value: 380 },
  { name: "Mar", value: 510 },
  { name: "Avr", value: 470 },
  { name: "Mai", value: 620 },
  { name: "Juin", value: 580 },
];

const meta: Meta<typeof ChartCard> = {
  title: "Core/Charts/ChartCard",
  component: ChartCard,
  args: {
    title: "Ajouts par mois",
    description: "Sur les six derniers mois",
    icon: TrendingUp,
    children: <BarChartVertical data={data} label="Ajoutés" />,
  },
};

export default meta;

type Story = StoryObj<typeof ChartCard>;

export const Default: Story = {};

export const WithoutDescription: Story = {
  args: { description: undefined, icon: undefined },
};

export const WithActions: Story = {
  args: {
    actions: (
      <Button variant="outline" size="sm">
        30 derniers jours
      </Button>
    ),
  },
};

export const Loading: Story = {
  args: { isLoading: true },
};

export const Empty: Story = {
  args: { isEmpty: true, emptyLabel: "Pas assez de données pour cette période" },
};

export const CustomHeight: Story = {
  args: { height: 180 },
};
