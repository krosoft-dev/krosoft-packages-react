import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../../../src/components/ui/sheet";
import { Button } from "../../../src/components/ui/button";
import * as React from "react";

const meta: Meta<typeof Sheet> = {
  title: "UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const SidePositions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      {["top", "right", "bottom", "left"].map(side => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">Open {side}</Button>
          </SheetTrigger>
          <SheetContent side={side as "top" | "right" | "bottom" | "left"}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
