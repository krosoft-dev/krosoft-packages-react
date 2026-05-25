import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/styles/globals.css";
import { DEMO_THEME_OPTIONS } from "../stories/constants/themes";

// Construit depuis DEMO_THEME_OPTIONS — source de vérité unique pour les thèmes
const themes = Object.fromEntries(
  DEMO_THEME_OPTIONS
    .filter(o => o.value !== "system")
    .map(o => [o.label, o.value === "light" ? "" : o.value]),
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes,
      defaultTheme: "Clair",
    }),
  ],
};

export default preview;
