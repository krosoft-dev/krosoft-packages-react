import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useConfirmationDialog } from "@/hooks/behavior/useConfirmationDialog";
import { ConfirmationDialog } from "@/components/core/dialogs/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import type { ErrorHttp } from "@krosoft/core/types";

/**
 * Demo component that shows the ConfirmationDialog driven by useConfirmationDialog.
 */
const ConfirmationDialogDemo = ({
  simulateError,
  simulateLoading,
  destructive,
}: {
  simulateError?: boolean;
  simulateLoading?: boolean;
  destructive?: boolean;
}): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorHttp | Error | null>(null);

  const config = useConfirmationDialog({
    titleKey: "Confirmer l'action",
    descriptionKey: "Êtes-vous sûr de vouloir effectuer cette action ?",
    onConfirm: async (_id: string) => {
      setError(null);
      setIsLoading(true);

      await new Promise(r => setTimeout(r, 1500));

      if (simulateError) {
        setIsLoading(false);
        setError(new Error("Impossible d'effectuer cette action."));
        throw new Error("Action failed");
      }

      setIsLoading(false);
    },
    onReset: () => {
      setError(null);
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-sm text-muted-foreground mb-2">Cliquez sur le bouton pour ouvrir le dialogue de confirmation.</p>
      <Button onClick={() => config.openDialog("1", "Élément #1")}>Confirmer l'action</Button>
      <ConfirmationDialog isLoading={simulateLoading ?? isLoading} error={error} config={config} destructive={destructive} />
    </div>
  );
};

const meta: Meta<typeof ConfirmationDialogDemo> = {
  title: "Core/Dialogs/ConfirmationDialog",
  component: ConfirmationDialogDemo,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    simulateError: {
      control: "boolean",
      description: "Simule une erreur lors de la confirmation",
    },
    simulateLoading: {
      control: "boolean",
      description: "Force l'état de chargement",
    },
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
    simulateError: false,
    simulateLoading: false,
    destructive: false,
  },
};

export const Destructive: Story = {
  args: {
    simulateError: false,
    simulateLoading: false,
    destructive: true,
  },
};

export const WithError: Story = {
  args: {
    simulateError: true,
    simulateLoading: false,
    destructive: false,
  },
};

export const Loading: Story = {
  args: {
    simulateError: false,
    simulateLoading: true,
    destructive: false,
  },
};
