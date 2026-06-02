import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useDialog } from "@/hooks/behavior/useDialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Demo component that shows the useDialog hook managing dialog state.
 */
const UseDialogDemo = (): React.ReactElement => {
  const dialog = useDialog();

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-sm text-muted-foreground mb-2">
        Cliquez sur un bouton pour ouvrir le dialogue. Le hook gère l'état open/close et l'élément sélectionné.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => dialog.openDialog("1", "Facture #2024-001")}>
          Sélectionner « Facture #2024-001 »
        </Button>
        <Button onClick={() => dialog.openDialog("2", "Client Dupont SARL")}>
          Sélectionner « Client Dupont SARL »
        </Button>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        <p>isOpen: <strong>{String(dialog.isOpen)}</strong></p>
        <p>id: <strong>{dialog.id ?? "null"}</strong></p>
        <p>name: <strong>{dialog.name ?? "null"}</strong></p>
      </div>
      <AlertDialog open={dialog.isOpen} onOpenChange={open => { if (!open) dialog.onClose(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Élément sélectionné</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez sélectionné : <span className="font-semibold">{dialog.name}</span> (id: {dialog.id})
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fermer</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const meta: Meta<typeof UseDialogDemo> = {
  title: "Hooks/useDialog",
  component: UseDialogDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UseDialogDemo>;

/**
 * Utilisation de base du hook useDialog.
 * Gère l'état open/close et l'élément sélectionné (id + name).
 */
export const Default: Story = {};
