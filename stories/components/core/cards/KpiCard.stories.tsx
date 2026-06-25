import { KpiCard } from "@/components/core/cards/KpiCard";
import { KpiCards } from "@/components/core/cards/KpiCards";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertCircle, ShoppingCart, TrendingUp, Users } from "lucide-react";

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
    onClick: () => {
      alert("KpiCard cliqué");
    },
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

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const WithError: Story = {
  args: {
    error: "Impossible de charger les statistiques",
  },
};

export const WithNumberValue: Story = {
  args: {
    titleKey: "total.users",
    value: 1234567,
    icon: Users,
    description: "Valeur de type number",
  },
};

export const WithStringValue: Story = {
  args: {
    titleKey: "status",
    value: "En ligne",
    icon: TrendingUp,
    description: "Valeur de type string",
  },
};

export const WithDateValue: Story = {
  args: {
    titleKey: "last.update",
    value: new Date("2026-06-25"),
    icon: ShoppingCart,
    description: "Valeur de type Date",
  },
};
