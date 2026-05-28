import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardsSkeleton } from "@/components/core/cards/CardsSkeleton";

const meta: Meta<typeof CardsSkeleton> = {
  title: "Core/Cards/CardsSkeleton",
  component: CardsSkeleton,
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

type Story = StoryObj<typeof CardsSkeleton>;

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
