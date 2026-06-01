import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useConfirmDeleteDialog } from "@/hooks/behavior/useConfirmDeleteDialog";
import { ConfirmationDialog } from "@/components/core/dialogs/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import type { ErrorHttp } from "@krosoft/core/types";

/**
 * Demo component that shows the hook driving the ConfirmationDialog for deletion.
 */
const UseConfirmDeleteDialogDemo = ({
  simulateError,
  simulateLoading,
  confirmKey,
}: {
  simulateError?: boolean;
  simulateLoading?: boolean;
  confirmKey?: string;
}): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorHttp | Error | null>(null);

  const config = useConfirmDeleteDialog({
    titleKey: "Confirmer la suppression",
    descriptionKey: "Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet élément ?",
    confirmKey,
    onConfirm: async (_id: string) => {
      setError(null);
      setIsLoading(true);

      await new Promise(r => setTimeout(r, 1500));

      if (simulateError) {
        setIsLoading(false);
        setError(new Error("Impossible de supprimer cet élément : des dépendances existent."));
        throw new Error("Delete failed");
      }

      setIsLoading(false);
    },
    onReset: () => {
      setError(null);
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-sm text-muted-foreground mb-2">Cliquez sur le bouton pour ouvrir le dialogue de confirmation de suppression.</p>
      <div className="flex gap-3">
        <Button variant="destructive" onClick={() => config.openDialog("1", "Facture #2024-001")}>
          Supprimer « Facture #2024-001 »
        </Button>
        <Button variant="destructive" onClick={() => config.openDialog("2", "Client Dupont SARL")}>
          Supprimer « Client Dupont SARL »
        </Button>
      </div>
      <ConfirmationDialog isLoading={simulateLoading ?? isLoading} error={error} config={config} destructive />
    </div>
  );
};

const meta: Meta<typeof UseConfirmDeleteDialogDemo> = {
  title: "Hooks/useConfirmDeleteDialog",
  component: UseConfirmDeleteDialogDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    simulateError: {
      control: "boolean",
      description: "Simule une erreur lors de la suppression",
    },
    simulateLoading: {
      control: "boolean",
      description: "Force l'état de chargement",
    },
    confirmKey: {
      control: "text",
      description: "Texte du bouton de confirmation",
    },
  },
};

export default meta;
type Story = StoryObj<typeof UseConfirmDeleteDialogDemo>;

/**
 * Utilisation par défaut du hook. Cliquez sur un bouton pour ouvrir le dialogue,
 * puis confirmez ou annulez la suppression.
 */
export const Default: Story = {
  args: {
    simulateError: false,
    simulateLoading: false,
  },
};

/**
 * Simule une erreur retournée par l'API lors de la suppression.
 * Le dialogue reste ouvert et affiche le message d'erreur.
 */
export const WithError: Story = {
  args: {
    simulateError: true,
    simulateLoading: false,
  },
};

/**
 * Force l'état de chargement pour montrer le comportement du dialogue
 * pendant l'appel API (boutons désactivés, texte « Suppression... »).
 */
export const Loading: Story = {
  args: {
    simulateError: false,
    simulateLoading: true,
  },
};

/**
 * Utilisation avec un texte de confirmation personnalisé.
 */
export const CustomConfirmKey: Story = {
  args: {
    simulateError: false,
    simulateLoading: false,
    confirmKey: "Oui, supprimer définitivement",
  },
};
