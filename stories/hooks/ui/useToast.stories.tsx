import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useToast, toast } from "@/hooks/ui/useToast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

/**
 * Toaster component that renders active toasts.
 */
const Toaster = () => {
  const { toasts } = useToast();
  return (
    <>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </>
  );
};

/**
 * Demo component that shows the useToast hook and toast function.
 */
const UseToastDemo = (): React.ReactElement => {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-sm text-muted-foreground mb-2">Cliquez sur un bouton pour afficher un toast.</p>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() =>
            toast({
              title: "Succès",
              description: "L'opération a été effectuée avec succès.",
            })
          }
        >
          Toast par défaut
        </Button>
        <Button
          variant="destructive"
          onClick={() =>
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Une erreur est survenue lors de l'opération.",
            })
          }
        >
          Toast erreur
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: "Information",
              description: "Ceci est un message informatif.",
            })
          }
        >
          Toast info
        </Button>
      </div>
      <Toaster />
    </div>
  );
};

const meta: Meta<typeof UseToastDemo> = {
  title: "Hooks/useToast",
  component: UseToastDemo,
  decorators: [
    Story => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UseToastDemo>;

/**
 * Démonstration du hook useToast avec différents types de toasts :
 * défaut, erreur (destructive) et informatif.
 */
export const Default: Story = {};
