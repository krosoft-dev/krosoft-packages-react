import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Trash2 } from "lucide-react";
import { AppTabHeader } from "@/components/core/tabs/AppTabHeader";

const meta: Meta<typeof AppTabHeader> = {
  title: "Core/Tabs/AppTabHeader",
  component: AppTabHeader,
  args: {
    titleKey: "Informations générales",
  },
};

export default meta;
type Story = StoryObj<typeof AppTabHeader>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    titleKey: "Contacts",
    descriptionKey: "Liste des contacts associés à ce dossier",
  },
};

export const WithActions: Story = {
  args: {
    titleKey: "Documents",
    actions: [
      {
        labelKey: "Ajouter",
        icon: Plus,
        onClick: () => {},
      },
    ],
  },
};

export const WithMultipleActions: Story = {
  args: {
    titleKey: "Équipe",
    descriptionKey: "Membres de l'équipe projet",
    actions: [
      {
        labelKey: "Ajouter un membre",
        icon: Plus,
        onClick: () => {},
      },
      {
        labelKey: "Supprimer la sélection",
        icon: Trash2,
        variant: "destructive",
        onClick: () => {},
      },
    ],
  },
};
