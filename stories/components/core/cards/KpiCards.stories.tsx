import type { Meta, StoryObj } from "@storybook/react";
import { Users, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react";
import { KpiCards } from "@/components/core/cards/KpiCards";

const meta: Meta<typeof KpiCards> = {
  title: "Core/Cards/KpiCards",
  component: KpiCards,
  args: {
    stats: [
      { titleKey: "total.users", value: 1234, icon: Users, description: "+10% ce mois" },
      { titleKey: "total.revenue", value: 45678, icon: TrendingUp, description: "+20.1% ce mois" },
      { titleKey: "orders", value: 573, icon: ShoppingCart, description: "+12 depuis hier" },
      { titleKey: "alerts", value: 7, icon: AlertCircle, description: "Nécessite une attention" },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof KpiCards>;

export const Default: Story = {};

export const WithCustomColors: Story = {
  args: {
    stats: [
      { titleKey: "total.users", value: 1234, icon: Users },
      { titleKey: "total.revenue", value: 45678, icon: TrendingUp, iconClassName: "text-green-500", valueClassName: "text-green-500" },
      { titleKey: "orders", value: 573, icon: ShoppingCart, iconClassName: "text-blue-500", valueClassName: "text-blue-500" },
      { titleKey: "alerts", value: 7, icon: AlertCircle, iconClassName: "text-destructive", valueClassName: "text-destructive" },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    stats: [{ titleKey: "total.users", value: 1234, icon: Users, description: "+10% ce mois" }],
  },
};

export const TwoColumns: Story = {
  args: {
    stats: [
      { titleKey: "total.users", value: 1234, icon: Users, description: "+10% ce mois" },
      { titleKey: "total.revenue", value: 45678, icon: TrendingUp, description: "+20.1% ce mois" },
    ],
  },
};
