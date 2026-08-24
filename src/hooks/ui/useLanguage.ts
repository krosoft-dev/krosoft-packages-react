import * as React from "react";
import { useTranslation } from "react-i18next";

export interface LanguageOption {
  /** Code i18next de la langue (« fr », « en »). */
  value: string;
  /** Libellé affiché, écrit dans sa propre langue : « Français », « English ». */
  label: string;
  /** Icône du menu déroulant. Sans elle, le sélecteur affiche la même icône pour toutes les langues. */
  icon?: React.ComponentType<{ className?: string }>;
}

export interface UseLanguageResult {
  /** Langue d'i18next, telle quelle : elle peut être régionalisée (« en-GB »). */
  language: string;
  languageOptions: readonly LanguageOption[];
  currentLanguageOption: LanguageOption | undefined;
  nextLanguageOption: LanguageOption | undefined;
  changeLanguage: (language: string) => void;
  cycleLanguage: () => void;
}

/**
 * Langue courante et bascule, sur le modèle de `useTheme`.
 *
 * La langue d'i18next peut être régionalisée — un détecteur qui lit le navigateur
 * remonte « en-GB » là où l'application déclare « en » : on retombe donc sur la
 * langue de base avant de chercher l'option correspondante.
 */
export function useLanguage(languageOptions: readonly LanguageOption[]): UseLanguageResult {
  const { i18n } = useTranslation();

  const language = i18n.language ?? "";
  const baseLanguage = language.split("-")[0];

  const currentLanguageOption = languageOptions.find(o => o.value === language) ?? languageOptions.find(o => o.value === baseLanguage) ?? languageOptions[0];

  const currentIndex = languageOptions.findIndex(o => o.value === currentLanguageOption?.value);
  const nextLanguageOption = languageOptions.length > 0 ? languageOptions[(currentIndex + 1) % languageOptions.length] : undefined;

  const changeLanguage = (newLanguage: string): void => {
    void i18n.changeLanguage(newLanguage);
  };

  const cycleLanguage = (): void => {
    if (nextLanguageOption) {
      changeLanguage(nextLanguageOption.value);
    }
  };

  return {
    language,
    languageOptions,
    currentLanguageOption,
    nextLanguageOption,
    changeLanguage,
    cycleLanguage,
  };
}
