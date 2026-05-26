import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const meta: Meta = {
  title: "UI/Chart",
};

export default meta;

type Story = StoryObj;

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

export const Default: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip />
          <ChartLegend />
          <Line type="monotone" dataKey="desktop" stroke={chartConfig.desktop.color} />
          <Line type="monotone" dataKey="mobile" stroke={chartConfig.mobile.color} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  ),
};
