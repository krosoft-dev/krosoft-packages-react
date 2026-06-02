import type { Meta, StoryObj } from "@storybook/react-vite";
import { Users, ShoppingCart, TrendingUp, AlertCircle, Euro, Clock, CheckCircle, XCircle, Package, BarChart3 } from "lucide-react";
import { KpiCardsLayout } from "@/components/core/layouts/KpiCardsLayout";

const meta: Meta<typeof KpiCardsLayout> = {
  title: "Core/Layouts/KpiCardsLayout",
  component: KpiCardsLayout,
  args: {
    isLoading: false,
    error: null,
  },
};

export default meta;
type Story = StoryObj<typeof KpiCardsLayout>;

export const Default: Story = {
  args: {
    stats: [
      { titleKey: "total.users", value: 1234, icon: Users, description: "+10% ce mois" },
      { titleKey: "total.revenue", value: 45678, icon: TrendingUp, description: "+20.1% ce mois" },
      { titleKey: "orders", value: 573, icon: ShoppingCart, description: "+12 depuis hier" },
      { titleKey: "alerts", value: 7, icon: AlertCircle, description: "Nécessite une attention" },
    ],
  },
};

export const WithClickableCards: Story = {
  args: {
    stats: [
      {
        titleKey: "total.users",
        value: 1234,
        icon: Users,
        description: "+10% ce mois",
        onClick: () => console.log("Navigate to users"),
      },
      {
        titleKey: "total.revenue",
        value: 45678,
        icon: TrendingUp,
        description: "+20.1% ce mois",
        onClick: () => console.log("Navigate to revenue"),
      },
      {
        titleKey: "orders",
        value: 573,
        icon: ShoppingCart,
        description: "+12 depuis hier",
        onClick: () => console.log("Navigate to orders"),
      },
      {
        titleKey: "alerts",
        value: 7,
        icon: AlertCircle,
        description: "Nécessite une attention",
        onClick: () => console.log("Navigate to alerts"),
      },
    ],
  },
};

export const WithCustomColors: Story = {
  args: {
    stats: [
      {
        titleKey: "revenue",
        value: 128500,
        icon: Euro,
        iconClassName: "text-green-500",
        valueClassName: "text-green-500",
        description: "+15.3% vs mois dernier",
        descriptionClassName: "text-green-600",
        onClick: () => console.log("Navigate to revenue"),
      },
      {
        titleKey: "pending",
        value: 42,
        icon: Clock,
        iconClassName: "text-amber-500",
        valueClassName: "text-amber-500",
        description: "En attente de validation",
      },
      {
        titleKey: "completed",
        value: 891,
        icon: CheckCircle,
        iconClassName: "text-blue-500",
        valueClassName: "text-blue-500",
        description: "98.2% taux de succès",
        descriptionClassName: "text-blue-600",
      },
      {
        titleKey: "errors",
        value: 3,
        icon: XCircle,
        iconClassName: "text-destructive",
        valueClassName: "text-destructive",
        description: "À traiter en priorité",
        descriptionClassName: "text-destructive",
        onClick: () => console.log("Navigate to errors"),
      },
    ],
  },
};

export const ECommerceDashboard: Story = {
  args: {
    stats: [
      {
        titleKey: "products",
        value: 2456,
        icon: Package,
        description: "12 ajoutés cette semaine",
        onClick: () => console.log("Navigate to products"),
      },
      {
        titleKey: "orders.today",
        value: 89,
        icon: ShoppingCart,
        iconClassName: "text-blue-500",
        description: "+23% vs hier",
        onClick: () => console.log("Navigate to orders"),
      },
      {
        titleKey: "revenue.today",
        value: 15780,
        icon: Euro,
        iconClassName: "text-green-500",
        valueClassName: "text-green-500",
        description: "+8.5% vs hier",
      },
      {
        titleKey: "conversion.rate",
        value: 4,
        icon: BarChart3,
        iconClassName: "text-purple-500",
        description: "Taux de conversion",
      },
    ],
  },
};

export const TwoCards: Story = {
  args: {
    stats: [
      {
        titleKey: "active.users",
        value: 342,
        icon: Users,
        description: "En ligne maintenant",
        onClick: () => console.log("Navigate to active users"),
      },
      {
        titleKey: "total.revenue",
        value: 89200,
        icon: Euro,
        iconClassName: "text-green-500",
        description: "+5.2% ce mois",
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    stats: [],
    isLoading: true,
  },
};

export const WithError: Story = {
  args: {
    stats: [],
    error: new Error("Impossible de charger les statistiques"),
  },
};
