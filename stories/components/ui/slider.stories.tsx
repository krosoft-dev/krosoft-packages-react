import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@/components/ui/slider";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    className: "w-full",
  },
};

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    className: "w-full",
  },
};

export const MinMax: Story = {
  args: {
    defaultValue: [30],
    min: 0,
    max: 100,
    step: 5,
    className: "w-full",
  },
};
