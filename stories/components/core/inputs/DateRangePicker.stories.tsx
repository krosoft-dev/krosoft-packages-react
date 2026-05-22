import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DateRangePicker } from "@/components/core/inputs/DateRangePicker";
import type { DateRange } from "react-day-picker";

const meta: Meta<typeof DateRangePicker> = {
  title: "Core/Inputs/DateRangePicker",
  component: DateRangePicker,
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  args: {
    onChange: (range?: DateRange) => {
      console.log("range:", range);
    },
  },
};

export const WithValue: Story = {
  args: {
    value: {
      from: new Date(2024, 0, 15),
      to: new Date(2024, 0, 28),
    },
    onChange: (range?: DateRange) => {
      console.log("range:", range);
    },
  },
};

export const WithSingleDate: Story = {
  args: {
    value: {
      from: new Date(),
      to: new Date(),
    },
    onChange: (range?: DateRange) => {
      console.log("range:", range);
    },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Choisir une plage de dates...",
    onChange: (range?: DateRange) => {
      console.log("range:", range);
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>();
    return (
      <div className="flex flex-col gap-4">
        <DateRangePicker value={range} onChange={setRange} />
        <p className="text-sm text-muted-foreground">
          {range?.from ? (
            <>
              Du <strong>{range.from.toLocaleDateString("fr-FR")}</strong>
              {range.to && range.from.getTime() !== range.to.getTime() && (
                <> au <strong>{range.to.toLocaleDateString("fr-FR")}</strong></>
              )}
            </>
          ) : (
            "Aucune periode selectionnee"
          )}
        </p>
      </div>
    );
  },
};
