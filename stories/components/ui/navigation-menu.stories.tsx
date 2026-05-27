import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const meta: Meta<typeof NavigationMenu> = {
  title: "UI/Navigation Menu",
  component: NavigationMenu,
};

export default meta;

type Story = StoryObj<typeof NavigationMenu>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-40 p-4 space-y-2">
              <div className="text-sm font-medium">Product A</div>
              <div className="text-sm font-medium">Product B</div>
              <div className="text-sm font-medium">Product C</div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-40 p-4 space-y-2">
              <div className="text-sm font-medium">Consulting</div>
              <div className="text-sm font-medium">Development</div>
              <div className="text-sm font-medium">Support</div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <button className={navigationMenuTriggerStyle()}>About</button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
