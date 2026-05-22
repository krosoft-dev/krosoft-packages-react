import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "next-themes";
import { MonitorIcon, MoonIcon, SparklesIcon, SunIcon, WavesIcon } from "lucide-react";
import { useTheme, type ThemeOption } from "@/hooks/ui/useTheme";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/hooks/ui/useToast";

const DEMO_THEME_OPTIONS: ThemeOption[] = [
  { value: "system", label: "Automatique", icon: MonitorIcon },
  { value: "light", label: "Clair", icon: SunIcon },
  { value: "dark", label: "Sombre", icon: MoonIcon },
  { value: "dark-temporal", label: "Temporal", icon: SparklesIcon },
  { value: "dark-ocean", label: "Ocean", icon: WavesIcon },
];

const Toaster = () => {
  const { toasts } = useToast();
  return (
    <>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </>
  );
};

const UseThemeDemo = () => {
  const { theme, currentThemeOption, nextThemeOption, isDark, cycleTheme, handleThemeChange } = useTheme(DEMO_THEME_OPTIONS);
  const CurrentIcon = currentThemeOption?.icon;
  const NextIcon = nextThemeOption?.icon;

  return (
    <div className="flex flex-col gap-6 p-4 max-w-sm">
      <div className="rounded-md border p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">theme</span>
          <code className="font-mono">{theme ?? "—"}</code>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">isDark</span>
          <code className="font-mono">{String(isDark)}</code>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">currentThemeOption</span>
          <span className="flex items-center gap-1">
            {CurrentIcon && <CurrentIcon className="size-4" />}
            {currentThemeOption?.label ?? "—"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">nextThemeOption</span>
          <span className="flex items-center gap-1">
            {NextIcon && <NextIcon className="size-4" />}
            {nextThemeOption?.label ?? "—"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={cycleTheme}
        >
          {NextIcon && <NextIcon className="size-4" />}
          Passer en {nextThemeOption?.label}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {DEMO_THEME_OPTIONS.map(option => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-accent ${theme === option.value ? "border-primary bg-primary/10 font-medium" : ""}`}
            >
              <Icon className="size-4" />
              {option.label}
            </button>
          );
        })}
      </div>

      <Toaster />
    </div>
  );
};

const meta: Meta<typeof UseThemeDemo> = {
  title: "Hooks/useTheme",
  component: UseThemeDemo,
  decorators: [
    Story => (
      <ThemeProvider attribute="class" defaultTheme="system" themes={DEMO_THEME_OPTIONS.map(o => o.value)} enableSystem>
        <ToastProvider>
          <Story />
        </ToastProvider>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof UseThemeDemo>;

export const Default: Story = {};
