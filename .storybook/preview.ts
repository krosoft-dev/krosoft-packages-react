import type { Decorator, Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/styles/globals.css";
import { DEMO_THEME_OPTIONS } from "../stories/constants/themes";

// Construit depuis DEMO_THEME_OPTIONS — source de vérité unique pour les thèmes
const themes = Object.fromEntries(
  DEMO_THEME_OPTIONS
    .filter(o => o.value !== "system")
    .map(o => [o.label, o.value === "light" ? "" : o.value]),
);

// Reflète le preset de radius sélectionné sur <html data-radius="…">,
// exactement comme une application consommatrice le ferait.
const withRadius: Decorator = (Story, context) => {
  document.documentElement.setAttribute("data-radius", context.globals.radius as string);
  return Story();
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    radius: {
      description: "Preset de radius appliqué à tous les composants",
      toolbar: {
        title: "Radius",
        icon: "component",
        items: [
          { value: "soft", title: "Soft (défaut)" },
          { value: "square", title: "Square" },
          { value: "round", title: "Round" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    radius: "soft",
  },
  decorators: [
    withRadius,
    withThemeByClassName({
      themes,
      defaultTheme: "Clair",
    }),
  ],
};

export default preview;
