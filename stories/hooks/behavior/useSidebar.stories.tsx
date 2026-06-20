import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSidebar } from "@/hooks/behavior/useSidebar";
import { SidebarProvider } from "@/providers/SidebarProvider";
import { Button } from "@/components/ui/button";

/**
 * Demo component that shows the useSidebar hook reading and updating the sidebar state.
 */
const UseSidebarDemo = (): React.ReactElement => {
  const { collapsed, isMobile, toggleSidebar, setCollapsed } = useSidebar();

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-sm text-muted-foreground mb-2">
        Le hook expose l&apos;état de la sidebar. Le raccourci <kbd className="px-1 border rounded">Ctrl/Cmd + B</kbd> bascule également l&apos;état.
      </p>
      <div className="flex gap-3">
        <Button onClick={toggleSidebar}>Toggle</Button>
        <Button
          variant="outline"
          onClick={() => {
            setCollapsed(true);
          }}
        >
          Réduire
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setCollapsed(false);
          }}
        >
          Ouvrir
        </Button>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        <p>
          collapsed: <strong>{String(collapsed)}</strong>
        </p>
        <p>
          isMobile: <strong>{String(isMobile)}</strong>
        </p>
      </div>
    </div>
  );
};

/**
 * Wrapper fournissant le SidebarProvider requis par le hook.
 */
const UseSidebarStory = (): React.ReactElement => (
  <SidebarProvider>
    <UseSidebarDemo />
  </SidebarProvider>
);

const meta: Meta<typeof UseSidebarStory> = {
  title: "Hooks/useSidebar",
  component: UseSidebarStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UseSidebarStory>;

/**
 * Utilisation de base du hook useSidebar (à l'intérieur d'un SidebarProvider).
 * Gère l'état collapsed/expanded, le mode mobile, et le toggle (clic ou Ctrl/Cmd+B).
 */
export const Default: Story = {};
