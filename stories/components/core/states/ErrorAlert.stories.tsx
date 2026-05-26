import type { Meta, StoryObj } from "@storybook/react";
import { ErrorAlert } from "@/components/core/states/ErrorAlert";

const meta: Meta<typeof ErrorAlert> = {
  title: "Core/States/ErrorAlert",
  component: ErrorAlert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ErrorAlert>;

export const Simple: Story = {
  args: {
    error: {
      code: "NOT_FOUND",
      message: "La ressource demandée est introuvable.",
      errors: [],
    },
  },
};

export const WithValidationErrors: Story = {
  args: {
    error: {
      code: "VALIDATION_ERROR",
      message: "Les données soumises sont invalides.",
      errors: ["Le champ 'Nom' est obligatoire.", "L'adresse e-mail est invalide.", "Le mot de passe doit contenir au moins 8 caractères."],
    },
  },
};

export const NoError: Story = {
  args: {
    error: null,
  },
};
