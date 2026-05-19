import type { Config } from "tailwindcss";
import krosoftPreset from "./src/tailwind/index";

export default {
  presets: [krosoftPreset],
  content: ["./src/**/*.{ts,tsx}", "./stories/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "hsl(var(--navbar-background))",
          foreground: "hsl(var(--navbar-foreground))",
          primary: "hsl(var(--navbar-primary))",
          "primary-foreground": "hsl(var(--navbar-primary-foreground))",
          accent: "hsl(var(--navbar-accent))",
          "accent-foreground": "hsl(var(--navbar-accent-foreground))",
          border: "hsl(var(--navbar-border))",
          ring: "hsl(var(--navbar-ring))",
          muted: "hsl(var(--navbar-muted))",
        },
      },
    },
  },
} satisfies Config;
