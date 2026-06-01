import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useConfirmationDialog } from "@/hooks/behavior/useConfirmationDialog";
import { ConfirmationDialog } from "@/components/core/dialogs/ConfirmationDialog";
import { Button } from "@/components/ui/button";

/**
 * Demo component that shows the ConfirmationDialog driven by useConfirmationDialog.
 */
const ConfirmationDialogDemo = ({
  destructive,
}: {
  destructive?: boolean;
}): React.ReactElement => {
  const config = useConfirmationDialog({
    titleKey: "Confirmer l'action",
    descriptionKey: "Êtes-vous sûr de vouloir effectuer cette action ?",
    onConfirm: async (_id: string) => {
      await new Promise(r => setTimeout(r, 1500));
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-sm text-muted-foreground mb-2">Cliquez sur le bouton pour ouvrir le dialogue de confirmation.</p>
      <Button onClick={() => config.openDialog("1", "Élément #1")}>
        Confirmer l'action
      </Button>
      <ConfirmationDialog config={config} destructive={destructive} />
    </div>
  );
};

const meta: Meta<typeof ConfirmationDialogDemo> = {
  title: "Core/Dialogs/ConfirmationDialog",
  component: ConfirmationDialogDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    destructive: {
      control: "boolean",
      description: "Affiche le bouton de confirmation en mode destructif",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmationDialogDemo>;

export const Default: Story = {
  args: {
    destructive: false,
  },
};

export const Destructive: Story = {
  args: {
    destructive: true,
  },
};
