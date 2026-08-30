import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
// Import direct du fichier : le barrel `@/pwa` réexporte `PwaUpdater`, dont l'import
// `virtual:pwa-register/react` n'existe pas hors d'un build `vite-plugin-pwa`.
import { showPwaUpdateToast } from "@/pwa/pwaUpdateToast";

const meta: Meta = {
  title: "Pwa/PwaUpdateToast",
  parameters: {
    docs: {
      description: {
        component:
          "Toast affiché par `PwaUpdater` quand une nouvelle version de l'application attend. " +
          "Message sur la première ligne, boutons « Actualiser » et « Ignorer » sur la seconde.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() =>
          showPwaUpdateToast({
            message: "Une nouvelle version est disponible.",
            actionLabel: "Actualiser",
            dismissLabel: "Ignorer",
            onUpdate: () => {},
            onDismiss: () => {},
          })
        }
      >
        Proposer la mise à jour
      </Button>
    </>
  ),
};
