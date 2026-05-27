import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Edit, Plus, Share2, Trash2 } from "lucide-react";
import { AppActions } from "@/components/core/layouts/AppActions";

const meta: Meta<typeof AppActions> = {
  title: "Core/Layouts/AppActions",
  component: AppActions,
  args: {
    actions: [
      {
        labelKey: "Ajouter",
        icon: Plus,
        onClick: () => {},
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof AppActions>;

export const Default: Story = {};

export const WithVariants: Story = {
  args: {
    actions: [
      { labelKey: "Modifier", icon: Edit, variant: "outline", onClick: () => {} },
      { labelKey: "Supprimer", icon: Trash2, variant: "destructive", onClick: () => {} },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    actions: [
      { labelKey: "Modifier", icon: Edit, onClick: () => {} },
      { labelKey: "Supprimer", icon: Trash2, variant: "destructive", onClick: () => {}, disabled: true },
    ],
  },
};

export const WithDropdown: Story = {
  args: {
    actions: [
      { labelKey: "Ajouter", icon: Plus, onClick: () => {} },
      {
        labelKey: "Exporter",
        icon: Share2,
        children: [
          { labelKey: "Télécharger en PDF", icon: Download, onClick: () => {} },
          { labelKey: "Télécharger en CSV", icon: Download, onClick: () => {} },
        ],
      },
    ],
  },
};

export const MultipleActions: Story = {
  args: {
    actions: [
      { labelKey: "Modifier", icon: Edit, variant: "outline", onClick: () => {} },
      {
        labelKey: "Exporter",
        icon: Share2,
        variant: "outline",
        children: [
          { labelKey: "Télécharger en PDF", icon: Download, onClick: () => {} },
          { labelKey: "Télécharger en CSV", icon: Download, onClick: () => {} },
        ],
      },
      { labelKey: "Supprimer", icon: Trash2, variant: "destructive", onClick: () => {} },
    ],
  },
};
