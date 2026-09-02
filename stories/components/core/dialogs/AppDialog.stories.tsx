import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppDialog } from "@/components/core/dialogs/AppDialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

const meta: Meta<typeof AppDialog> = {
  title: "Core/Dialogs/AppDialog",
  component: AppDialog,
  parameters: {
    layout: "centered",
  },
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

export const LargeSize: Story = {
  render: DialogWrapper,
  args: {
    open: false,
    onOpenChange: (): void => {},
    config: {
      title: "Conditions d'utilisation",
      description: "Veuillez lire attentivement nos conditions d'utilisation.",
      size: "4xl",
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

// Pendant un chargement la dialog se verrouille : ni échap, ni croix, ni overlay.
// « Annuler » s'en exclut explicitement, sinon un envoi long n'offrirait plus aucune sortie.
export const LoadingWithEscapeHatch: Story = {
  render: DialogWrapper,
  args: {
    open: false,
    onOpenChange: (): void => {},
    config: {
      title: "Envoi en cours",
      description: "La dialog reste ouverte tant que l'envoi n'est pas terminé.",
      icon: Info,
      actions: [
        {
          label: "Annuler",
          onClick: (): void => {},
          variant: "outline",
          disableOnLoading: false,
        },
        {
          label: "Envoyer",
          onClick: (): void => {},
          variant: "default",
        },
      ],
    },
    isLoading: true,
  },
};

export const CustomFooter: Story = {
  render: DialogWrapper,
  args: {
    open: false,
    onOpenChange: (): void => {},
    config: {
      title: "Pied de dialog libre",
      description: "`footer` prend le pas sur `config.actions` quand le gabarit ne suffit plus.",
      icon: CheckCircle,
    },
    footer: (
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">3 éléments sélectionnés</span>
        <Button>Appliquer</Button>
      </div>
    ),
  },
};
