import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { enGB, fr } from "date-fns/locale";
import i18next, { type i18n as I18nInstance } from "i18next";
import * as React from "react";
import { I18nextProvider, getI18n, initReactI18next, setI18n } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DatePicker } from "../../src/components/core/inputs/DatePicker";
import { DateRangePicker } from "../../src/components/core/inputs/DateRangePicker";
import { dateFnsLocale, registerKrosoftLocales } from "../../src/i18n";

/**
 * `initReactI18next` enregistre l'instance initialisée comme instance par défaut
 * de react-i18next : sans restauration, un test qui crée une instance anglaise
 * ferait passer les tests suivants « sans i18next » en anglais.
 */
let defaultInstance: I18nInstance | undefined;

beforeEach(() => {
  defaultInstance = getI18n();
});

afterEach(() => {
  cleanup();
  // `setI18n` restaure l'état initial, y compris l'absence d'instance par défaut.
  setI18n(defaultInstance as I18nInstance);
});

/** Instance dédiée : les tests ne doivent pas se marcher dessus via l'instance globale. */
const createInstance = async (language: string): Promise<I18nInstance> => {
  const instance = i18next.createInstance();
  await instance.use(initReactI18next).init({ lng: language, fallbackLng: "fr", resources: {}, interpolation: { escapeValue: false } });

  return instance;
};

/** Les en-têtes de jours sont dans un `thead` masqué aux lecteurs d'écran : pas de rôle ARIA à interroger. */
const weekdays = (container: HTMLElement): (string | null)[] => Array.from(container.querySelectorAll("th")).map(cell => cell.textContent);

const JUNE_2024 = new Date(2024, 5, 15);
const JUNE_2024_RANGE = { from: new Date(2024, 5, 3), to: new Date(2024, 5, 21) };

describe("dateFnsLocale", () => {
  it("résout les langues supportées", () => {
    expect(dateFnsLocale("fr")).toBe(fr);
    expect(dateFnsLocale("en")).toBe(enGB);
  });

  it("résout une langue régionalisée depuis sa langue de base", () => {
    // Cas d'une langue détectée depuis le navigateur : i18next conserve la région.
    expect(dateFnsLocale("en-GB")).toBe(enGB);
    expect(dateFnsLocale("fr-FR")).toBe(fr);
  });

  it("retombe sur le français sans langue ou pour une langue non supportée", () => {
    expect(dateFnsLocale(undefined)).toBe(fr);
    expect(dateFnsLocale("de")).toBe(fr);
  });

  it("démarre la semaine le lundi dans les deux langues", () => {
    // Ce que garantissait le `weekStartsOn={1}` codé en dur, désormais hérité de la locale.
    expect(fr.options?.weekStartsOn).toBe(1);
    expect(enGB.options?.weekStartsOn).toBe(1);
  });
});

describe("DatePicker", () => {
  it("affiche un calendrier français quand l'application n'enregistre rien", () => {
    const { container } = render(<DatePicker date={JUNE_2024} onDateChange={() => undefined} placeholder="Date" />);

    expect(screen.getByText("15/06/2024")).toBeTruthy();

    fireEvent.click(screen.getByRole("button"));

    expect(weekdays(container)).toEqual(["lu", "ma", "me", "je", "ve", "sa", "di"]);
  });

  it("suit la langue de l'application", async () => {
    const instance = await createInstance("en");
    registerKrosoftLocales(instance);

    const { container } = render(
      <I18nextProvider i18n={instance}>
        <DatePicker date={JUNE_2024} onDateChange={() => undefined} placeholder="Date" />
      </I18nextProvider>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(weekdays(container)).toEqual(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]);
    // `enGB` et non `enUS` : la date courte reste en JJ/MM/AAAA et la semaine démarre le lundi.
    expect(screen.getByText("15/06/2024")).toBeTruthy();
  });

  it("suit une langue régionalisée en retombant sur la langue de base", async () => {
    const instance = await createInstance("en-GB");
    registerKrosoftLocales(instance);

    const { container } = render(
      <I18nextProvider i18n={instance}>
        <DatePicker date={JUNE_2024} onDateChange={() => undefined} placeholder="Date" />
      </I18nextProvider>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(weekdays(container)).toEqual(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]);
  });
});

describe("DateRangePicker", () => {
  it("formate la période et libelle ses actions en français quand l'application n'enregistre rien", () => {
    render(<DateRangePicker value={JUNE_2024_RANGE} onChange={() => undefined} />);

    expect(screen.getByText("03 juin 2024 - 21 juin 2024")).toBeTruthy();

    fireEvent.click(screen.getByText("03 juin 2024 - 21 juin 2024"));

    expect(screen.getByText("Effacer")).toBeTruthy();
    expect(screen.getByText("Annuler")).toBeTruthy();
    expect(screen.getByText("Appliquer")).toBeTruthy();
  });

  it("formate la période et libelle ses actions dans la langue de l'application", async () => {
    const instance = await createInstance("en");
    registerKrosoftLocales(instance);

    render(
      <I18nextProvider i18n={instance}>
        <DateRangePicker value={JUNE_2024_RANGE} onChange={() => undefined} />
      </I18nextProvider>,
    );

    expect(screen.getByText("03 Jun 2024 - 21 Jun 2024")).toBeTruthy();

    fireEvent.click(screen.getByText("03 Jun 2024 - 21 Jun 2024"));

    expect(screen.getByText("Clear")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
    expect(screen.getByText("Apply")).toBeTruthy();
  });
});
