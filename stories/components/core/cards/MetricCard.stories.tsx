import type { Meta, StoryObj } from "@storybook/react-vite";
import { Activity, Cpu, HardDrive, Server, Thermometer, Zap } from "lucide-react";
import { MetricCard } from "@/components/core/cards/MetricCard";

const meta: Meta<typeof MetricCard> = {
  title: "Core/Cards/MetricCard",
  component: MetricCard,
  args: {
    title: "CPU Usage",
    value: 42.5,
    unit: "%",
    icon: Cpu,
    color: "blue",
  },
  argTypes: {
    color: {
      control: "select",
      options: ["blue", "green", "orange", "red", "purple"],
    },
    trend: {
      control: "select",
      options: [undefined, "up", "down", "stable"],
    },
    iconSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {};

export const WithTrendUp: Story = {
  args: {
    title: "Requetes / min",
    value: 1284,
    icon: Activity,
    color: "green",
    trend: "up",
    trendValue: "+12% vs hier",
  },
};

export const WithTrendDown: Story = {
  args: {
    title: "Erreurs",
    value: 3,
    icon: Zap,
    color: "red",
    trend: "down",
    trendValue: "-40% vs hier",
  },
};

export const WithUnit: Story = {
  args: {
    title: "Memoire",
    value: 6.8,
    unit: "GB",
    icon: HardDrive,
    color: "purple",
    trend: "stable",
    trendValue: "stable",
  },
};

export const IconSizes: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard title="Small (défaut)" value={42} unit="%" icon={Cpu} color="blue" iconSize="sm" />
      <MetricCard title="Medium" value={42} unit="%" icon={Cpu} color="green" iconSize="md" />
      <MetricCard title="Large" value={42} unit="%" icon={Cpu} color="purple" iconSize="lg" />
    </div>
  ),
};

export const WithSubtitle: Story = {
  args: {
    title: "Température",
    value: 72.3,
    unit: "°C",
    icon: Thermometer,
    color: "orange",
    subtitle: "Moyenne sur les 24 dernières heures",
  },
};

export const WithSubtitleAndTrend: Story = {
  args: {
    title: "Charge CPU",
    value: 58.1,
    unit: "%",
    icon: Cpu,
    color: "blue",
    subtitle: "Pic à 94% à 14h32",
    trend: "up",
    trendValue: "+6% vs hier",
  },
};

export const StringValue: Story = {
  args: {
    title: "Uptime",
    value: "14j 6h 23m",
    icon: Server,
    color: "orange",
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {(["blue", "green", "orange", "red", "purple", "accent", "success", "info", "warning", "destructive"] as const).map((color) => (
        <MetricCard key={color} title={color} value={42} unit="%" icon={Thermometer} color={color} />
      ))}
    </div>
  ),
};

export const AllTrends: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard title="En hausse" value={84} unit="%" icon={Activity} color="green" trend="up" trendValue="+8% ce mois" />
      <MetricCard title="En baisse" value={12} unit="%" icon={Activity} color="red" trend="down" trendValue="-3% ce mois" />
      <MetricCard title="Stable" value={50} unit="%" icon={Activity} color="blue" trend="stable" trendValue="=0% ce mois" />
    </div>
  ),
};
