import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SearchableSelect } from "@/components/core/inputs/SearchableSelect";

const PAYS = [
  { value: "fr", label: "France" },
  { value: "be", label: "Belgique" },
  { value: "ch", label: "Suisse" },
  { value: "lu", label: "Luxembourg" },
  { value: "de", label: "Allemagne" },
  { value: "es", label: "Espagne" },
  { value: "it", label: "Italie" },
  { value: "pt", label: "Portugal" },
  { value: "nl", label: "Pays-Bas" },
  { value: "gb", label: "Royaume-Uni" },
];

const meta: Meta<typeof SearchableSelect> = {
  title: "Core/Inputs/SearchableSelect",
  component: SearchableSelect,
  decorators: [
    (Story) => (
      <div className="w-64 pb-72">
        <Story />
      </div>
    ),
  ],
  args: {
    options: PAYS,
    value: undefined,
    onChange: () => {},
    placeholder: "Sélectionner un pays",
  },
};

export default meta;
type Story = StoryObj<typeof SearchableSelect>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: "fr",
  },
};

export const CustomPlaceholders: Story = {
  args: {
    placeholder: "Choisir un pays...",
    searchPlaceholder: "Taper pour filtrer...",
  },
};

export const ManyOptions: Story = {
  args: {
    options: [
      ...PAYS,
      { value: "pl", label: "Pologne" },
      { value: "ro", label: "Roumanie" },
      { value: "cz", label: "République Tchèque" },
      { value: "at", label: "Autriche" },
      { value: "se", label: "Suède" },
      { value: "dk", label: "Danemark" },
      { value: "fi", label: "Finlande" },
    ],
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div className="w-64 pb-72 space-y-2">
        <SearchableSelect options={PAYS} value={value} onChange={setValue} placeholder="Sélectionner un pays" />
        <p className="text-xs text-muted-foreground">
          {value !== undefined ? `Sélectionné : ${PAYS.find(p => p.value === value)?.label}` : "Aucune sélection"}
        </p>
      </div>
    );
  },
};
