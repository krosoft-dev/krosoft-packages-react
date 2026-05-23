import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../src/components/ui/tooltip";
import { Button } from "../../../src/components/ui/button";
import * as React from "react";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (story: () => React.ReactNode): React.ReactElement => (
      <TooltipProvider>
        <div className="flex items-center justify-center p-20">{story()}</div>
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
};
