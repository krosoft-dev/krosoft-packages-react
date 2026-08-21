import { useKrosoftTranslation } from "@/i18n";
import { useTheme as useNextTheme } from "next-themes";
import * as React from "react";
import { useNotifications } from "./useNotifications";

export interface ThemeOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  message?: string;
  hideInMini?: boolean;
}

export function useTheme(themeOptions: readonly ThemeOption[]) {
  const { t } = useKrosoftTranslation();
  const { showSuccess } = useNotifications();
  const { theme, setTheme } = useNextTheme();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    const option = themeOptions.find(o => o.value === newTheme);
    showSuccess(t("theme.updatedTitle"), t("theme.updatedMessage", { theme: option?.label ?? newTheme }));
  };

  const cyclableThemeOptions = themeOptions.filter(o => !o.hideInMini);
  const currentThemeOption = themeOptions.find(o => o.value === theme);
  const currentIndex = cyclableThemeOptions.findIndex(o => o.value === theme);
  const nextThemeOption = cyclableThemeOptions.length > 0 ? cyclableThemeOptions[(currentIndex + 1) % cyclableThemeOptions.length] : undefined;

  // true for "dark", "dark-temporal" and any future "dark-*" variant
  const isDark = theme?.startsWith("dark") ?? false;

  const cycleTheme = () => {
    if (nextThemeOption) {
      handleThemeChange(nextThemeOption.value);
    }
  };

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
