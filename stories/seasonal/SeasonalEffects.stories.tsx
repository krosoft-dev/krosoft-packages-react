import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toaster } from "@/components/ui/toaster";
import { SeasonalEffects, SeasonalEffectsSettings } from "@/seasonal";
import { mockToday } from "./mockToday";

const meta: Meta<typeof SeasonalEffects> = {
  title: "Seasonal/SeasonalEffects",
  component: SeasonalEffects,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Effets saisonniers plein écran, montés une fois à la racine de l'application. Chaque story fige la date du jour " +
          "sur la période de l'effet ; les interrupteurs de `SeasonalEffectsSettings` permettent de le couper ou de le relancer.",
      },
    },
  },
  args: { storagePrefix: "storybook_" },
  render: args => (
    <div className="min-h-screen p-8">
      <Toaster />
      <SeasonalEffects {...args} />
      <div className="max-w-md rounded-surface border bg-card p-6">
        <SeasonalEffectsSettings storagePrefix={args.storagePrefix} />
      </div>
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof SeasonalEffects>;

/** Flocons de neige, tout le mois de décembre. */
export const Snow: Story = {
  name: "Neige (décembre)",
  beforeEach: mockToday("2026-12-15"),
};

/** Citrouilles et chauves-souris, du 25 octobre au 2 novembre. */
export const Halloween: Story = {
  name: "Halloween (31 octobre)",
  beforeEach: mockToday("2026-10-31"),
};

/** Hors période : aucun effet, seul l'interrupteur neige reste visible. */
export const OffSeason: Story = {
  name: "Hors saison",
  beforeEach: mockToday("2026-06-15"),
};
