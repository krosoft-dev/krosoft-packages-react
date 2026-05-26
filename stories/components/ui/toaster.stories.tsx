import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Toaster> = {
  title: "UI/Toaster",
  component: Toaster,
};

export default meta;

type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex gap-2">
        <Button>Show Toast</Button>
        <Button variant="outline">Toast with Description</Button>
      </div>
    </>
  ),
};
