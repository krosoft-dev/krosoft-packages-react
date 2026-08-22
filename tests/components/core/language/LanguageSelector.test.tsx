import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import i18next, { type i18n as I18nInstance } from "i18next";
import * as React from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { afterEach, describe, expect, it } from "vitest";
import { LanguageSelector } from "../../../../src/components/core/language/LanguageSelector";
import type { LanguageOption } from "../../../../src/hooks/ui/useLanguage";
import { registerKrosoftLocales } from "../../../../src/i18n";

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
];

afterEach(() => {
  cleanup();
});

/** Instance dédiée : les tests ne doivent pas se marcher dessus via l'instance globale. */
const createInstance = async (language: string): Promise<I18nInstance> => {
  const instance = i18next.createInstance();
  await instance.use(initReactI18next).init({ lng: language, fallbackLng: "fr", resources: {}, interpolation: { escapeValue: false } });
  registerKrosoftLocales(instance);

  return instance;
};

const renderSelector = async (language: string, variant: "select" | "mini" = "select"): Promise<I18nInstance> => {
  const instance = await createInstance(language);

  render(
    <I18nextProvider i18n={instance}>
      <LanguageSelector languageOptions={LANGUAGE_OPTIONS} variant={variant} />
    </I18nextProvider>,
  );

  return instance;
};

describe("LanguageSelector", () => {
  it("affiche la langue courante", async () => {
    await renderSelector("fr");

    expect(screen.getByText("Français")).toBeTruthy();
    expect(screen.getByText("Choisissez la langue de l'interface")).toBeTruthy();
  });

  it("retombe sur la langue de base quand la langue est régionalisée", async () => {
    await renderSelector("en-GB");

    expect(screen.getByText("English")).toBeTruthy();
    expect(screen.getByText("Choose the interface language")).toBeTruthy();
  });

  it("bascule sur la langue suivante depuis le bouton mini", async () => {
    const instance = await renderSelector("fr", "mini");

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(instance.language).toBe("en");
    });
  });
});
