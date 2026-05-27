import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};

export const WithSelected: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return <Calendar mode="single" selected={date} onSelect={setDate} />;
  },
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = React.useState<{ from: Date; to?: Date } | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return <Calendar mode="range" selected={range} onSelect={setRange} />;
  },
};

export const WithoutOutsideDays: Story = {
  args: { showOutsideDays: false },
};
