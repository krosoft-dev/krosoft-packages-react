import type { Meta, StoryObj } from "@storybook/react";
import { Users, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react";
import { KpiCard } from "@/components/core/cards/KpiCard";
import { KpiCards } from "@/components/core/cards/KpiCards";

const meta: Meta<typeof KpiCard> = {
  title: "Core/Cards/KpiCard",
  component: KpiCard,
  args: {
    titleKey: "total.users",
    value: 1234,
    icon: Users,
  },
};

export default meta;

type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    titleKey: "total.revenue",
    value: 45678,
    icon: TrendingUp,
    description: "+20.1% par rapport au mois dernier",
  },
};

export const Clickable: Story = {
  args: {
    titleKey: "orders",
    value: 573,
    icon: ShoppingCart,
    description: "+12 depuis hier",
    onClick: () => alert("KpiCard cliqué"),
  },
};

export const WithCustomColors: Story = {
  args: {
    titleKey: "alerts",
    value: 7,
    icon: AlertCircle,
    iconClassName: "text-destructive",
    valueClassName: "text-destructive",
    description: "Nécessite une attention",
  },
};

export const Grid: StoryObj<typeof KpiCards> = {
  render: () => (
    <KpiCards
      stats={[
        { titleKey: "total.users", value: 1234, icon: Users, description: "+10% ce mois" },
        { titleKey: "total.revenue", value: 45678, icon: TrendingUp, description: "+20.1% ce mois" },
        { titleKey: "orders", value: 573, icon: ShoppingCart, description: "+12 depuis hier" },
        { titleKey: "alerts", value: 7, icon: AlertCircle, iconClassName: "text-destructive", valueClassName: "text-destructive" },
      ]}
    />
  ),
};
