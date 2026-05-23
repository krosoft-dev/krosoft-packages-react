import type { Meta, StoryObj } from "@storybook/react";
import { CardsSkeleton } from "@/components/core/states/CardsSkeleton";

const meta: Meta<typeof CardsSkeleton> = {
  title: "Core/States/CardsSkeleton",
  component: CardsSkeleton,
};

export default meta;

type Story = StoryObj<typeof CardsSkeleton>;

export const Default: Story = {};

export const TwoColumns: Story = {
  args: {
    count: 2,
  },
};

export const ThreeColumns: Story = {
  args: {
    count: 3,
  },
};

export const FourColumns: Story = {
  args: {
    count: 4,
  },
};
