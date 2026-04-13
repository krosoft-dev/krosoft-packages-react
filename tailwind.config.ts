import type { Config } from "tailwindcss";
import krosoftPreset from "./src/tailwind/index";

export default {
  presets: [krosoftPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./stories/**/*.{ts,tsx}",
  ],
} satisfies Config;
