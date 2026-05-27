import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <div className="w-48">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choisir..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <div className="w-48">
      <Select defaultValue="option2">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <div className="w-56">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Pomme</SelectItem>
            <SelectItem value="banana">Banane</SelectItem>
            <SelectItem value="mango">Mangue</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Légumes</SelectLabel>
            <SelectItem value="carrot">Carotte</SelectItem>
            <SelectItem value="onion">Oignon</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-48">
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Désactivé" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <div className="w-48">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choisir..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2" disabled>
            Option 2 (désactivée)
          </SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="flex flex-col gap-4 w-56">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Clair</SelectItem>
            <SelectItem value="dark">Sombre</SelectItem>
            <SelectItem value="system">Système</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">Valeur : {value || "(aucune)"}</p>
      </div>
    );
  },
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="flex flex-col gap-4 w-56">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger onClear={value ? () => setValue("") : undefined}>
            <SelectValue placeholder="Choisir une option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Clair</SelectItem>
            <SelectItem value="dark">Sombre</SelectItem>
            <SelectItem value="system">Système</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">Valeur : {value || "(aucune)"}</p>
      </div>
    );
  },
};
