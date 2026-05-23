import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "next-themes";
import { MonitorIcon, MoonIcon, SparklesIcon, SunIcon, WavesIcon } from "lucide-react";
import { ThemeSelector } from "@/components/core/theme/ThemeSelector";
import { ToastProvider } from "@/components/ui/toast";
import type { ThemeOption } from "@/hooks/ui/useTheme";

const DEMO_THEME_OPTIONS: ThemeOption[] = [
  { value: "system", label: "Automatique", icon: MonitorIcon, message: "Suit les preferences systeme" },
  { value: "light", label: "Clair", icon: SunIcon },
  { value: "dark", label: "Sombre", icon: MoonIcon },
  { value: "dark-temporal", label: "Temporal", icon: SparklesIcon },
  { value: "dark-ocean", label: "Ocean", icon: WavesIcon },
];

const TWO_THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Clair", icon: SunIcon },
  { value: "dark", label: "Sombre", icon: MoonIcon },
];

const withProviders = (Story: React.ComponentType) => (
  <ThemeProvider attribute="class" defaultTheme="system" themes={DEMO_THEME_OPTIONS.map(o => o.value)} enableSystem>
    <ToastProvider>
      <div className="p-6">
        <Story />
      </div>
    </ToastProvider>
  </ThemeProvider>
);

const meta: Meta<typeof ThemeSelector> = {
  title: "Core/Theme/ThemeSelector",
  component: ThemeSelector,
  decorators: [withProviders],
};

export default meta;

type Story = StoryObj<typeof ThemeSelector>;

export const SelectVariant: Story = {
  args: {
    themeOptions: DEMO_THEME_OPTIONS,
    variant: "select",
  },
  render: args => (
    <div className="w-72">
      <ThemeSelector {...args} />
    </div>
  ),
};

export const MiniVariant: Story = {
  args: {
    themeOptions: DEMO_THEME_OPTIONS,
    variant: "mini",
  },
};

export const TwoThemesSelect: Story = {
  decorators: [
    Story => (
      <ThemeProvider attribute="class" defaultTheme="light" themes={["light", "dark"]} enableSystem>
        <ToastProvider>
          <div className="p-6">
            <Story />
          </div>
        </ToastProvider>
      </ThemeProvider>
    ),
  ],
  args: {
    themeOptions: TWO_THEME_OPTIONS,
    variant: "select",
  },
  render: args => (
    <div className="w-56">
      <ThemeSelector {...args} />
    </div>
  ),
};

export const TwoThemesMini: Story = {
  decorators: [
    Story => (
      <ThemeProvider attribute="class" defaultTheme="light" themes={["light", "dark"]} enableSystem>
        <ToastProvider>
          <div className="p-6">
            <Story />
          </div>
        </ToastProvider>
      </ThemeProvider>
    ),
  ],
  args: {
    themeOptions: TWO_THEME_OPTIONS,
    variant: "mini",
  },
};

export const BothVariants: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">select</p>
        <div className="w-64">
          <ThemeSelector themeOptions={DEMO_THEME_OPTIONS} variant="select" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">mini</p>
        <ThemeSelector themeOptions={DEMO_THEME_OPTIONS} variant="mini" />
      </div>
    </div>
  ),
};
