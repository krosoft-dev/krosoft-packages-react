import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toaster, toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

const meta: Meta = {
  title: "UI/Sonner",
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="space-y-2">
        <Button onClick={() => toast.success("Success toast")}>Success</Button>
        <Button onClick={() => toast.error("Error toast")} variant="destructive">
          Error
        </Button>
        <Button onClick={() => toast.loading("Loading...")} variant="outline">
          Loading
        </Button>
      </div>
    </>
  ),
};

export const WithActionAndClose: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast("Une nouvelle version est disponible.", {
            duration: Infinity,
            closeButton: true,
            action: { label: "Actualiser", onClick: () => {} },
          })
        }
      >
        Action + fermeture
      </Button>
    </>
  ),
};
