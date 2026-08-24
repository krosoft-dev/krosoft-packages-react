import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Edit, FolderOpen, Plus, Share2, Trash2, Users } from "lucide-react";
import { AppPageHeader } from "@/components/core/layouts/AppPageHeader";
import { Badge } from "@/components/ui";

const meta: Meta<typeof AppPageHeader> = {
  title: "Core/Layouts/AppPageHeader",
  component: AppPageHeader,
  args: {
    titleKey: "Tableau de bord",
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof AppPageHeader>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    titleKey: "Utilisateurs",
    descriptionKey: "Gérez les comptes et les permissions de votre équipe",
  },
};

export const WithIcon: Story = {
  args: {
    titleKey: "Utilisateurs",
    descriptionKey: "Gérez les comptes et les permissions de votre équipe",
    icon: Users,
  },
};

export const WithBackButton: Story = {
  args: {
    titleKey: "Détail du dossier",
    descriptionKey: "Informations complètes sur le dossier sélectionné",
    icon: FolderOpen,
    onBack: () => {},
  },
};

export const WithActions: Story = {
  args: {
    titleKey: "Utilisateurs",
    descriptionKey: "Gérez les comptes et les permissions de votre équipe",
    icon: Users,
    actions: [
      { labelKey: "Modifier", icon: Edit, variant: "outline", onClick: () => {} },
      { labelKey: "Ajouter", icon: Plus, onClick: () => {} },
    ],
  },
};

export const WithDestructiveAction: Story = {
  args: {
    titleKey: "Utilisateurs",
    descriptionKey: "Gérez les comptes et les permissions de votre équipe",
    icon: Users,
    actions: [
      { labelKey: "Modifier", icon: Edit, variant: "outline", onClick: () => {} },
      { labelKey: "Supprimer", icon: Trash2, variant: "destructive", onClick: () => {} },
    ],
  },
};

export const WithDropdownAction: Story = {
  args: {
    titleKey: "Documents",
    descriptionKey: "Gérez et exportez vos documents",
    icon: FolderOpen,
    actions: [
      { labelKey: "Ajouter", icon: Plus, onClick: () => {} },
      {
        labelKey: "Exporter",
        icon: Share2,
        variant: "outline",
        children: [
          { labelKey: "Télécharger en PDF", icon: Download, onClick: () => {} },
          { labelKey: "Télécharger en CSV", icon: Download, onClick: () => {} },
        ],
      },
    ],
  },
};

export const WithPreActions: Story = {
  args: {
    titleKey: "Utilisateurs",
    descriptionKey: "Gérez les comptes et les permissions de votre équipe",
    icon: Users,
    renderPreActions: () => <Badge variant="secondary">12 actifs</Badge>,
    actions: [{ labelKey: "Ajouter", icon: Plus, onClick: () => {} }],
  },
};

export const WithBackAndActions: Story = {
  args: {
    titleKey: "Détail utilisateur",
    descriptionKey: "Informations complètes sur l'utilisateur sélectionné",
    icon: Users,
    onBack: () => {},
    actions: [
      { labelKey: "Modifier", icon: Edit, variant: "outline", onClick: () => {} },
      { labelKey: "Supprimer", icon: Trash2, variant: "destructive", onClick: () => {} },
    ],
  },
};

export const FullExample: Story = {
  args: {
    titleKey: "Gestion des dossiers",
    descriptionKey: "Créez, modifiez et gérez l'ensemble de vos dossiers clients",
    icon: FolderOpen,
    onBack: () => {},
    renderPreActions: () => <Badge>48 dossiers</Badge>,
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
      { labelKey: "Ajouter", icon: Plus, onClick: () => {} },
    ],
  },
};
