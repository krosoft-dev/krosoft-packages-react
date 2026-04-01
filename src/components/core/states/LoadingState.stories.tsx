import type { Meta, StoryObj } from "@storybook/react";
import { LoadingState } from "./LoadingState";

const meta: Meta<typeof LoadingState> = {
  title: "Core/States/LoadingState",
  component: LoadingState,
};

export default meta;

type Story = StoryObj<typeof LoadingState>;

export const Default: Story = {};

export const WithMessage: Story = {
  args: {
    message: "Chargement des modèles...",
  },
};
