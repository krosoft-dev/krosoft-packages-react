import { KpiCardProps } from "@/components/core/cards/KpiCard";
import { KpiMultiCard } from "@/components/core/cards/KpiMultiCard";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileOutputIcon, InboxIcon, SendIcon } from "lucide-react";

const kpi = (titleKey: string, value: number, increase: number, icon = SendIcon): KpiCardProps => ({
  titleKey,
  value,
  icon,
  description: `+${String(increase)} ce mois-ci`,
  descriptionClassName: "text-blue-600",
});

const meta: Meta<typeof KpiMultiCard> = {
  title: "Core/Cards/KpiMultiCard",
  component: KpiMultiCard,
  args: {
    items: [kpi("Dépôts", 10448, 54), kpi("Réceptions", 2330, 505, InboxIcon)],
  },
};

export default meta;

type Story = StoryObj<typeof KpiMultiCard>;

export const Two: Story = {
  decorators: [
    (Story): React.ReactElement => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export const Four: Story = {
  args: {
    items: [
      kpi("Dépôts Chorus", 10448, 54),
      kpi("Réceptions Chorus", 2330, 505, InboxIcon),
      kpi("Exports PPF", 59404, 20026),
      kpi("Imports PPF", 74, 42, InboxIcon),
    ],
  },
};

export const Six: Story = {
  args: {
    items: [
      kpi("Dépôts SC", 1200, 12),
      kpi("Réceptions SC", 980, 8, InboxIcon),
      kpi("Dépôts PA", 3400, 120),
      kpi("Réceptions PA", 2100, 95, InboxIcon),
      kpi("Dépôts V2", 450, 3),
      kpi("Réceptions V2", 310, 1, InboxIcon),
    ],
  },
};

export const Eight: Story = {
  args: {
    items: [
      kpi("Dépôts Chorus", 10448, 54),
      kpi("Réceptions Chorus", 2330, 505, InboxIcon),
      kpi("Flux F1", 812, 40, FileOutputIcon),
      kpi("Flux F2 émis", 1520, 12),
      kpi("Flux F2 reçus", 640, 7, InboxIcon),
      kpi("Exports PPF", 59404, 20026),
      kpi("Imports PPF", 74, 42, InboxIcon),
      kpi("Erreurs", 5, 1, FileOutputIcon),
    ],
  },
};

export const Clickable: Story = {
  args: {
    items: [
      {
        ...kpi("Exports", 59404, 20026),
        onClick: () => {
          console.warn("Exports");
        },
      },
      {
        ...kpi("Imports", 74, 42, InboxIcon),
        onClick: () => {
          console.warn("Imports");
        },
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const WithError: Story = {
  args: {
    error: "Chargement impossible",
  },
};

export const WithPartialError: Story = {
  args: {
    items: [{ ...kpi("Flux F2 émis", 0, 0), error: "Chargement impossible" }, kpi("Flux F2 reçus", 1520, 12, InboxIcon)],
  },
};
