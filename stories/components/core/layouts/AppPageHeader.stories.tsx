import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, Edit, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import { AppPageHeader } from "@/components/core/layouts/AppPageHeader";

const withRouter = (Story: React.ComponentType) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

const meta: Meta<typeof AppPageHeader> = {
  title: "Core/Layouts/AppPageHeader",
  component: AppPageHeader,
  decorators: [withRouter],
  args: {
    titleKey: "Mon Titre de Page",
    descriptionKey: "Une description claire de ce que fait cette page et ses fonctionnalités associées.",
  },
};

export default meta;
type Story = StoryObj<typeof AppPageHeader>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    icon: Calendar,
  },
};

export const WithBackLink: Story = {
  args: {
    backTo: "/dashboard",
  },
};

export const WithActions: Story = {
  args: {
    icon: Calendar,
    backTo: "/dashboard",
    actions: [
      {
        labelKey: "Modifier",
        icon: Edit,
        variant: "outline",
        onClick: () => alert("Modifier cliqué"),
      },
      {
        labelKey: "Créer",
        icon: Plus,
        onClick: () => alert("Créer cliqué"),
      },
    ],
  },
};

export const WithDestructiveAction: Story = {
  args: {
    icon: Calendar,
    actions: [
      {
        labelKey: "Supprimer",
        icon: Trash2,
        variant: "destructive",
        onClick: () => alert("Supprimer cliqué"),
      },
    ],
  },
};
