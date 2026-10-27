import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toaster } from "@/components/ui/toaster";
import { SeasonalEffectsSettings } from "@/seasonal";

const meta: Meta<typeof SeasonalEffectsSettings> = {
  title: "Seasonal/SeasonalEffectsSettings",
  component: SeasonalEffectsSettings,
  parameters: {
    docs: {
      description: {
        component:
          "Interrupteurs des effets saisonniers (neige en décembre, Halloween du 25 octobre au 2 novembre). " +
          "L'interrupteur Halloween n'apparaît que pendant sa période. Les effets eux-mêmes se montent via `<SeasonalEffects />`.",
      },
    },
  },
  args: { storagePrefix: "storybook_" },
};

export default meta;

type Story = StoryObj<typeof SeasonalEffectsSettings>;

export const Default: Story = {
  render: args => (
    <div className="max-w-md">
      <Toaster />
      <SeasonalEffectsSettings {...args} />
    </div>
  ),
};
