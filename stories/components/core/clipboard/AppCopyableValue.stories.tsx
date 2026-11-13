import React from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { AppCopyableValue } from "@/components/core/clipboard/AppCopyableValue";
import { Toaster } from "@/components/ui/toaster";

const withToaster: Decorator = Story => (
  <>
    <Story />
    <Toaster />
  </>
);

const meta: Meta<typeof AppCopyableValue> = {
  title: "Core/Clipboard/AppCopyableValue",
  component: AppCopyableValue,
  parameters: {
    layout: "centered",
  },
  decorators: [withToaster],
};

export default meta;
type Story = StoryObj<typeof AppCopyableValue>;

/** Le bouton de copie apparaît au survol. */
export const Default: Story = {
  args: {
    value: "3f2b6c1e-8a4d-4f0e-9b7a-1c2d3e4f5a6b",
  },
};

/** Contenu affiché différent de la valeur copiée (ici un lien). */
export const WithChildren: Story = {
  args: {
    value: "3f2b6c1e-8a4d-4f0e-9b7a-1c2d3e4f5a6b",
    children: (
      <a href="#invoice" className="text-primary underline-offset-4 hover:underline">
        FAC-2026-00042
      </a>
    ),
  },
};

const ClickableRowDemo = ({ value }: { value: string }): React.ReactElement => {
  const [rowClicks, setRowClicks] = React.useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div
        className="cursor-pointer rounded-md border p-3 hover:bg-muted/50"
        onClick={() => {
          setRowClicks(count => count + 1);
        }}
      >
        <AppCopyableValue value={value} />
      </div>
      <p className="text-xs text-muted-foreground">Clics de ligne : {rowClicks}</p>
    </div>
  );
};

/** Le clic sur le bouton de copie ne remonte pas au conteneur (clic de ligne d'un tableau). */
export const InClickableRow: Story = {
  args: {
    value: "FAC-2026-00042",
  },
  render: args => <ClickableRowDemo value={args.value} />,
};
