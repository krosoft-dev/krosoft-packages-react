import type { Decorator, Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { krosoftDarkTheme } from "./theme";
import "../src/styles/globals.css";
import { applyTokenPreset } from "@/tokens";
import { DEMO_THEME_OPTIONS } from "../stories/constants/themes";
import { DEMO_TOKEN_FAMILIES } from "../stories/constants/tokens";

// Un Router global : plusieurs composants publiés (DataTable, navigation…) appellent des hooks
// react-router. Sans ce décorateur, toute story qui en rend un plante hors d'un <Router>.
const withRouter: Decorator = Story => React.createElement(MemoryRouter, null, React.createElement(Story));

// Construit depuis DEMO_THEME_OPTIONS — source de vérité unique pour les thèmes
const themes = Object.fromEntries(DEMO_THEME_OPTIONS.filter(o => o.value !== "system").map(o => [o.label, o.value === "light" ? "" : o.value]));

// Un seul décorateur pour toutes les familles de tokens : les presets sélectionnés
// sont posés en variables CSS sur <html>, ce que ferait un sélecteur runtime dans
// une application consommatrice. Ajouter une famille = une entrée dans
// DEMO_TOKEN_FAMILIES, rien d'autre.
const withTokens: Decorator = (Story, context) => {
  const globals = context.globals as Record<string, string | undefined>;

  for (const family of DEMO_TOKEN_FAMILIES) {
    const preset = globals[family.id];
    if (preset && preset in family.presets) {
      applyTokenPreset(family.presets, preset);
    }
  }

  return Story();
};

const tokenGlobalTypes = Object.fromEntries(
  DEMO_TOKEN_FAMILIES.map(family => [
    family.id,
    {
      description: `Preset de ${family.title.toLowerCase()} appliqué à tous les composants`,
      toolbar: {
        title: family.title,
        icon: family.icon,
        items: Object.keys(family.presets).map(value => ({ value, title: family.labels?.[value] ?? value })),
        dynamicTitle: true,
      },
    },
  ]),
);

const tokenInitialGlobals = Object.fromEntries(DEMO_TOKEN_FAMILIES.map(family => [family.id, family.defaultPreset]));

const preview: Preview = {
  // Tout composant publié a droit à son onglet Docs : le Storybook déployé est
  // la référence publique du design system.
  tags: ["autodocs"],
  parameters: {
    // Les pages Docs suivent le sombre du manager, sinon elles resteraient
    // blanches autour de stories rendues en sombre.
    docs: { theme: krosoftDarkTheme },
    options: {
      // L'ordre de la barre latérale est une décision, pas l'alphabet.
      storySort: { order: ["Introduction", "Design Tokens", "UI", "Core", "Hooks", "Démos"] },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: tokenGlobalTypes,
  initialGlobals: tokenInitialGlobals,
  decorators: [
    withRouter,
    withTokens,
    withThemeByClassName({
      themes,
      defaultTheme: "Sombre",
    }),
  ],
};

export default preview;
