import type { Meta, StoryObj } from "@storybook/react";
import { ErrorState } from "./ErrorState";

const meta: Meta<typeof ErrorState> = {
  title: "Core/States/ErrorState",
  component: ErrorState,
};

export default meta;

type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {};

export const WithMessage: Story = {
  args: {
    message: "Impossible de charger les données. Veuillez réessayer.",
  },
};

export const WithLongMessage: Story = {
  args: {
    message: "Une erreur réseau est survenue lors de la récupération des données. Vérifiez votre connexion internet et réessayez dans quelques instants.",
  },
};
