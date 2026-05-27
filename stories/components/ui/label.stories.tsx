import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  args: {
    children: "Label",
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="email">Adresse email</Label>
      <Input id="email" type="email" placeholder="exemple@domaine.fr" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="disabled">Champ désactivé</Label>
      <Input id="disabled" disabled placeholder="Non disponible" />
    </div>
  ),
};
