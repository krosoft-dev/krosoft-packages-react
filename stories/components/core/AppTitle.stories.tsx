import type { Meta, StoryObj } from "@storybook/react";
import { AppTitle } from "@/components/core/layouts/AppTitle";

const meta: Meta<typeof AppTitle> = {
  title: "Core/AppTitle",
  component: AppTitle,
  args: {
    titleKey: "Tableau de bord",
  },
};

export default meta;
type Story = StoryObj<typeof AppTitle>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    titleKey: "Utilisateurs",
    descriptionKey: "Gérez les comptes et les permissions de votre équipe",
  },
};

export const SubTitle: Story = {
  args: {
    titleKey: "Informations générales",
    isSubTitle: true,
  },
};

export const SubTitleWithDescription: Story = {
  args: {
    titleKey: "Contacts",
    descriptionKey: "Liste des contacts associés à ce dossier",
    isSubTitle: true,
  },
};
