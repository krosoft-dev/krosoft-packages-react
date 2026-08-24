import type { Meta, StoryObj } from "@storybook/react-vite";
import { JsonTableOutput } from "@/components/core/table/JsonTableOutput";

const meta: Meta<typeof JsonTableOutput> = {
  title: "Core/Table/JsonTableOutput",
  component: JsonTableOutput,
  args: {
    header: "Résultat",
  },
};

export default meta;

type Story = StoryObj<typeof JsonTableOutput>;

export const ArrayOfObjects: Story = {
  args: {
    output: JSON.stringify([
      { id: 1, nom: "Alice", role: "Admin", actif: true },
      { id: 2, nom: "Bob", role: "User", actif: false },
      { id: 3, nom: "Charlie", role: "User", actif: true },
    ]),
  },
};

export const SimpleObject: Story = {
  args: {
    output: JSON.stringify({
      id: "abc-123",
      nom: "Serveur principal",
      cpu: 42.5,
      actif: true,
      tags: ["prod", "eu-west"],
    }),
  },
};

export const NestedValues: Story = {
  args: {
    output: JSON.stringify([
      { id: 1, user: { nom: "Alice", email: "alice@example.com" }, roles: ["admin", "editor"] },
      { id: 2, user: { nom: "Bob", email: "bob@example.com" }, roles: ["viewer"] },
    ]),
  },
};

export const InvalidJson: Story = {
  args: {
    output: "Ceci n'est pas du JSON valide {",
  },
};

export const WithoutHeader: Story = {
  args: {
    header: undefined,
    output: JSON.stringify({ status: "ok", code: 200 }),
  },
};

export const EmptyOutput: Story = {
  args: {
    output: "",
  },
};
