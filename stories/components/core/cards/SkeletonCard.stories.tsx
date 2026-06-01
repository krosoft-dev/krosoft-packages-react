import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonCard } from "@/components/core/cards/SkeletonCard";

const meta: Meta<typeof SkeletonCard> = {
  title: "Core/Cards/SkeletonCard",
  component: SkeletonCard,
};

export default meta;

type Story = StoryObj<typeof SkeletonCard>;

export const Default: Story = {};

export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ),
};
