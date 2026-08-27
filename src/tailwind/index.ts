/* eslint-disable @typescript-eslint/naming-convention */
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * Fichiers du package à scanner par Tailwind.
 *
 * Tailwind n'additionne pas les `content` : celui du projet écrase purement et
 * simplement celui de ses presets — `resolveConfig` garde le dernier déclaré,
 * quelle que soit la forme utilisée (tableau ou `{ files }`). Un preset ne peut
 * donc pas déclarer les fichiers qu'il faut scanner pour lui : c'est au projet
 * d'étaler cette constante dans son propre `content`, sinon aucune classe des
 * composants du package n'est générée (`rounded-control`, `bg-topbar`,
 * `animate-in`…) et ils s'affichent sans style.
 */
export const krosoftContent = ["./node_modules/@krosoft/react/dist/**/*.js"];

/**
 * Preset Tailwind CSS partagé par les projets @krosoft/react.
 *
 * Regroupe les tokens de design shadcn/ui communs à tous les projets :
 * - configuration du mode sombre ;
 * - réglages du conteneur ;
 * - mapping des couleurs de base (border, input, ring, background, foreground, primary…) ;
 * - tokens de rayon de bordure ;
 * - keyframes & animations de l'accordéon ;
 * - plugin tailwindcss-animate.
 *
 * Utilisation dans le tailwind.config.ts d'un projet consommateur :
 *
 * ```ts
 * import krosoftPreset, { krosoftContent } from "@krosoft/react/tailwind";
 *
 * export default {
 *   presets: [krosoftPreset],
 *   content: [...krosoftContent, "./src/**\/*.{ts,tsx}"],
 *   theme: {
 *     extend: {
 *       // surcharges spécifiques au projet
 *     },
 *   },
 * } satisfies Config;
 * ```
 */
const krosoftPreset = {
  // Les thèmes sombres sont des classes posées sur <html> ("dark", "dark-temporal", "dark-forest"…)
  // et CSS n'a pas de syntaxe .dark*. [class*='dark'] la simulait, mais la sous-chaîne matche aussi
  // le préfixe des utilitaires eux-mêmes (class="dark:bg-gray-900") : n'importe quel ancêtre portant
  // une classe dark:* activait donc le mode sombre sur tout son sous-arbre, même en thème clair.
  // Matcher "dark" comme classe entière, plus tout ce qui contient "dark-", couvre la famille .dark*
  // sans ce faux positif.
  darkMode: ["class", ':is([class~="dark"],[class*="dark-"])'],
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

        // Couleurs ajoutées par krosoft (variables préfixées --k-). Les composants
        // du package utilisent ces classes (bg-success, text-topbar-foreground,
        // text-sidebar-muted…) : sans ce mapping, elles ne sont pas générées et
        // chaque projet consommateur doit les redéclarer de son côté.
        success: {
          DEFAULT: "hsl(var(--k-success))",
          foreground: "hsl(var(--k-success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--k-warning))",
          foreground: "hsl(var(--k-warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--k-info))",
          foreground: "hsl(var(--k-info-foreground))",
        },
        // Palette des séries de graphes : utilisable en classes (fill-chart-1,
        // text-chart-2…) pour les légendes et pastilles rendues hors du SVG.
        chart: {
          1: "hsl(var(--k-chart-1))",
          2: "hsl(var(--k-chart-2))",
          3: "hsl(var(--k-chart-3))",
          4: "hsl(var(--k-chart-4))",
          5: "hsl(var(--k-chart-5))",
        },
        // sidebar-* vient de shadcn, seul --k-sidebar-muted est un ajout krosoft.
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: {
            DEFAULT: "hsl(var(--sidebar-primary))",
            foreground: "hsl(var(--sidebar-primary-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--sidebar-accent))",
            foreground: "hsl(var(--sidebar-accent-foreground))",
          },
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          muted: "hsl(var(--k-sidebar-muted))",
        },
        topbar: {
          DEFAULT: "hsl(var(--k-topbar-background))",
          foreground: "hsl(var(--k-topbar-foreground))",
          primary: {
            DEFAULT: "hsl(var(--k-topbar-primary))",
            foreground: "hsl(var(--k-topbar-primary-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--k-topbar-accent))",
            foreground: "hsl(var(--k-topbar-accent-foreground))",
          },
          border: "hsl(var(--k-topbar-border))",
          ring: "hsl(var(--k-topbar-ring))",
          muted: "hsl(var(--k-topbar-muted))",
        },
      },
      borderRadius: {
        // Tokens sémantiques krosoft (préfixe --k-) — à privilégier dans les
        // composants. Ils garantissent qu'un input, un bouton et une pastille de
        // filtre posés côte à côte partagent toujours la même forme. Le repli sur
        // --radius laisse un projet purement shadcn fonctionner sans les déclarer.
        control: "var(--k-radius-control, var(--radius))",
        surface: "var(--k-radius-surface, var(--radius))",
        // Échelle historique, dérivée de --radius : réservée aux éléments
        // internes (items de menu, checkbox, poignées…) qui ne doivent jamais
        // devenir des capsules. max() protège le preset "square" (--radius: 0).
        lg: "var(--radius)",
        md: "max(0px, calc(var(--radius) - 2px))",
        sm: "max(0px, calc(var(--radius) - 4px))",
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
        progress: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        progress: "progress 1.5s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  // Les composants shadcn du package utilisent `animate-in`, `fade-in-0`,
  // `zoom-in-95`, `slide-in-from-*`… Sans ce plugin, ces classes ne sont pas
  // générées et les overlays (dialog, popover, select, dropdown) s'affichent
  // sans transition. Le plugin est porté par le preset pour que les projets
  // consommateurs n'aient rien à déclarer de leur côté.
  plugins: [tailwindcssAnimate],
  // Partial<Config> et non Config : c'est le type d'un preset (`presets: Array<Partial<Config>>`).
  // Un preset ne déclare pas de `content` — voir krosoftContent ci-dessus.
} satisfies Partial<Config>;

export default krosoftPreset;
