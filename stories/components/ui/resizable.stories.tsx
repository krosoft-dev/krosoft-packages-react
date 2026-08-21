import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "UI/Resizable",
  component: ResizablePanelGroup,
};

export default meta;

type Story = StoryObj<typeof ResizablePanelGroup>;

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="w-full h-64 border rounded">
      <ResizablePanel defaultSize={50} className="bg-slate-50 p-4">
        <div>Left Panel</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50} className="bg-slate-100 p-4">
        <div>Right Panel</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup orientation="vertical" className="w-full h-64 border rounded">
      <ResizablePanel defaultSize={50} className="bg-slate-50 p-4">
        <div>Top Panel</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50} className="bg-slate-100 p-4">
        <div>Bottom Panel</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
