import type { Meta, StoryObj } from "@storybook/react";
import { useMobile } from "@/hooks/ui/useMobile";

const MobileDemo = () => {
  const isMobile = useMobile();

  return (
    <div className="p-4 rounded-md border">
      <p className="text-sm text-muted-foreground mb-1">Breakpoint mobile : &lt; 768px</p>
      <p className="font-semibold">
        {isMobile ? "Mobile détecté" : "Desktop détecté"}
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        Redimensionnez la fenêtre pour voir le changement.
      </p>
    </div>
  );
};

const meta: Meta<typeof MobileDemo> = {
  title: "Hooks/useMobile",
  component: MobileDemo,
};

export default meta;

type Story = StoryObj<typeof MobileDemo>;

export const Default: Story = {};
