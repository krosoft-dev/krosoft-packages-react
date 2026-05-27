import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof RadioGroup> = {
  title: "UI/Radio Group",
  component: RadioGroup,
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" disabled>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="option-1-disabled" disabled />
        <Label htmlFor="option-1-disabled">Option 1 (Disabled)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="option-2-disabled" disabled />
        <Label htmlFor="option-2-disabled">Option 2 (Disabled)</Label>
      </div>
    </RadioGroup>
  ),
};
