import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppStatusBadge } from "@/components/core/states/AppStatusBadge";
import { BADGE_COLORS, type BadgeColorName } from "@/helpers/badgeColor.helper";

const colorNames = Object.keys(BADGE_COLORS) as BadgeColorName[];

const meta: Meta<typeof AppStatusBadge> = {
  title: "Core/States/AppStatusBadge",
  component: AppStatusBadge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    color: { control: "select", options: colorNames },
  },
};

export default meta;
type Story = StoryObj<typeof AppStatusBadge>;

export const Default: Story = {
  args: {
    color: "green",
    children: "Actif",
  },
};

export const WithoutDot: Story = {
  args: {
    color: "blue",
    children: "En cours",
    dot: false,
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {[true, false].map(dot => (
        <div key={String(dot)} className="flex flex-wrap gap-2">
          {colorNames.map(name => (
            <AppStatusBadge key={name} color={name} dot={dot}>
              {name}
            </AppStatusBadge>
          ))}
        </div>
      ))}
    </div>
  ),
};
