import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { AppCodeBlock } from "@/components/core/clipboard/AppCodeBlock";
import { Toaster } from "@/components/ui/toaster";

const JSON_CONTENT = JSON.stringify(
  {
    id: "3f2b6c1e-8a4d-4f0e-9b7a-1c2d3e4f5a6b",
    status: "Rejected",
    errors: [
      { code: "E042", message: "Le numéro de facture est déjà utilisé par une autre facture du même fournisseur." },
      { code: "E107", message: "La date d'échéance précède la date d'émission." },
    ],
    createdAt: "2026-11-13T09:42:00Z",
  },
  null,
  2,
);

const COMMAND =
  "npx @krosoft/cli deploy --environment=staging --registry=https://registry.example.com/krosoft/packages/react --tag=release-candidate --verbose";

const withToaster: Decorator = Story => (
  <>
    <Story />
    <Toaster />
  </>
);

const withFixedHeight: Decorator = Story => (
  <div className="h-48 overflow-hidden rounded-md border">
    <Story />
  </div>
);

const meta: Meta<typeof AppCodeBlock> = {
  title: "Core/Clipboard/AppCodeBlock",
  component: AppCodeBlock,
  parameters: {
    layout: "padded",
  },
  decorators: [withToaster],
};

export default meta;
type Story = StoryObj<typeof AppCodeBlock>;

export const Default: Story = {
  args: {
    content: JSON_CONTENT,
  },
};

/** Commande longue : retour à la ligne plutôt que défilement horizontal. */
export const Wrap: Story = {
  args: {
    content: COMMAND,
    wrap: true,
  },
};

/** Sans `wrap`, la même commande défile horizontalement. */
export const NoWrap: Story = {
  args: {
    content: COMMAND,
  },
};

/** Remplit un parent de hauteur fixe, sans bordure (contenu unique d'une dialog). */
export const Fill: Story = {
  args: {
    content: JSON_CONTENT,
    fill: true,
  },
  decorators: [withFixedHeight],
};

export const SmallMaxHeight: Story = {
  args: {
    content: JSON_CONTENT,
    maxHeightClassName: "max-h-32",
  },
};
