import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonCards } from "@/components/core/cards/SkeletonCards";

const meta: Meta<typeof SkeletonCards> = {
  title: "Core/Cards/SkeletonCards",
  component: SkeletonCards,
  args: {
    count: 3,
  },
  argTypes: {
    count: {
      control: { type: "number", min: 1, max: 6 },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SkeletonCards>;

export const Default: Story = {};

export const SingleCard: Story = {
  args: {
    count: 1,
  },
};

export const TwoColumns: Story = {
  args: {
    count: 2,
  },
};

export const FourColumns: Story = {
  args: {
    count: 4,
  },
};
