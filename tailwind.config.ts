import type { Config } from "tailwindcss";
import krosoftPreset from "./src/tailwind/index";

export default {
  presets: [krosoftPreset],
  content: ["./src/**/*.{ts,tsx}", "./stories/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          muted: "hsl(var(--sidebar-muted))",
        },
        topbar: {
          DEFAULT: "hsl(var(--topbar-background))",
          foreground: "hsl(var(--topbar-foreground))",
          primary: "hsl(var(--topbar-primary))",
          "primary-foreground": "hsl(var(--topbar-primary-foreground))",
          accent: "hsl(var(--topbar-accent))",
          "accent-foreground": "hsl(var(--topbar-accent-foreground))",
          border: "hsl(var(--topbar-border))",
          ring: "hsl(var(--topbar-ring))",
          muted: "hsl(var(--topbar-muted))",
        },
      },
    },
  },
} satisfies Config;
