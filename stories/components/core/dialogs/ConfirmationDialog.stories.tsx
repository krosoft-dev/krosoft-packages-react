import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConfirmationDialog } from "@/components/core/dialogs/ConfirmationDialog";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof ConfirmationDialog> = {
  title: "Core/Dialogs/ConfirmationDialog",
  component: ConfirmationDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    destructive: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmationDialog>;

export const Default: Story = {
  args: {
    title: "Confirmer l'action",
    description: "Êtes-vous sûr de vouloir effectuer cette action ?",
    onConfirm: () => {},
    children: <Button>Ouvrir</Button>,
  },
};

export const Destructive: Story = {
  args: {
    title: "Supprimer l'élément",
    description: "Cette action est irréversible. L'élément sera définitivement supprimé.",
    confirmText: "Supprimer",
    destructive: true,
    onConfirm: () => {},
    children: <Button variant="destructive">Supprimer</Button>,
  },
};

export const CustomLabels: Story = {
  args: {
    title: "Publier l'article",
    description: "L'article sera visible par tous les utilisateurs.",
    confirmText: "Publier",
    cancelText: "Pas maintenant",
    onConfirm: () => {},
    children: <Button>Publier</Button>,
  },
};
