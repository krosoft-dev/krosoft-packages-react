import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";
import { version } from "../package.json";

// La version dans la barre latérale : visible depuis n'importe quelle story,
// pas seulement depuis la page d'accueil.
addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: `Krosoft Design System — v${version}`,
    brandUrl: "https://www.npmjs.com/package/@krosoft/react",
    brandTarget: "_blank",
  }),
});
