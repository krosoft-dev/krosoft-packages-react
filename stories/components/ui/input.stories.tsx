import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  args: {
    placeholder: "Saisir du texte...",
    disabled: false,
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Saisir du texte...",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Valeur par défaut",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Mot de passe...",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "email@exemple.com",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "0",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Désactivé",
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      <Input type="text" placeholder="text" />
      <Input type="email" placeholder="email" />
      <Input type="password" placeholder="password" />
      <Input type="number" placeholder="number" />
      <Input disabled placeholder="disabled" />
    </div>
  ),
};
