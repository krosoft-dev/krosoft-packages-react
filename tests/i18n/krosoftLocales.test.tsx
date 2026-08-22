import { cleanup, render, screen } from "@testing-library/react";
import i18next, { type i18n as I18nInstance } from "i18next";
import * as React from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { afterEach, describe, expect, it } from "vitest";
import { ChartCard } from "../../src/components/core/charts/ChartCard";
import { KROSOFT_NAMESPACE, krosoftLocales, registerKrosoftLocales } from "../../src/i18n";

afterEach(() => {
  cleanup();
});

/** Instance dédiée : les tests ne doivent pas se marcher dessus via l'instance globale. */
const createInstance = async (language: string): Promise<I18nInstance> => {
  const instance = i18next.createInstance();
  await instance.use(initReactI18next).init({ lng: language, fallbackLng: "fr", resources: {}, interpolation: { escapeValue: false } });

  return instance;
};

describe("registerKrosoftLocales", () => {
  it("expose les traductions embarquées pour les deux langues", () => {
    expect(krosoftLocales.fr.states.noData).toBe("Aucune donnée disponible");
    expect(krosoftLocales.en.states.noData).toBe("No data available");
  });

  it("enregistre le namespace du package sur l'instance de l'application", async () => {
    const instance = await createInstance("fr");
    registerKrosoftLocales(instance);

    expect(instance.hasResourceBundle("fr", KROSOFT_NAMESPACE)).toBe(true);
    expect(instance.hasResourceBundle("en", KROSOFT_NAMESPACE)).toBe(true);
  });

  it("ne remplace pas une clé déjà personnalisée par l'application", async () => {
    const instance = await createInstance("fr");
    instance.addResourceBundle("fr", KROSOFT_NAMESPACE, { states: { noData: "Rien à afficher" } }, true, true);
    registerKrosoftLocales(instance);

    expect(instance.t(`${KROSOFT_NAMESPACE}:states.noData`)).toBe("Rien à afficher");
  });

  it("écrase les clés existantes quand on le demande explicitement", async () => {
    const instance = await createInstance("fr");
    instance.addResourceBundle("fr", KROSOFT_NAMESPACE, { states: { noData: "Rien à afficher" } }, true, true);
    registerKrosoftLocales(instance, { overwrite: true });

    expect(instance.t(`${KROSOFT_NAMESPACE}:states.noData`)).toBe("Aucune donnée disponible");
  });

  it("ignore une instance qui n'expose pas addResourceBundle", () => {
    expect(() => {
      registerKrosoftLocales({});
    }).not.toThrow();
  });
});

describe("libellés du package", () => {
  it("retombe sur le français quand l'application n'enregistre rien", () => {
    render(
      <ChartCard title="Ajouts par mois" isEmpty>
        <div>le graphe</div>
      </ChartCard>,
    );

    expect(screen.getByText("Aucune donnée disponible")).toBeTruthy();
  });

  it("suit la langue de l'application une fois les traductions enregistrées", async () => {
    const instance = await createInstance("en");
    registerKrosoftLocales(instance);

    render(
      <I18nextProvider i18n={instance}>
        <ChartCard title="Monthly additions" isEmpty>
          <div>the chart</div>
        </ChartCard>
      </I18nextProvider>,
    );

    expect(screen.getByText("No data available")).toBeTruthy();
  });

  it("suit une langue régionalisée en retombant sur la langue de base", async () => {
    // Cas d'une langue détectée depuis le navigateur : i18next conserve la région,
    // alors que les traductions du package sont enregistrées sous « en ».
    const instance = await createInstance("en-GB");
    registerKrosoftLocales(instance);

    render(
      <I18nextProvider i18n={instance}>
        <ChartCard title="Monthly additions" isEmpty>
          <div>the chart</div>
        </ChartCard>
      </I18nextProvider>,
    );

    expect(screen.getByText("No data available")).toBeTruthy();
  });

  it("retombe sur le français embarqué pour une clé absente du bundle enregistré", async () => {
    const instance = await createInstance("fr");
    // Bundle partiel : l'application n'a enregistré qu'une partie des clés.
    instance.addResourceBundle("fr", KROSOFT_NAMESPACE, { actions: { cancel: "Abandonner" } }, true, true);

    render(
      <I18nextProvider i18n={instance}>
        <ChartCard title="Ajouts par mois" isEmpty>
          <div>le graphe</div>
        </ChartCard>
      </I18nextProvider>,
    );

    expect(screen.getByText("Aucune donnée disponible")).toBeTruthy();
  });

  it("laisse l'application surcharger un libellé du package", async () => {
    const instance = await createInstance("fr");
    registerKrosoftLocales(instance);
    instance.addResourceBundle("fr", KROSOFT_NAMESPACE, { states: { noData: "Rien à afficher" } }, true, true);

    render(
      <I18nextProvider i18n={instance}>
        <ChartCard title="Ajouts par mois" isEmpty>
          <div>le graphe</div>
        </ChartCard>
      </I18nextProvider>,
    );

    expect(screen.getByText("Rien à afficher")).toBeTruthy();
  });
});
