import { useTheme as useNextTheme } from "next-themes";
import * as React from "react";
import { useNotifications } from "./useNotifications";

export interface ThemeOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  message?: string;
}

export function useTheme(themeOptions: readonly ThemeOption[]) {
  const { showSuccess } = useNotifications();
  const { theme, setTheme } = useNextTheme();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    const option = themeOptions.find(o => o.value === newTheme);
    showSuccess("Thème mis à jour", `Le thème a été changé vers ${option?.label ?? newTheme}.`);
  };

  const currentThemeOption = themeOptions.find(o => o.value === theme);
  const currentIndex = themeOptions.findIndex(o => o.value === theme);
  const nextThemeOption = themeOptions[(currentIndex + 1) % themeOptions.length];

  // true for "dark", "dark-temporal" and any future "dark-*" variant
  const isDark = theme?.startsWith("dark") ?? false;

  const cycleTheme = () => handleThemeChange(nextThemeOption.value);

  return {
    theme,
    setTheme,
    handleThemeChange,
    themeOptions,
    currentThemeOption,
    nextThemeOption,
    isDark,
    cycleTheme,
  };
}
