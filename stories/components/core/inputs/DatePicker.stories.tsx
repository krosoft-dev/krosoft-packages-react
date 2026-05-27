import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DatePicker } from "@/components/core/inputs/DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Core/Inputs/DatePicker",
  component: DatePicker,
  args: {
    placeholder: "Sélectionner une date",
    onDateChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-64 pb-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    date: undefined,
  },
};

export const WithDate: Story = {
  args: {
    date: new Date("2024-06-15"),
  },
};

export const CustomPlaceholder: Story = {
  args: {
    date: undefined,
    placeholder: "Date de début de mission",
  },
};

export const Interactive: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <div className="w-64 space-y-3 pb-96">
        <DatePicker date={date} onDateChange={setDate} placeholder="Sélectionner une date" />
        <p className="text-sm text-muted-foreground">
          {date !== undefined ? `Sélectionné : ${date.toLocaleDateString("fr-FR")}` : "Aucune date sélectionnée"}
        </p>
      </div>
    );
  },
};
