import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
};

export default meta;

type Story = StoryObj<typeof Popover>;

const DimensionsContent = (): React.JSX.Element => (
  <div className="grid gap-4">
    <div className="space-y-2">
      <h4 className="font-medium leading-none">Dimensions</h4>
      <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
    </div>
    <div className="grid gap-2">
      <div className="grid grid-cols-3 items-center gap-4">
        <span className="text-sm">Width</span>
        <span className="col-span-2 text-sm text-muted-foreground">100%</span>
      </div>
      <div className="grid grid-cols-3 items-center gap-4">
        <span className="text-sm">Height</span>
        <span className="col-span-2 text-sm text-muted-foreground">25px</span>
      </div>
    </div>
  </div>
);

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <DimensionsContent />
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const SideTop: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">Side top</Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-80">
          <DimensionsContent />
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const SideBottom: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">Side bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" className="w-80">
          <DimensionsContent />
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const SideLeft: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">Side left</Button>
        </PopoverTrigger>
        <PopoverContent side="left" className="w-80">
          <DimensionsContent />
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const SideRight: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">Side right</Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-80">
          <DimensionsContent />
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const AlignStart: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">Align start</Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80">
          <DimensionsContent />
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">Align end</Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <DimensionsContent />
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const WithSimpleText: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">More info</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm text-muted-foreground">This is a simple text popover with no complex content.</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-4 p-32">
      {(["top", "right", "bottom", "left"] as const).map(side => (
        <Popover key={side} defaultOpen>
          <PopoverTrigger asChild>
            <Button variant="outline">{side}</Button>
          </PopoverTrigger>
          <PopoverContent side={side}>
            <p className="text-sm font-medium capitalize">{side}</p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};
