import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmDeleteDialog } from "@/components/core/dialogs/ConfirmDeleteDialog";
import { Button } from "@/components/ui/button";
import type { ConfirmDialogConfig } from "@/types/ConfirmDialogConfig";

const meta: Meta<typeof ConfirmDeleteDialog> = {
  title: "Core/Dialogs/ConfirmDeleteDialog",
  component: ConfirmDeleteDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isLoading: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDeleteDialog>;

const makeConfig = (overrides: Partial<ConfirmDialogConfig> = {}): ConfirmDialogConfig => ({
  isOpen: false,
  title: "Confirmer la suppression",
  description: "Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet élément ?",
  itemName: null,
  confirmKey: "",
  openDialog: () => {},
  onClose: () => {},
  onConfirm: async () => {},
  ...overrides,
});

const DialogWrapper = (args: React.ComponentProps<typeof ConfirmDeleteDialog>): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const config: ConfirmDialogConfig = {
    ...args.config,
    isOpen,
    onClose: () => setIsOpen(false),
    onConfirm: async () => {
      await new Promise(r => setTimeout(r, 1000));
      setIsOpen(false);
    },
  };

  return (
    <div>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        Supprimer
      </Button>
      <ConfirmDeleteDialog {...args} config={config} />
    </div>
  );
};

export const Default: Story = {
  render: DialogWrapper,
  args: {
    isLoading: false,
    error: null,
    config: makeConfig(),
  },
};

export const WithItemName: Story = {
  render: DialogWrapper,
  args: {
    isLoading: false,
    error: null,
    config: makeConfig({ itemName: "Facture #2024-001" }),
  },
};

export const Loading: Story = {
  render: DialogWrapper,
  args: {
    isLoading: true,
    error: null,
    config: makeConfig({ isOpen: true, itemName: "Client Dupont SARL" }),
  },
};

export const WithError: Story = {
  render: DialogWrapper,
  args: {
    isLoading: false,
    error: new Error("Impossible de supprimer cet élément : des dépendances existent."),
    config: makeConfig({ isOpen: true, itemName: "Produit XYZ" }),
  },
};
