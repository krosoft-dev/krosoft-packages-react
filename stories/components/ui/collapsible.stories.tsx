import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Collapsible> = {
  title: "UI/Collapsible",
  component: Collapsible,
};

export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle Details</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 p-4 bg-slate-50 rounded">
        <p>This content is hidden by default and revealed when expanded.</p>
        <p className="mt-2">You can add any content here.</p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const Open: Story = {
  render: () => (
    <Collapsible defaultOpen>
      <CollapsibleTrigger asChild>
        <Button variant="outline">Details (Open)</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 p-4 bg-slate-50 rounded">
        <p>This collapsible is open by default.</p>
      </CollapsibleContent>
    </Collapsible>
  ),
};
