import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, Settings, TrendingUp, Users } from "lucide-react";
import { DashboardCard } from "@/components/core/cards/DashboardCard";

const meta: Meta<typeof DashboardCard> = {
  title: "Core/Cards/DashboardCard",
  component: DashboardCard,
  args: {
    titleKey: "dashboard.overview",
    children: "Contenu du dashboard",
  },
};

export default meta;

type Story = StoryObj<typeof DashboardCard>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    titleKey: "dashboard.users",
    icon: Users,
    children: "Liste des utilisateurs actifs",
  },
};

export const WithCustomClassName: Story = {
  args: {
    titleKey: "dashboard.settings",
    icon: Settings,
    className: "border-primary",
    children: "Paramètres du dashboard",
  },
};

export const WithRichContent: Story = {
  args: {
    titleKey: "dashboard.stats",
    icon: BarChart3,
  },
  render: (args) => (
    <DashboardCard {...args}>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Utilisateurs actifs</span>
          <span className="font-semibold">1 234</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Revenus</span>
          <span className="font-semibold">45 678 €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Commandes</span>
          <span className="font-semibold">573</span>
        </div>
      </div>
    </DashboardCard>
  ),
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <DashboardCard titleKey="dashboard.users" icon={Users}>
        <p className="text-2xl font-bold">1 234</p>
      </DashboardCard>
      <DashboardCard titleKey="dashboard.revenue" icon={TrendingUp}>
        <p className="text-2xl font-bold">45 678 €</p>
      </DashboardCard>
      <DashboardCard titleKey="dashboard.stats" icon={BarChart3}>
        <p className="text-2xl font-bold">573</p>
      </DashboardCard>
      <DashboardCard titleKey="dashboard.settings" icon={Settings}>
        <p className="text-2xl font-bold">12</p>
      </DashboardCard>
    </div>
  ),
};
