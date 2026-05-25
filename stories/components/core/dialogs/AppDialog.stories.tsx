import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppDialog } from "@/components/core/dialogs/AppDialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

const meta: Meta<typeof AppDialog> = {
  title: "Core/Dialogs/AppDialog",
  component: AppDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
    },
    isLoading: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppDialog>;

const DialogWrapper = (args: React.ComponentProps<typeof AppDialog>): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const { open: _open, onOpenChange: _onOpenChange, ...restArgs } = args;

  return (
    <div>
      <Button
        onClick={(): void => {
          setOpen(true);
        }}
      >
        Ouvrir le dialogue
      </Button>
      <AppDialog {...restArgs} open={open} onOpenChange={setOpen}>
        <div className="py-4 text-sm text-gray-700 dark:text-gray-300">
          Ceci est le contenu du dialogue. Vous pouvez y mettre n&apos;importe quel composant React, des formulaires, des listes, etc.
        </div>
      </AppDialog>
    </div>
  );
};

export const Default: Story = {
  render: DialogWrapper,
  args: {
    open: false,
    onOpenChange: (): void => {},
    config: {
      title: "Action requise",
      description: "Veuillez confirmer cette action avant de continuer.",
      icon: Info,
      actions: [
        {
          label: "Annuler",
          onClick: (): void => {},
          variant: "outline",
        },
        {
          label: "Confirmer",
          onClick: (): void => {},
          variant: "default",
        },
      ],
    },
    isLoading: false,
    error: null,
  },
};

export const Loading: Story = {
  render: DialogWrapper,
  args: {
    open: false,
    onOpenChange: (): void => {},
    config: {
      title: "Traitement en cours",
      description: "Veuillez patienter pendant l'exécution de l'opération.",
      icon: Info,
    },
    isLoading: true,
  },
};

export const WithError: Story = {
  render: DialogWrapper,
  args: {
    open: false,
    onOpenChange: (): void => {},
    config: {
      title: "Échec de l'opération",
      description: "Nous n'avons pas pu terminer ce que vous avez demandé.",
      icon: AlertCircle,
      actions: [
        {
          label: "Fermer",
          onClick: (): void => {},
          variant: "default",
        },
      ],
    },
    error: new Error("Une erreur de connexion au serveur s'est produite. Veuillez réessayer plus tard."),
  },
};

export const CustomMaxWidth: Story = {
  render: DialogWrapper,
  args: {
    open: false,
    onOpenChange: (): void => {},
    config: {
      title: "Conditions d'utilisation",
      description: "Veuillez lire attentivement nos conditions d'utilisation.",
      maxWidth: "sm:max-w-4xl",
      icon: CheckCircle,
      actions: [
        {
          label: "J'accepte",
          onClick: (): void => {},
          variant: "default",
        },
      ],
    },
  },
};
