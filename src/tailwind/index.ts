import type { Config } from "tailwindcss";

/**
 * Shared Tailwind CSS preset for @krosoft/react projects.
 *
 * Contains the common shadcn/ui design tokens shared across all projects:
 * - Dark mode configuration
 * - Container settings
 * - Base color mappings (border, input, ring, background, foreground, primary, etc.)
 * - Border radius tokens
 * - Accordion keyframes & animations
 * - Content scanning for @krosoft/react compiled components
 *
 * Usage in a consuming project's tailwind.config.ts:
 *
 * ```ts
 * import krosoftPreset from "@krosoft/react/tailwind";
 *
 * export default {
 *   presets: [krosoftPreset],
 *   content: ["./src/**\/*.{ts,tsx}"],
 *   theme: {
 *     extend: {
 *       // project-specific overrides
 *     },
 *   },
 * } satisfies Config;
 * ```
 */
const krosoftPreset = {
  darkMode: "class",
  content: ["./node_modules/@krosoft/react/dist/**/*.js"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
} satisfies Config;

export default krosoftPreset;
