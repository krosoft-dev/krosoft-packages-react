/* eslint-disable @typescript-eslint/naming-convention */
import { create } from "storybook/theming/create";
import { version as repoVersion } from "../package.json";

// La version réellement publiée sur npm, injectée dans le `<head>` du manager et de
// la preview par `main.ts` — le manager n'est pas construit par Vite, il ne voit pas
// ses `define`. Repli sur la version du dépôt, figée à 0.0.1.
const version = (window as Window & { __KROSOFT_VERSION__?: string }).__KROSOFT_VERSION__ ?? repoVersion;

// Thème sombre partagé par l'UI de Storybook (barre latérale, toolbar, panneaux)
// et par les pages Docs. Les couleurs reprennent les tokens `--sidebar-*` et
// `--background` du thème sombre du design system (src/styles/globals.css) pour
// que le chrome et les composants affichés parlent la même langue.
export const krosoftDarkTheme = create({
  base: "dark",

  brandTitle: `Krosoft Design System — v${version}`,
  brandUrl: "https://www.npmjs.com/package/@krosoft/react",
  brandTarget: "_blank",

  // --sidebar-primary-* / --sidebar-ring
  colorPrimary: "#3b82f6",
  colorSecondary: "#3b82f6",

  // --sidebar-background pour la barre latérale, --background pour le reste.
  appBg: "#18181b",
  appContentBg: "#020817",
  appPreviewBg: "#020817",
  appBorderColor: "#27272a",
  appBorderRadius: 8,

  // --sidebar-foreground / --k-sidebar-muted
  textColor: "#fafafa",
  textInverseColor: "#18181b",
  textMutedColor: "#7c8087",

  // Toolbar au-dessus de la preview.
  barBg: "#18181b",
  barTextColor: "#a1a1aa",
  barHoverColor: "#fafafa",
  barSelectedColor: "#3b82f6",

  // Champ de recherche de la barre latérale et contrôles des addons.
  inputBg: "#27272a",
  inputBorder: "#3f3f46",
  inputTextColor: "#fafafa",
  inputBorderRadius: 8,

  buttonBg: "#27272a",
  buttonBorder: "#3f3f46",
  booleanBg: "#27272a",
  booleanSelectedBg: "#3f3f46",
});
