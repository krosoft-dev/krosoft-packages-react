import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";
import { version } from "../package.json";

// L'UI de Storybook (barre latérale, toolbar, panneaux) est en sombre par défaut.
// Les couleurs reprennent les tokens `--sidebar-*` du thème sombre du design
// system (src/styles/globals.css) pour que le chrome et les composants affichés
// dans la preview parlent la même langue.
const theme = create({
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

// La version dans la barre latérale : visible depuis n'importe quelle story,
// pas seulement depuis la page d'accueil.
addons.setConfig({ theme });
