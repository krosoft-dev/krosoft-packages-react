import { addons } from "storybook/manager-api";

import { krosoftDarkTheme } from "./theme";

// L'UI de Storybook est en sombre par défaut, et la version s'affiche dans la
// barre latérale : visible depuis n'importe quelle story, pas seulement depuis
// la page d'accueil.
addons.setConfig({ theme: krosoftDarkTheme });
