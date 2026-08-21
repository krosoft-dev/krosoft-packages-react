import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useConfirmationDialog } from "@/hooks/behavior/useConfirmationDialog";
import { ConfirmationDialog } from "@/components/core/dialogs/ConfirmationDialog";
import { Button } from "@/components/ui/button";

/**
 * Demo component that shows the hook driving the ConfirmationDialog.
 */
const UseConfirmationDialogDemo = ({
  simulateLoading,
  destructive,
  confirmKey,
}: {
  simulateLoading?: boolean;
  destructive?: boolean;
  confirmKey?: string;
}): React.ReactElement => {
  const config = useConfirmationDialog({
    titleKey: "Confirmer l'action",
    descriptionKey: "Êtes-vous sûr de vouloir effectuer cette action ?",
    confirmKey,
    onConfirm: async (_id: string) => {
      await new Promise(r => setTimeout(r, simulateLoading ? 60000 : 1500));
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-sm text-muted-foreground mb-2">Cliquez sur un bouton pour ouvrir le dialogue de confirmation.</p>
      <div className="flex gap-3">
        <Button onClick={() => config.openDialog("1", "Facture #2024-001")}>Confirmer « Facture #2024-001 »</Button>
        <Button onClick={() => config.openDialog("2", "Client Dupont SARL")}>Confirmer « Client Dupont SARL »</Button>
      </div>
      <ConfirmationDialog isLoading={false} error={null} config={config} destructive={destructive} />
    </div>
  );
};

const meta: Meta<typeof UseConfirmationDialogDemo> = {
  title: "Hooks/useConfirmationDialog",
  component: UseConfirmationDialogDemo,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    simulateLoading: {
      control: "boolean",
      description: "Simule un chargement long lors de la confirmation",
    },
    destructive: {
      control: "boolean",
      description: "Affiche le bouton de confirmation en mode destructif",
    },
    confirmKey: {
      control: "text",
      description: "Texte du bouton de confirmation",
    },
  },
};

export default meta;
type Story = StoryObj<typeof UseConfirmationDialogDemo>;

/**
 * Utilisation par défaut du hook. Cliquez sur un bouton pour ouvrir le dialogue,
 * puis confirmez ou annulez l'action.
 */
export const Default: Story = {
  args: {
    simulateLoading: false,
    destructive: false,
  },
};

/**
 * Mode destructif pour les actions dangereuses.
 * Le bouton de confirmation est affiché en rouge.
 */
export const Destructive: Story = {
  args: {
    simulateLoading: false,
    destructive: true,
  },
};

/**
 * Utilisation avec un texte de confirmation personnalisé.
 */
export const CustomConfirmKey: Story = {
  args: {
    simulateLoading: false,
    destructive: false,
    confirmKey: "Oui, je confirme",
  },
};
