import type { Config } from "tailwindcss";
import krosoftPreset from "./src/tailwind/index";

// Les couleurs sidebar/topbar/success/warning/info viennent du preset partagé :
// les redéclarer ici les ferait diverger des variables de globals.css.
export default {
  presets: [krosoftPreset],
  content: ["./src/**/*.{ts,tsx}", "./stories/**/*.{ts,tsx}"],
} satisfies Config;
