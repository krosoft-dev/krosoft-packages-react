import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  args: {
    checked: false,
    disabled: false,
  },
  argTypes: {
    checked: {
      control: "select",
      options: [false, true, "indeterminate"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    checked: "indeterminate",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState<boolean | "indeterminate">(false);
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={value => {
            setChecked(value);
          }}
        />
        <span className="text-sm text-muted-foreground">État : {String(checked)}</span>
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox checked={false} />
        <span className="text-sm">Non coché</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={true} />
        <span className="text-sm">Coché</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked="indeterminate" />
        <span className="text-sm">Indéterminé</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={false} disabled />
        <span className="text-sm text-muted-foreground">Désactivé</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={true} disabled />
        <span className="text-sm text-muted-foreground">Désactivé coché</span>
      </div>
    </div>
  ),
};
