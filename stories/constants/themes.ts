import { MonitorIcon, MoonIcon, SparklesIcon, SunIcon, WavesIcon } from "lucide-react";
import type { ThemeOption } from "@/hooks/ui/useTheme";

export const DEMO_THEME_OPTIONS: ThemeOption[] = [
  { value: "system", label: "Automatique", icon: MonitorIcon, message: "Suit les préférences système" },
  { value: "light", label: "Clair", icon: SunIcon },
  { value: "dark", label: "Sombre", icon: MoonIcon },
  { value: "dark-temporal", label: "Temporal", icon: SparklesIcon },
  { value: "dark-ocean", label: "Ocean", icon: WavesIcon },
];
