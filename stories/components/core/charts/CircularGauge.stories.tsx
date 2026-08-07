import { CircularGauge } from "@/components/core/charts/CircularGauge";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof CircularGauge> = {
  title: "Core/Charts/CircularGauge",
  component: CircularGauge,
  args: {
    value: 42.5,
    label: "Processeur",
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 0.5 } },
    size: { control: { type: "range", min: 60, max: 240, step: 10 } },
    strokeWidth: { control: { type: "range", min: 2, max: 24, step: 1 } },
  },
};

export default meta;

type Story = StoryObj<typeof CircularGauge>;

export const Default: Story = {};

export const Thresholds: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <CircularGauge value={22.4} label="Sous le seuil" />
      <CircularGauge value={63.8} label="Warning" />
      <CircularGauge value={91.2} label="Destructive" />
    </div>
  ),
};

export const FixedColor: Story = {
  args: { color: "hsl(var(--k-chart-1))", label: "Neutre" },
};

export const CustomThresholds: Story = {
  args: { value: 63.8, thresholds: { warning: 70, danger: 90 }, label: "Seuils élargis" },
};

export const NotAPercentage: Story = {
  args: {
    value: 6.8,
    max: 16,
    unit: "GB",
    label: "Mémoire",
    valueFormatter: value => value.toFixed(1),
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <CircularGauge value={42.5} size={80} strokeWidth={6} label="Small" />
      <CircularGauge value={42.5} label="Default" />
      <CircularGauge value={42.5} size={180} strokeWidth={12} label="Large" />
    </div>
  ),
};
