import type { Meta, StoryObj } from "@storybook/react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof HoverCard> = {
  title: "UI/Hover Card",
  component: HoverCard,
};

export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">Hover over me</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">@shadcn</h4>
          <p className="text-sm">
            A collection of beautiful and accessible React components built with Radix UI and Tailwind CSS.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
