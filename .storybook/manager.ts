/* eslint-disable @typescript-eslint/naming-convention */
import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";
import { version as repoVersion } from "../package.json";

// Version publiée sur npm, injectée par `managerHead` (voir main.ts). En secours,
// la version du dépôt — qui n'est pas celle du registre, mais vaut mieux que rien.
const version = (window as Window & { __KROSOFT_VERSION__?: string }).__KROSOFT_VERSION__ ?? repoVersion;

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
