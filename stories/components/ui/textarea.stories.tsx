import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="message-disabled">Message</Label>
      <Textarea id="message-disabled" placeholder="Type your message here." disabled />
    </div>
  ),
};

export const WithValue: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="message-value">Message</Label>
      <Textarea
        id="message-value"
        placeholder="Type your message here."
        defaultValue="This is a textarea with some default content."
      />
    </div>
  ),
};
