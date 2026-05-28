import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardSkeleton } from "@/components/core/cards/CardSkeleton";

const meta: Meta<typeof CardSkeleton> = {
  title: "Core/Cards/CardSkeleton",
  component: CardSkeleton,
};

export default meta;

type Story = StoryObj<typeof CardSkeleton>;

export const Default: Story = {};

export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  ),
};
