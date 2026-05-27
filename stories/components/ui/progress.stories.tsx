import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "@/components/ui/progress";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  args: {
    value: 50,
    indeterminate: false,
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    indeterminate: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {};

export const Empty: Story = { args: { value: 0 } };

export const Full: Story = { args: { value: 100 } };

export const Indeterminate: Story = {
  args: { indeterminate: true },
};
