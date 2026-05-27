import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "@/components/ui/context-menu";

const meta: Meta<typeof ContextMenu> = {
  title: "UI/Context Menu",
  component: ContextMenu,
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex items-center justify-center w-48 h-48 border-2 border-dashed rounded-lg cursor-context-menu bg-slate-50">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>My Account</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Settings</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Sign out</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
