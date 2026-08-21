import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator } from "@/components/ui/menubar";

const meta: Meta<typeof Menubar> = {
  title: "UI/Menubar",
  component: Menubar,
};

export default meta;

type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Zoom In</MenubarItem>
          <MenubarItem>Zoom Out</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Full Screen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
