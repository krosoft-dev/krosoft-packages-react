import type { Meta, StoryObj } from "@storybook/react";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

const meta: Meta<typeof Toast> = {
  title: "UI/Toast",
  component: Toast,
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <ToastViewport />
      </ToastProvider>
    ),
  ],
  args: {
    open: true,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: (args) => (
    <Toast {...args}>
      <ToastTitle>Sauvegarde réussie</ToastTitle>
      <ToastDescription>Vos modifications ont été enregistrées.</ToastDescription>
      <ToastClose />
    </Toast>
  ),
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
  render: (args) => (
    <Toast {...args}>
      <ToastTitle>Erreur</ToastTitle>
      <ToastDescription>Une erreur est survenue. Veuillez réessayer.</ToastDescription>
      <ToastClose />
    </Toast>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <Toast {...args}>
      <div className="grid gap-1">
        <ToastTitle>Mise à jour disponible</ToastTitle>
        <ToastDescription>Une nouvelle version est prête à être installée.</ToastDescription>
      </div>
      <ToastAction altText="Mettre à jour">Mettre à jour</ToastAction>
      <ToastClose />
    </Toast>
  ),
};

export const TitleOnly: Story = {
  render: (args) => (
    <Toast {...args}>
      <ToastTitle>Opération effectuée</ToastTitle>
      <ToastClose />
    </Toast>
  ),
};
