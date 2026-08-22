import type { LanguageOption } from "@/hooks/ui/useLanguage";

/** Les libellés sont écrits dans leur propre langue : un anglophone reconnaît « English » depuis une interface française. */
export const DEMO_LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
];
