import type { Meta, StoryObj } from "@storybook/react";
import { CardSkeleton } from "@/components/core/states/CardSkeleton";

const meta: Meta<typeof CardSkeleton> = {
  title: "Core/States/CardSkeleton",
  component: CardSkeleton,
};

export default meta;

type Story = StoryObj<typeof CardSkeleton>;

export const Default: Story = {};
